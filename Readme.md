# Task Management App

* Demo deployed on Heroku and can be found [here.](https://tms-v2.herokuapp.com/)
    

## Dependencys

* **Node - v.12.x**

Linux install:
`sudo apt install nodejs`

MacOS with brew:
`brew install node`

* **NPM - v.6.x**

Linux install: 
`sudo apt install npm`


* **MongoDB - v4.x**


## Available scripts

`npm run up` 

Install all packages and runs both the client app and the server app in development mode.
Open http://localhost:3000 to view the client in the browser.


`npm start`

Run server locally. 


`npm run server`

Run server demon, that automatically restarting the node application when file changes in the directory are detected


`npm run client`

Run client for local development.
Open http://localhost:3000 to view the client in the browser.


`npm run client:install`

Install all client packages.


`npm run client:build`

Build client production bundle.


`npm run install:nodes`

Install all client and server packages.


`npm run dev`

Runs both the client app and the server app in development mode.
Open http://localhost:3000 to view the client in the browser.


## TODO

* Unit and integration tests
* Responsive styles (now may be issues on small screens)
* Extract business logic from routes to controllers

