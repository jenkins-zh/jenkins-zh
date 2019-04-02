#!/bin/sh

source ./$(dirname "${BASH_SOURCE[0]}")/env.sh

cd ${root_dir}/content/wechat/articles && rm sample.md && find . -name *.md -exec mv {} . \;
rm -rf ${root_dir}/content/wechat/articles/2018
rm -rf ${root_dir}/content/wechat/images/*.md
rm -rf ${root_dir}/content/wechat/management/
rm -rf ${root_dir}/content/wechat/*.md
cp -r ${root_dir}/content/wechat/images/ static/images/
