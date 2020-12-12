git pull origin master
cd backend
npm install
sudo pm2 start index.js -i max --watch
cd ..
cd frontend
npm install
npm run build
cd ..
sudo systemctl restart nginx