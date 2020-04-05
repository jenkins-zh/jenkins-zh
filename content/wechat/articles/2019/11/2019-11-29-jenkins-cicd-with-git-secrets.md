---
title: "Jenkins CI/CD 集成 Git Secrets"
description: "本教程将 Git Secrets 与 Jenkins CI/CD 流水线联系起来"
date: 2019-11-29
original: "https://dzone.com/articles/jenkins-cicd-with-git-secrets"
tags:
- Jenkins 流水线
- Git Secrets
keywords:
- Jenkins 流水线
- Git Secrets
author: Aditya C S 
translator: zhaoying818
poster: connection-netwok.jpg
---

![Connect all your Git secrets to the Jenkins pipeline](connection-netwok.jpg)

通常，对我们在代码中使用的机密或凭据进行加密，然后将其保存在安全的地方。我们可以有很多选择来实现这一目标，例如使用 Vault 和 Git-crypt 等工具来。[git-secret](https://git-secret.io/) 是一个简单的工具，我们可以使用它在 Git 仓库中存储密钥。Git-secret 使用 gpg 加密和解密密钥。

git-secret 的工作方式如下。进入仓库中要加密文件的文件夹，然后，运行 `git init && git secret init`。这将初始化 `.gitsecret` 文件夹，然后运行 `git secret tell $email`，如果您希望其他用户解密密钥文件，则必须导入其 gpg 公钥，然后再次运行 `git secret tell $otheruseremailid`。现在您可以运行 `git secret add $secretfilename` 和 `git secret hide`，这将创建名为 `$secretfilename.secret` 的加密的密钥文件。

**或许你会对[在 Git 中存储加密的凭据](https://dzone.com/articles/storing-encrypted-credentials-in-git)感兴趣。**

现在，您可以提交 master 分支库了。git-secret 自动将 `$secretfile` 添加到 `.gitignore`，因此您只需提交 `$secretfile.secret` 文件。
 
将 git-secret 集成到 Jenkins 中的主要挑战是 git-secret 使用 gpg 私钥和公钥。如果我们必须运行 `git secret reveal`，我们应该有一个 gpg 私钥。因此，我们如何在 Jenkins 上运行它，怎样使用一个从节点来拉取仓库并进行构建，如果您必须在从节点展示 git secret，则应该在从节点拥有 gpg 私钥。 我们如何在 Jenkins 流水线中实现这种加密和解密？

这些步骤将说明在 Jenkins 流水线中使用 git-secret 的方法。

## 在 Jenkins 上运行 git-secret

1.导出 gpg 私钥。

```
gpg -a --export-secret-keys $keyid > gpg-secret.key
gpg --export-ownertrust > gpg-ownertrust.txt
```
你将通过运行 `gpg --list-secret-keys` 获得密钥 ID。
此处的 `E7CD2140FEC5B45F42860B2CC19824F8BC975ABCD` 是密钥 ID。
```
sec   rsa4096 2019-09-17 [SC]

      E7CD2140FEC5B45F42860B2CC19824F8BC975ABCD

uid           [ultimate] Test (test gpg key) <test@domain.com>
```

2.将导出的 gpg 密钥和所有者信任作为 `secret file` 添加到 Jenkins 凭证。 下图展示了添加私钥作为 Jenkins 凭据。以相同的方式添加所有者信任文件。

![Add a private key as Jenkins credentials](secret-file.png)

3.添加 gpg 私钥的密码短语作为 `secret text`。下图演示了这一点。

![Add a passphrase of gpg private key as credentials as a kind secret text](secret-text.png)

4.在 Jenkins 流水线中使用添加的 gpg 私钥、所有者信任文件和密码短语。这里的 "gpg-secret"、"gpg-trust" 和 "gpg-passphrase" 是添加 Jenkins 凭据时给出的 ID。

```
pipeline {
     agent { 
        node { 
            label 'test_slave' 
        } 
    }

    environment {
        gpg_secret = credentials("gpg-secret")
        gpg_trust = credentials("gpg-trust")
        gpg_passphrase = credentials("gpg-passphrase")
    }

    stages { 
        stage("Import GPG Keys") {
            steps {
                sh """
                    gpg --batch --import $gpg_secret
                    gpg --import-ownertrust $gpg_trust
                """
            }
        }

        stage("Reveal Git Secrets") {
            steps {
                sh """
                    cd $WORKSPACE/$yoursecretfolder
                    git init
                    git-secret reveal -p '$gpg_passphrase'
                """
            }
        }
    }
}

```

![Connect all your Git secrets to the Jenkins pipeline](small-connection-netwok.jpg)

我希望本文能清楚地解释如何在 Jenkins 流水线中使用 git-secrets。

## 进一步阅读

[避免将安全凭据传递给 GitHub ](https://dzone.com/articles/avoid-passing-security-credentials-to-github)

[如何将 GitHub 仓库集成到 Jenkins 项目](https://dzone.com/articles/how-to-integrate-your-github-repository-to-your-je)
