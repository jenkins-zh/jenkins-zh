fetch-theme:
	cd themes && git clone https://github.com/jenkins-zh/hugo-jenkins-theme

fetch-wechat-articles:
	cd content/ && rm -rf wechat && git clone https://github.com/jenkins-infra/wechat
	make change-format

change-format:
	cd content/wechat/articles && rm sample.md && find . -name *.md -exec mv {} . \;
	rm -rf content/wechat/articles/2018

live:
	hugo server

deploy:
	if [ -d "jenkins-zh.github.io" ]; then \
	    git pull; \
	else \
		git clone git@github.com:jenkins-zh/jenkins-zh.github.io.git; \
	fi
	hugo
	cp -r public/* jenkins-zh.github.io
	cd jenkins-zh.github.io && git add . && git commit -m 'deploy' && git push