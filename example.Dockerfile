FROM ctftraining/base_image_xssbot

ENV FLAG="ctftraining{xss_bot_666}"

COPY --chown=bot:bot ./app.js /home/bot/app.js