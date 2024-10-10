FROM node:20-slim

RUN apt-get update
RUN apt-get install -y openssl wget libkrb5-dev

LABEL maintainer="virgoone <w2008second@gmail.com>"
LABEL description="FluxAI"

ENV NODE_ENV=production
ENV APP_ENV=$APP_ENV

WORKDIR /app
COPY . /app

RUN npm install -g pm2

RUN pm2-runtime --version

RUN mkdir /config

VOLUME /config

EXPOSE 3000

# Start pm2.json process file
CMD ["pm2-runtime", "start", "ecosystem.json"]