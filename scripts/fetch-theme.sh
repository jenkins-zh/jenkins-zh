#!/bin/sh

source ./$(dirname "${BASH_SOURCE[0]}")/env.sh

if [ ! -d "${root_dir}/themes" ]; then \
    mkdir ${root_dir}/themes; \
fi
if [ -d "${root_dir}/themes/hugo-jenkins-theme" ]; then \
    cd ${root_dir}/themes/hugo-jenkins-theme && git fetch && git reset --hard origin/master && git pull; \
else \
    cd ${root_dir}/themes && git clone https://github.com/jenkins-zh/hugo-jenkins-theme; \
fi
