FROM node:20.11.0

RUN apt-get update
RUN apt-get install -y openssl wget libkrb5-dev

LABEL maintainer="virgoone <w2008second@gmail.com>"
LABEL description="FluxAI"

ENV NODE_ENV=production
ENV APP_ENV=production

WORKDIR /app

# 复制整个项目目录
COPY . .

# 安装 pm2
RUN npm install -g pm2
RUN npm install -g pnpm
RUN npm install -g prisma
RUN pnpm install

RUN prisma generate

RUN pm2-runtime --version

RUN mkdir -p /app/config

VOLUME /app/config

EXPOSE 3000

# Start pm2.json process file
CMD ["pm2-runtime", "start", "ecosystem.json"]