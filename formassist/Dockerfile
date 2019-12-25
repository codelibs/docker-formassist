FROM node:8.15-slim
LABEL maintainer "N2SM <support@n2sm.net>"


RUN mkdir -p /app/formassist/output
RUN mkdir -p /app/share/

ADD package.json /app/formassist/
ADD webpack.config.js /app/formassist/

WORKDIR /app/formassist
RUN npm install;

ADD src /app/formassist/src

CMD ["node_modules/.bin/webpack"]

