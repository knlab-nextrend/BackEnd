FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ENV CHOKIDAR_USEPOLLING=true
COPY config ./config
COPY public ./public
COPY scripts ./scripts


CMD ["npm", "run", "start"]