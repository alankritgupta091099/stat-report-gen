git pull origin master
# cd backend
# sudo npm install
# sudo pm2 start index.js -i max --watch
# cd ..
cd frontend
sudo npm install
sudo npm run build
cd ..
sudo systemctl restart nginx