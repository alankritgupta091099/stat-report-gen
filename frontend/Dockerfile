# base image
FROM node:12.16.3 as react_build 

# set working directory
WORKDIR /user/src/app

# install and cache app dependencies
COPY package*.json ./

# copy the application code
COPY . .

#install everything
RUN npm install
RUN npm install react-scripts@3.0.1 -g --silent 

RUN npm run build

#prepare nginx
FROM nginx:1.16.0-alpine

COPY --from=react_build /user/src/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

# start app
CMD ["nginx","-g","daemon off;"]