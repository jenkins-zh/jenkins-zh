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
                hugo destination: 'jenkins-zh.github.io', buildFuture: true, verbose: true
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
