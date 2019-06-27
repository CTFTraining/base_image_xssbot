FROM node:alpine

ENV LANG="C.UTF-8" PUPPETEER_SKIP_CHROMIUM_DOWNLOA=true

# sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/' /etc/apk/repositories && \

RUN apk update && \
    apk add --no-cache zlib-dev udev nss ca-certificates chromium && \
    yarn add puppeteer-core && \
    adduser -h /home/bot -D -u 10086 bot && \
    yarn cache clean && \
    rm -rf /tmp/* /etc/apk/* /var/cache/apk/* /usr/share/man

COPY --chown=bot:bot ./app.js /home/bot/app.js

USER bot
WORKDIR /home/bot

CMD ["node", "/home/bot/app.js"]