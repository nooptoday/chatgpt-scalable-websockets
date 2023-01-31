FROM node:14-alpine
WORKDIR /app
COPY ./package.json ./tsconfig.json ./
RUN npm install
CMD ["/app/node_modules/.bin/ts-node", "/app/src/index.ts"]