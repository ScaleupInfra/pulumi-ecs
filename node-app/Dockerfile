FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Create a package.json file with the express dependency
RUN echo '{ "name": "simple-nodejs-app", "version": "1.0.0", "main": "index.js", "dependencies": { "express": "^4.17.1" }, "scripts": { "start": "node index.js" } }' > package.json

# Install app dependencies
RUN npm install

# Create a simple index.html file
RUN echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Hello World from Infrasity</title></head><body><h1>Hello World!</h1></body></html>' > index.html

# Create a simple index.js file
# Create a simple index.js file
RUN echo 'const express = require("express"); const app = express(); const port = 80; app.get("/", (req, res) => { res.send("Hello World from Infrasity!"); }); app.listen(port, () => { console.log(`Node.js app listening at http://localhost:${port}`); });' > index.js


# Expose the app port
EXPOSE 80

# Start the app
CMD [ "npm", "start" ]

