#### 备份脚本
```
#!/bin/bash
#bak_jenkins.sh

#变量(根据实际情况路径修改)
DATE=$(date +%Y%m%d%H%M)
BAK_PATH=/data/jenkins/backup/job
BAK_DIR=jenkins_$DATE
JENKINS_PATH=/data/jenkins/jenkinsdata

#判断初始备份目录
if [ ! -d ${BAK_PATH}/${BAK_DIR} ];
then
   mkdir -p ${BAK_PATH}/${BAK_DIR}/jobs
fi

cd ${BAK_PATH}/${BAK_DIR}

for i in `ls $JENKINS_PATH/jobs`
  do
    echo job:$i
    mkdir jobs/$i
    #只备份每个job的config.xml,即配置信息
    cp $JENKINS_PATH/jobs/$i/config.xml jobs/$i/config.xml
done

#备份用户
cp -r $JENKINS_PATH/users .
#备份插件
cp -r $JENKINS_PATH/plugins .
#备份全局配置
cp $JENKINS_PATH/config.xml .
#备份自定义脚本文件
cp /data/jenkins/script/*.sh .

#压缩备份,加密为可选项
cd ${BAK_PATH}
zip -e -P mypassword -r ${BAK_DIR}.zip ${BAK_DIR}

#删除老的备份
rm -rf ${BAK_DIR}
find "${BAK_PATH}" -name "*.zip" -mtime +7 -type f -exec rm -f {} \;

#恢复时,先停止jenkins服务,把对应文件还原回去即可
```
