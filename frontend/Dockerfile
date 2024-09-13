# BUILD IMAGE
FROM node:20-alpine AS build

ARG REACT_APP_API_URL

WORKDIR /app

COPY ./package.json .
RUN npm install

COPY ./public/ ./public
COPY ./src/ ./src

ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# FINAL IMAGE
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]