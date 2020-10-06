#!/bin/bash


start_frontend() {
  cd frontend && npm run serve &> /dev/null & 
}

start_service() {
  ./main
}

if [ -z $GRAVITY_HOME ]
then
  export GRAVITY_HOME=$HOME/gravity-ledger
fi

if [ ! -d $GRAVITY_HOME ]
then
  mkdir -p $GRAVITY_HOME 
fi

chmod -R 777 $GRAVITY_HOME

start_frontend
start_service
