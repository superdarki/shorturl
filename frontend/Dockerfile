# BUILD IMAGE
FROM node:20-alpine AS build

WORKDIR /app

COPY ./package.json .
RUN npm install

COPY ./public/ ./public
COPY ./src/ ./src

RUN npm run build

# FINAL IMAGE
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
RUN apk add --no-cache bash

WORKDIR /usr/share/nginx/html

COPY --from=build /app/build .
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY ./.env .
COPY ./env.sh .
RUN chmod +x env.sh

EXPOSE 80

CMD ["/bin/bash", "-c", "./env.sh prod && nginx -g \"daemon off;\""]