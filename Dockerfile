FROM node:13-alpine AS frontend

WORKDIR /app

COPY . /app

ARG ENDPOINT=http://localhost:8091

ENV ENDPOINT=$ENDPOINT

RUN apk update && apk upgrade && apk add --no-cache bash git openssh \
    && rm -rf /var/cache/apk/* \
    && cd /app/frontend \
    && npm install \
    && npm run build

FROM golang:1.14-buster

WORKDIR /generator

COPY --from=frontend /app/ /generator

RUN git clone https://github.com/Gravity-Tech/gravity-core
RUN cd ./gravity-core/cmd/gravity && go build -o gravity && cp gravity /usr/local/bin
RUN rm -rf gravity-core

RUN go build -o main

VOLUME /etc/gravity

ENTRYPOINT ["./entrypoint.sh"]
