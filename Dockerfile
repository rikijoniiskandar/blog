FROM node:16.14
FROM node:lts-alpine
WORKDIR /usr/src/app
# we are using a wildcard to ensure that both package.json and package-lock.json file into our work directory
COPY package*.json ./

RUN npm install

RUN npm ci --only=production

COPY . .

EXPOSE 3000

RUN npm build

CMD [ "node", "dist/index.js" ]