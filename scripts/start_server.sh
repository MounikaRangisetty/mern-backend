#!/bin/bash
cd /home/ec2-user/mern-backend
pm2 start server.js --name "mern-backend"
