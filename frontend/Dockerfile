# BUILD IMAGE
FROM node:20-alpine AS build

WORKDIR /app

COPY ./package.json .
RUN npm install

COPY ./public/ ./public
COPY ./src/ ./src

RUN npm run build

# FINAL IMAGE
FROM nginx:alpine AS final

WORKDIR /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/*
RUN apk add --no-cache bash

COPY ./.env .
COPY ./env.sh .
RUN chmod +x env.sh

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build .

EXPOSE 80

CMD ["/bin/bash", "-c", "./env.sh prod && nginx -g \"daemon off;\""]