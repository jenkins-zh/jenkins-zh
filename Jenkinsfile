pipeline {
    agent {
        label "hugo"
    }

    options {
        disableConcurrentBuilds()
        quietPeriod 5
        timeout(time: 30, unit: 'MINUTES')
    }

	parameters {
        string defaultValue: '', description: '', name: 'previewUpstream', trim: true
        string defaultValue: '', description: '', name: 'previewUpstreamPR', trim: true
    }

    triggers {
        upstream(upstreamProjects: 'jenkins-zh/wechat/master/,jenkins-zh/hugo-jenkins-theme/master/', threshold: hudson.model.Result.SUCCESS)
    }

    stages{
        stage("Fetch source"){
            failFast true
			parallel {
                stage('Clone site'){
                    steps{
                        gitClone('https://github.com/jenkins-zh/jenkins-zh.github.io', 'jenkins-zh.github.io')
                    }
                }
                stage("Fetch theme"){
                    steps{
                        gitClone('https://github.com/jenkins-zh/hugo-jenkins-theme', 'themes/hugo-jenkins-theme')
                    }
                }
                stage("Fetch wechat articles"){
                    steps{
                        gitClone('https://github.com/jenkins-infra/wechat', 'content/wechat')

                        script{
                            if(params.previewUpstreamPR != ''){
                                sh 'cd content/wechat && git fetch origin +refs/pull/' + params.previewUpstreamPR + '/merge'
                                sh '''
                                cd content/wechat && git checkout FETCH_HEAD
                                '''
                            }
                        }

                        sh '''
                        pwd
                        ls -ahl
                        cd content/wechat/articles && rm sample.md && find . -name *.md -exec mv {} . \\;
                        rm -rfv content/wechat/articles/2018
                        rm -rfv content/wechat/images/*.md
                        rm -rfv content/wechat/management/
                        rm -rfv content/wechat/*.md
                        '''
                    }
                }
            }
        }
        stage("Build"){
            steps{
                script {
                    def baseUrl = "https://jenkins-zh.cn/"
                    def environment = "production"
                    if(params.previewUpstream != ''){
                        baseUrl = "http://" + params.previewUpstream.toLowerCase() + ".preview.jenkins-zh.cn/"
                        environment = "preview"
                    }else if (env.BRANCH_NAME != "master") {
                        baseUrl = "http://" + env.BRANCH_NAME.toLowerCase() + ".preview.jenkins-zh.cn/"
                        baseUrl = "http://" + params.previewUpstream.toLowerCase() + ".preview.jenkins-zh.cn/"
                        environment = "preview"
                    }
                    hugo destination: 'jenkins-zh.github.io', buildFuture: true, verbose: true, baseUrl: baseUrl, environment: environment
                }
            }
        }
        stage("Image"){
            when {
                anyOf {
                    expression {
                        return params.previewUpstream != ''
                    }
                    not {
                        branch 'master'
                    }
                }
            }
            steps{
                container('tools'){
                    script {
                        if(params.previewUpstream != ''){
                            env.BRANCH_NAME = params.previewUpstream
                        } else {
                            echo 'preview upstream is: ' + params.previewUpstream + '.'
                        }
                        env.BRANCH_NAME = env.BRANCH_NAME.toLowerCase()
                        withCredentials([usernamePassword(credentialsId: 'jenkins-zh-docker', passwordVariable: 'PASSWD', usernameVariable: 'USER')]) {
                            sh '''
                            docker build . -t surenpi/jenkins-zh:v$BRANCH_NAME-$BUILD_ID
                            docker login --username $USER --password $PASSWD
                            '''
                            retry(3) {
                                timeout(3) {
                                    sh '''
                                    docker push surenpi/jenkins-zh:v$BRANCH_NAME-$BUILD_ID
                                    docker logout
                                    '''
                                }
                            }
                        }
                    }
                }
            }
        }
        stage("Preview"){
            when {
                allOf {
                    expression {
                        return params.previewUpstream != ''
                    }
                    not {
                        branch 'master'
                    }
                    expression {
                        return false // skip this stage for tech reason
                    }
                }
            }
            steps{
                container('tools'){
                    sh '''
                    rm -rfv website-ns.yaml website-deploy.yaml website-ingress.yaml website-service.yaml
                    '''

                    script{
                        if(params.previewUpstream != ''){
                            env.BRANCH_NAME = params.previewUpstream
                        }
                        env.BRANCH_NAME = env.BRANCH_NAME.toLowerCase()
                        def website = readYaml file: "config/website.yaml"

                        for(item in website){
                            switch(item.kind) {
                                case "Deployment":
                                item.spec.template.spec.containers[0].image = "surenpi/jenkins-zh:v$BRANCH_NAME-$BUILD_ID"
                                echo 'going to write website-deploy.yaml'
                                break;
                                case "Ingress":
                                item.spec.rules[0].host = "${BRANCH_NAME}.preview.jenkins-zh.cn"
                                echo 'going to write website-ingress.yaml'
                                break;
                                case "Namespace":
                                item.metadata.name = "${BRANCH_NAME}"
                                echo 'going to write website-ns.yaml'
                                break;
                            }
                        }

                        writeYaml file: 'website-ns.yaml', data: website[0]
                        writeYaml file: 'website-deploy.yaml', data: website[1]
                        writeYaml file: 'website-service.yaml', data: website[2]
                        writeYaml file: 'website-ingress.yaml', data: website[3]
                        sh '''
                        cat website-ns.yaml
                        kubectl apply -f website-ns.yaml
                        cat website-deploy.yaml
                        kubectl apply -f website-deploy.yaml -n $BRANCH_NAME
                        cat website-service.yaml
                        kubectl apply -f website-service.yaml -n $BRANCH_NAME
                        cat website-ingress.yaml
                        kubectl apply -f website-ingress.yaml -n $BRANCH_NAME
                        '''

                        if(params.previewUpstream != '') {
                            echo 'preview upstream is: ' + params.previewUpstream
                        } else {
                            pullRequest.createStatus(status: 'success',
                                context: 'continuous-integration/jenkins/pr-merge/preview',
                                description: 'Website preview',
                                targetUrl: "http://${BRANCH_NAME}.preview.jenkins-zh.cn")
                        }
                    }
                }
            }
        }
        stage("Publish"){
            when {
                allOf {
                    expression {
                        return params.previewUpstream == ''
                    }
                    branch 'master'
                }
            }
            steps{
                hugoGitPublish authorEmail: 'linuxsuren@gmail.com', authorName: 'suren',
                    commitLog: 'Auto commit by hugo-plugin.',
                    publishDir: 'jenkins-zh.github.io',
                    committerEmail: 'linuxsuren@gmail.com', committerName: 'suren',
                    credentialsId: 'a832798a-0513-4d45-a47a-95d152dc915a',
                    publishBranch: env.BRANCH_NAME,
                    targetUrl: 'https://github.com/jenkins-zh/jenkins-zh.github.io'
            }
        }
        stage("Notify"){
            when {
                allOf {
                    expression {
                        return params.previewUpstream == ''
                    }
                    branch 'master'
                }
            }
            steps{
                mail from: 'admin@mail.jenkins-zh.cn',
                    to: 'developer@mail.jenkins-zh.cn',
                    subject: 'Jenkins 中文社区网站发布成功！', 
                    body: '访问地址 https://jenkins-zh.cn/'
            }
        }
    }
}

def gitClone(url, subDir){
    checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: subDir]], submoduleCfg: [], userRemoteConfigs: [[url: url]]])
}
