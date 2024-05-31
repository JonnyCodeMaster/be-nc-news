# 'Not Fake News' API

Link to hosted website - [Not Fake News](https://not-fake-news.onrender.com/api)

Built by Jonny Farmer - [Github](https://github.com/JonnyCodeMaster)

## Description

This news API is a web application that clones back-end functionality using Node.js and Express. It is designed to perform CRUD operations on articles, users, topics and comments in JSON format using a PostgreSQL database.

You can find the list of available endpoints and their descriptions on the /api endpoint, or inside the endpoints.json file.

You may wish to use a browser extension JSON viewer to make the endpoints more easily readable.

## Set Up / Installation Instructions

### Prerequisites

* Node.js (minimum version 21.x) [Node.js](https://nodejs.org/en/)  
* PostgreSQL (minimum version 14.x) [PostgreSQL](https://www.postgresql.org)


### Dependencies

Run the following commands in your terminal to install the dependencies:

* dotenv (minimum version 14.x) [dotenv](https://www.npmjs.com/package/dotenv) - $ npm install dotenv
* express (minimum version 4.x) [express](https://www.npmjs.com/package/express) - $ npm install express
* pg (minimum version 8.x) [node-postgres](https://www.npmjs.com/package/pg) - $ npm install pg
* pg-format (minimum version 1.x) [pg-format](https://www.npmjs.com/package/pg-format) - $ npm install pg-format


### Dev Dependenciea

Run the following commands in your terminal to install the dev dependencies:

* supertest 7.0.0 - $ npm install supertest -D
* jest 27.5.1 - $ npm install jest -D
* jest-sorted 1.0.15 - $ npm install jest-sorted -D
* jest-extended 2.0.0 - $ npm install --save-dev jest-extended
* husky 8.0.3 - $ npm install --save-dev husky


### Clone The Repository

Run the following commands in your terminal:

* $ git clone https://github.com/JonnyCodeMaster/nc-news.git  
* $ cd nc-news


## How To Run The Application

### Initialise Node And Install Dependencies

Run the following command in your terminal:

* $ npm install


### Create Environment Variables

If you wish to clone this project and run it locally, you will not have access to the necessary environment variables. You must create the following .env files in your root directory in order to successfully connect to the two databases locally:

* .env.development - enter the following content into this file: PGDATABASE=nc_news
* .env.test - enter the following content into this file: PGDATABASE=nc_news_test


### Set Up The Database

There is a db folder which contains test and development data, a setup.sql file and a seeds folder.

Run the following commands in your terminal to set up the database and seed the data:

* $ npm run setup-dbs
* $ npm run seed


### Testing The Application

Run the following command in your terminal:

$ npm test app


---


Thank you for your interest in my project.

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
