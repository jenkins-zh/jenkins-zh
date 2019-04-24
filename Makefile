fetch-theme:
	./scripts/fetch-theme.sh

fetch-wechat-articles:
	./scripts/fetch-wechat-articles.sh
	make change-format

change-format:
	./scripts/change-format.sh

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
	cd jenkins-zh.github.io && git add . && git commit -m 'deploy' && git push

