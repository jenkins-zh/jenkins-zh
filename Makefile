fetch-theme:
	if [ -d "themes/hugo-jenkins-theme" ]; then \
	    cd themes/hugo-jenkins-theme && git fetch && git reset --hard origin/master && git pull; \
	else \
		cd themes && git clone https://github.com/jenkins-zh/hugo-jenkins-theme; \
	fi

fetch-wechat-articles:
	if [ -d "content/wechat" ]; then \
	    cd content/wechat && git fetch && git reset --hard origin/master && git pull; \
	else \
		cd content && git clone https://github.com/jenkins-infra/wechat; \
	fi
	make change-format

change-format:
	cd content/wechat/articles && rm sample.md && find . -name *.md -exec mv {} . \;
	rm -rf content/wechat/articles/2018
	rm -rf content/wechat/images/*.md
	rm -rf content/wechat/management/
	rm -rf content/wechat/*.md

live:
	hugo server

deploy:
	if [ -d "jenkins-zh.github.io" ]; then \
	    cd jenkins-zh.github.io && git pull; \
	else \
		git clone git@github.com:jenkins-zh/jenkins-zh.github.io.git; \
	fi
	make fetch-theme
	hugo
	cp -r public/* jenkins-zh.github.io
	cd jenkins-zh.github.io && git add . && git commit -m 'deploy' && git push