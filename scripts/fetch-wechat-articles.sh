#!/bin/sh

source ./$(dirname "${BASH_SOURCE[0]}")/env.sh

if [ -d "${root_dir}/content/wechat" ]; then \
    rm -rf ${root_dir}/content/wechat; \
fi
cd ${root_dir}/content && git clone https://github.com/jenkins-infra/wechat
