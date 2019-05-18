FROM alpine:3.7
RUN apk add --no-cache ca-certificates
RUN apk add --no-cache --virtual .build-deps openssh-client git tar curl; \
    curl --silent --show-error --fail --location --header "Accept: application/tar+gzip, application/x-gzip, application/octet-stream" -o - \
      "https://caddyserver.com/download/linux/amd64?license=personal&telemetry=off" \
    | tar --no-same-owner -C /usr/bin/ -xz caddy && \
    chmod 0755 /usr/bin/caddy && \
    addgroup -S caddy && \
    adduser -D -S -H -s /sbin/nologin -G caddy caddy && \
    /usr/bin/caddy -version && \
    apk del .build-deps;
ENV PORT=80 \
    SITE_ROOT=/public
ENTRYPOINT ["/usr/bin/caddy"]
CMD ["-conf", "/Caddyfile", "-root", "${SITE_ROOT}"]
COPY config/Caddyfile /
COPY jenkins-zh.github.io /public
