FROM node:16-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache openjdk8-jre

RUN npm i -g firebase-tools && firebase setup:emulators:firestore
