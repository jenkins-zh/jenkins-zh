pipeline {
    agent {
        label "hugo"
    }

    stages{
        stage("Clone site"){
            steps{
                gitClone('https://github.com/jenkins-zh/jenkins-zh.github.io', 'jenkins-zh.github.io')
            }
        }
        stage("Fetch theme"){
            steps{
                gitClone('https://github.com/jenkins-zh/hugo-jenkins-theme', 'themes')
            }
        }
        stage("Fetch wechat articles"){
            steps{
                gitClone('https://github.com/jenkins-infra/wechat', 'content')

                sh '''
                pwd
                ls -ahl
                ./scripts/change-format.sh
                '''
            }
        }
        stage("Build"){
            steps{
                hugo destination: 'jenkins-zh.github.io', verbose: true
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
    }
}

def gitClone(url, subDir){
    checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: subDir]], submoduleCfg: [], userRemoteConfigs: [[url: url]]])
}
