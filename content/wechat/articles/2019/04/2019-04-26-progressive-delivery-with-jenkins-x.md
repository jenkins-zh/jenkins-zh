---
title: "使用 Jenkins X 渐进式交付"
description: "使用 Jenkins X 渐进式交付"
date: 2019-04-26
tags:
- progressive delivery
- kubernetes
- k8s
- jenkins
- jenkins x
- shipper
- istio
- flagger
author: Carlos Sanchez
translator: donhui
original: https://blog.csanchez.org/2019/01/24/progressive-delivery-with-jenkins-x/
---

这是渐进式交付系列的第二篇文章，第一篇请看：[Kubernetes 中的渐进式交付：蓝绿部署和金丝雀部署](https://blog.csanchez.org/2019/01/22/progressive-delivery-in-kubernetes-blue-green-and-canary-deployments/)。

![kubernetes.png](kubernetes.png)

我使用的我的 [Croc Hunter 示例项目](https://github.com/carlossg/croc-hunter-jenkinsx-serverless)评估了 Jenkins X 中金丝雀部署和蓝绿色部署的三种渐进式交付方案。
- Shipper 为 Jenkins X 构建的 Helm 图表启用了蓝绿部署和多集群部署，但是对图表的内容有限制。
你可以在 staging 和生产环境之间做蓝绿部署。
- Istio 允许通过创建一个虚拟服务将一定比例的流量发送到 staging 或预览环境。
- Flagger 构建在 Istio 之上，并添加了金丝雀部署，可以根据指标自动进行滚动部署和回滚。
Jenkins X 可以通过创建一个 Canary 对象自动启用金丝雀功能，从而实现优雅的滚动部署，以升级到生产环境。

这里可以查看 [Shipper](https://github.com/carlossg/croc-hunter-jenkinsx-serverless/tree/master/shipper)、[Isito](https://github.com/carlossg/croc-hunter-jenkinsx-serverless/tree/master/istio) 和 [Flager](https://github.com/carlossg/croc-hunter-jenkinsx-serverless/tree/master/flagger) 的示例代码。

## Shipper

由于 Shipper 对创建的 Helm 图表有多个限制，因此我必须对应用做一些更改。
而且 Jenkins X 只从 master 分支构建 Helm 包，所以我们不能做 PRs 的滚动部署，只能对 master 分支做滚动部署。

应用标签不能包含发布名称，例如： `app: {{ template “fullname” . }} ` 不起作用，
需要一些类似这样的标签： `app: {{ .Values.appLabel }}`。

由 Jenkins X 生成的图表导致应用滚动失败，归因于生成的 `templates/release.yaml` 可能和 `jenkins.io/releases CRD` 冲突。

```yaml
Chart croc-hunter-jenkinsx-0.0.58 failed to render:
could not decode manifest: no kind "Release" is registered for version "jenkins.io/v1"
```

我们只需要将 `jx step changelog` 更改为 `jx step changelog -generate-yaml =false` ，这样就不会生成文件。

在多集群环境，需要在 shipper 应用 yaml 中为 chartmuseum 和 docker registry 使用公开的 url，以便其他集群可以发现管理集群服务来下载图表。

## Istio

我们可以创建这个虚拟服务，
将所有进入 Ingress 网关的主机为 `croc-hunter.istio.example.org` 的请求的
 1% 的流量发送到 Jenkins X 预览环境( PR 号为 35 )。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
 name: croc-hunter-jenkinsx
 namespace: jx-production
spec:
 gateways:
 - public-gateway.istio-system.svc.cluster.local
 - mesh
 hosts:
 - croc-hunter.istio.example.com
 http:
 - route:
   - destination:
       host: croc-hunter-jenkinsx.jx-production.svc.cluster.local
       port:
         number: 80
     weight: 99
   - destination:
       host: croc-hunter-jenkinsx.jx-carlossg-croc-hunter-jenkinsx-serverless-pr-35.svc.cluster.local
       port:
         number: 80
```

## Flagger

我们可以为 Jenkins X 在 jx-production 命名空间中部署的图表创建一个 Canary 对象，
所有新的 Jenkins X 对 jx-production 的 promotions 每次将自动滚动 10% ，
如果出现任何失败，将自动回滚。

```yaml
apiVersion: flagger.app/v1alpha2
kind: Canary
metadata:
  # canary name must match deployment name
  name: jx-production-croc-hunter-jenkinsx
  namespace: jx-production
spec:
  # deployment reference
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: jx-production-croc-hunter-jenkinsx
  # HPA reference (optional)
  # autoscalerRef:
  #   apiVersion: autoscaling/v2beta1
  #   kind: HorizontalPodAutoscaler
  #   name: jx-production-croc-hunter-jenkinsx
  # the maximum time in seconds for the canary deployment
  # to make progress before it is rollback (default 600s)
  progressDeadlineSeconds: 60
  service:
    # container port
    port: 8080
    # Istio gateways (optional)
    gateways:
    - public-gateway.istio-system.svc.cluster.local
    # Istio virtual service host names (optional)
    hosts:
    - croc-hunter.istio.example.com
  canaryAnalysis:
    # schedule interval (default 60s)
    interval: 15s
    # max number of failed metric checks before rollback
    threshold: 5
    # max traffic percentage routed to canary
    # percentage (0-100)
    maxWeight: 50
    # canary increment step
    # percentage (0-100)
    stepWeight: 10
    metrics:
    - name: istio_requests_total
      # minimum req success rate (non 5xx responses)
      # percentage (0-100)
      threshold: 99
      interval: 1m
    - name: istio_request_duration_seconds_bucket
      # maximum req duration P99
      # milliseconds
      threshold: 500
      interval: 30s
```
