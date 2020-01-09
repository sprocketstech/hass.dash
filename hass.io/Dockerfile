ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

RUN apk add --no-cache nodejs-current yarn git nginx && \
yarn global add npm && \
yarn global add bower && \
yarn cache clean && \
apk del yarn && \
rm -rf /etc/nginx/conf.d/default.conf

# Expose tcp/8081
EXPOSE 8099

# Copy root filesystem
COPY rootfs /

# copy the app
COPY app /opt/hass.dash

COPY run.sh /

RUN chmod a+x /run.sh 

CMD [ "/run.sh" ]
