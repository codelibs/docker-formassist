#!/bin/bash

echo "Creating directories..."
mkdir -p ./data/fess/opt/fess
mkdir -p ./data/fess/var/lib/fess
mkdir -p ./data/fess/var/log/fess
mkdir -p ./data/elasticsearch/usr/share/elasticsearch/data
mkdir -p ./data/elasticsearch/usr/share/elasticsearch/config/dictionary
mkdir -p ./data/formassist

if [ $(uname -s) = "Linux" ] ; then
  echo "Changing an owner for directories..."
  sudo chown -R 1001 ./data/fess/opt/fess
  sudo chown -R 1001 ./data/fess/var/lib/fess
  sudo chown -R 1001 ./data/fess/var/log/fess
  sudo chown -R 1000 ./data/elasticsearch/usr/share/elasticsearch/data
  sudo chown -R 1000 ./data/elasticsearch/usr/share/elasticsearch/config/dictionary
  sudo chown -R 1000 ./data/formassist
fi
