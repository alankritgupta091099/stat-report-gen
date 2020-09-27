# base image
FROM node:12.16.3

# set working directory
WORKDIR /user/src/app

# install and cache app dependencies
COPY package*.json ./

RUN npm install

# copy the application code
COPY . .

EXPOSE 8080

# start app
CMD ["npm","start"]