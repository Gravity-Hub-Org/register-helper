FROM golang:1.14-alpine

WORKDIR /app

COPY . /app

RUN go build -o main

RUN apk add --update nodejs npm

RUN cd frontend && \
    npm install && \
    npm build && \
    npm run serve &> /dev/null &


ENTRYPOINT ["./main"]