pipeline {
    agent {
        label "hugo"
    }

    options {
        disableConcurrentBuilds()
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
                    if (env.BRANCH_NAME != "master") {
                        baseUrl = "http://abc.preview.jenkins-zh.cn/"
                    }
                    hugo destination: 'jenkins-zh.github.io', buildFuture: true, verbose: true, baseUrl: baseUrl
                }
            }
        }
        stage("Image"){
            when {
                not {
                    branch 'master'
                }
            }
            steps{
                container('tools'){
                    withCredentials([usernamePassword(credentialsId: 'jenkins-zh-docker', passwordVariable: 'PASSWD', usernameVariable: 'USER')]) {
                        sh '''
                        docker build . -t surenpi/jenkins-zh:v$BRANCH_NAME-$BUILD_ID
                        ##docker login --username $USER --password $PASSWD
                        ##docker push surenpi/jenkins-zh:v$BRANCH_NAME-$BUILD_ID
                        ##docker logout
                        '''
                    }
                }
            }
        }
        stage("Preview"){
            when {
                not {
                    branch 'master'
                }
            }
            steps{
                container('tools'){
                    sh '''
                    rm -rfv website.yaml
                    '''

                    script{
                        def website = readYaml file: "config/website.yaml"

                        for(item in website){
                            switch(item.kind) {
                                case "Deployment":
                                item.spec.template.spec.containers[0].image = "surenpi/jenkins-zh:v$BRANCH_NAME-$BUILD_ID"
                                break;
                                case "Ingress":
                                item.spec.rules[0].host = "${BRANCH_NAME}.preview.jenkins-zh.cn"
                                break;
                            }
                        }

                        println website
                        println website.toString()
                        writeYaml file: 'website.yaml', data: website
                    }

                    sh '''
                    cat website.yaml
                    kubectl apply -f website.yaml -n $BRANCH_NAME
                    '''

                    script{
                        pullRequest.createStatus(status: 'success',
                            context: 'continuous-integration/jenkins/pr-merge/preview',
                            description: 'website preview',
                            targetUrl: "http://${BRANCH_NAME}.preview.jenkins-zh.cn")
                    }
                }
            }
        }
        stage("Publish"){
            when {
                branch 'master'
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
                branch 'master'
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
