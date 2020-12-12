#!/bin/sh     
git pull origin master
cd backend
npm install
cd ..
cd frontend
npm install
npm run build
cd ..
sudo systemctl restart nginx
sudo pm2 restart all