# # FROM node:14

# # WORKDIR /usr/src/app

# # COPY package*.json ./

# # RUN npm install

# # COPY . .

# # EXPOSE 80
# # CMD [ "node", "index.js" ]

# #-------

# #Use the official Node.js 14 image.
# # FROM node:14

# # # Set the working directory
# # WORKDIR /usr/src/app

# # # Create a package.json file with the express dependency
# # RUN echo '{ "name": "simple-nodejs-app", "version": "1.0.0", "main": "index.js", "dependencies": { "express": "^4.17.1" }, "scripts": { "start": "node index.js" } }' > package.json

# # # Install app dependencies
# # RUN npm install

# # # Create a simple index.js file
# # RUN echo 'const express = require("express"); const app = express(); const port = 80; app.get("/", (req, res) => { res.send("Hello World!"); }); app.listen(port, () => { console.log(`Node.js app listening at http://localhost:${port}`); });' > index.js

# #---------


# FROM node:18
# # Create app directory
# RUN mkdir /usr/src/app
# WORKDIR /usr/src/app
# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY ../package*.json ./
# RUN npm install

# # Bundle app source
# COPY . .
# EXPOSE 8080
# CMD [ "node", "index.js" ]

    #FROM nginx
    #COPY index.html /usr/share/nginx/html

# Use the official Node.js 14 image.
# Use the official Node.js 14 image.
# Use the official Node.js 14 image.
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Create a package.json file with the express dependency
RUN echo '{ "name": "simple-nodejs-app", "version": "1.0.0", "main": "index.js", "dependencies": { "express": "^4.17.1" }, "scripts": { "start": "node index.js" } }' > package.json

# Install app dependencies
RUN npm install

# Create a simple index.html file
RUN echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Hello World</title></head><body><h1>Hello World!</h1></body></html>' > index.html

# Create a simple index.js file
# Create a simple index.js file
RUN echo 'const express = require("express"); const app = express(); const port = 80; app.get("/", (req, res) => { res.send("Hello World!"); }); app.listen(port, () => { console.log(`Node.js app listening at http://localhost:${port}`); });' > index.js


# Expose the app port
EXPOSE 80

# Start the app
CMD [ "npm", "start" ]

