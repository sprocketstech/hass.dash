ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

RUN apk add --no-cache nodejs-current yarn git && \
yarn global add npm && \
yarn global add bower && \
yarn cache clean && \
apk del yarn

# Expose tcp/8081
EXPOSE 8099

# Copy data for add-on
# Bundle app source
COPY . /
COPY run.sh /
RUN chmod a+x /run.sh 

CMD [ "/run.sh" ]
