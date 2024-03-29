FROM node:alpine

# Install python to compile packages
RUN apk add --no-cache python make g++

RUN mkdir -p /opt/app/
WORKDIR /opt/app/

COPY . .

RUN npm install
RUN npm run build

EXPOSE ${SERVICEPORT}

