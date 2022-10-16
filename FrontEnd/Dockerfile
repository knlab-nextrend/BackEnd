FROM node:14


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install


COPY config ./config
COPY public ./public
COPY scripts ./scripts
COPY src ./src


CMD ["node", "scripts/start.js"]