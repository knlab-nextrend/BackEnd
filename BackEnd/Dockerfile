
FROM node:14


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY configs/ ./configs
COPY controller/ ./controller
COPY lib/ ./lib
COPY middlewares/ ./middlewares
COPY models/ ./models
COPY modules/ ./modules
COPY routes/ ./routes
COPY service/ ./service
COPY server.js ./
RUN git clone https://github.com/vishnubob/wait-for-it
CMD ["node", "server.js"]