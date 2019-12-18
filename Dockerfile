FROM %%BASE_IMAGE%%

ENV LANG C.UTF-8

RUN apk add --no-cache nodejs-current yarn && \
yarn global add npm && \
yarn cache clean && \
apk del yarn && \
npm set unsafe-perm true && \
npm install install express request

# Expose tcp/8081
EXPOSE 8088

# Copy data for add-on
# Bundle app source
COPY . /
COPY run.sh /
RUN chmod a+x /run.sh 

CMD [ "/run.sh" ]
