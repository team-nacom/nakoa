#! /bin/sh

pm2 stop all
pm2 delete all

cd ~/nakoa/server
pm2 start --node-args="-r dotenv/config" build/index.js --name server

cd ~/nakoa/client
pm2 serve --spa build 3000 --name client

echo "Launched successfully!"
