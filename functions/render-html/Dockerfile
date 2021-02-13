FROM node:12-alpine

ENV PORT 8080

WORKDIR /html-render

COPY . .

RUN npm install
RUN npm build
RUN npm prune --production

EXPOSE 8080

CMD [ "npm", "start" ]
