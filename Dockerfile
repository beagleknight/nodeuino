FROM node:latest
MAINTAINER david.morcillo@gmail.com

ENV APP_HOME /code
EXPOSE 3000

WORKDIR $APP_HOME

ADD . $APP_HOME

CMD ["node", "src/index.js"]