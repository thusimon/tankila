FROM node:16.19-alpine
WORKDIR /tankila

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

COPY client/build/ ./client/build/
COPY server/build/ ./server/build/
COPY .env ./

EXPOSE 3006
CMD [ "node", "server/build/server/src/index.js" ]
