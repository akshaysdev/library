FROM node:18.0.0

WORKDIR /home/apps/library

COPY package*.json ./

RUN npm install --no-optional

COPY . .

EXPOSE 8000 8000