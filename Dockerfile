FROM node:12.22.1 AS build
ARG MODE=production
WORKDIR /app

COPY package*.json .
RUN yarn install

COPY . .

RUN npx vue-cli-service build --mode $MODE

FROM nginx:stable-alpine as runtime
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
