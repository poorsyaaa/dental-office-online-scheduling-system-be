# ----- Builder Stage -----
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3000
EXPOSE $PORT

CMD ["npm", "run", "start"]