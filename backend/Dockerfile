# base image
FROM node:12.16.3

# Puppeteer setup requirements
RUN apt-get update

RUN apt-get install -yyq ca-certificates

RUN apt-get install -yyq libappindicator1 libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6

RUN apt-get install -yyq gconf-service lsb-release wget xdg-utils

RUN apt-get install -yyq fonts-liberation

# install pm2 process manager
RUN npm install pm2 -g

# set working directory
WORKDIR /user/src/app

# install and cache app dependencies
COPY package*.json ./

RUN npm install

# copy the application code
COPY . .

EXPOSE 8080

# start app
CMD ["pm2-runtime","ecosystem.config.js"]