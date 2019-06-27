# XSS Bot

- Alpine
- chromium
- puppeteer-core

## Usage

**app.js**

```javascript
// ===== Custom Action =====

Code for you!

// =========================
```

Add Service in your docker-compose.yml

```yaml
  xssbot:
    # build: .
    image: ctftraining/base_image_xssbot
    # shm_size: '1gb'
    volumes:
      - ./app.js:/home/bot/app.js
    environment:
      - FLAG=ctftraining{xss_bot_666}
    restart: always
```

## Custom Build

`docker build -t xxx/xssbot .`

**Dockerfile**

```dockerfile
FROM ctftraining/base_image_xssbot
ENV FLAG="ctftraining{xss_bot_666}"
COPY --chown=bot:bot ./app.js /home/bot/app.js
```

