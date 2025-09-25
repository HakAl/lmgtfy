#!/bin/bash

ENV=${1:-dev}

echo "Starting Docker Compose in $ENV mode..."

if [ "$ENV" = "prod" ]; then
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
else
  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
fi