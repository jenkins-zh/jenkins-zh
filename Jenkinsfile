pipeline {
    agent {
        label "hugo"
    }

    stages{
        stage("Clone site"){
            steps{

            }
        }
        stage("Fetch theme"){
            steps{
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'themes']], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/jenkins-zh/hugo-jenkins-theme']]])
            }
        }
        stage("Fetch wechat articles"){
            steps{
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'content']], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/jenkins-infra/wechat']]])
            }
        }
        stage("Build"){
            steps{

            }
        }
        stage("Publish"){
            steps{

            }
        }
    }
}