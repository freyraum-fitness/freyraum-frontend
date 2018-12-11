FROM node:9-alpine
MAINTAINER Stefan Hauschildt <stefan.h@uschildt.de>

RUN npm install webpack -g

WORKDIR /tmp
COPY package.json /tmp/
RUN npm config set registry http://registry.npmjs.org/ && npm install

WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN cp -a /tmp/node_modules /usr/src/app/

RUN webpack

CMD [ "/usr/local/bin/node", "./server.js" ]

EXPOSE 4000