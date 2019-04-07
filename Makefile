fetch-theme:
	if [ ! -d "themes" ]; then \
		mkdir themes; \
	fi
	if [ -d "themes/hugo-jenkins-theme" ]; then \
	    cd themes/hugo-jenkins-theme && git fetch && git reset --hard origin/master && git pull; \
	else \
		cd themes && git clone https://github.com/jenkins-zh/hugo-jenkins-theme; \
	fi

fetch-wechat-articles:
	if [ -d "content/wechat" ]; then \
	    rm -rf content/wechat; \
	fi
	cd content && git clone https://github.com/jenkins-infra/wechat
	make change-format

change-format:
	cd content/wechat/articles && rm sample.md && find . -name *.md -exec mv {} . \;
	rm -rf content/wechat/articles/2018
	rm -rf content/wechat/images/*.md
	rm -rf content/wechat/management/
	rm -rf content/wechat/*.md
	cp -r content/wechat/images/ content/wechat/articles/images/

update:
	if [ -d "jenkins-zh.github.io" ]; then \
	    cd jenkins-zh.github.io && git pull; \
	else \
		git clone https://github.com/jenkins-zh/jenkins-zh.github.io; \
	fi
	make fetch-theme
	make fetch-wechat-articles

live:
	make update
	hugo server

deploy:
	make update
	hugo -F
	cp -r public/* jenkins-zh.github.io
	cd jenkins-zh.github.io && rm -rf images/ && rm -rf wechat/images/ && git add . && git commit -m 'deploy' && git push

