#!/bin/bash


start_frontend() {
  cd frontend && npm run serve &> /dev/null & 
}

start_service() {
  ./main
}

start_frontend
start_service
