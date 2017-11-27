# SmartList

## Description

SmartList is an app designed to automatially categorize your To-Do list.  

Items can be marked as one of four categories :

1. Read
2. Eat
3. Buy
4. Watch

!["Login Page"](https://github.com/MattEmond/Smart-TODO-List/blob/master/docs/login.png?raw=true)
!["Main Page"](https://github.com/MattEmond/Smart-TODO-List/blob/master/docs/main-page.png?raw=true)
!["Input Bar"](https://github.com/MattEmond/Smart-TODO-List/blob/master/docs/input-bar.png?raw=true)
!["Description Container"](https://github.com/MattEmond/Smart-TODO-List/blob/master/docs/description-container.png?raw=true)

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- amazon-product-api: ^0.4.4,
- bcrypt: ^1.0.3,
- body-parser: ^1.15.2,
- connect-flash: ^0.1.1,
- cookie-session: ^2.0.0-beta.3,
- dotenv: ^2.0.0,
- ejs: ^2.4.1,
- express: ^4.13.4,
- knex: ^0.11.7,
- knex-logger: ^0.1.0,
- morgan: ^1.7.0,
- node-sass-middleware: ^0.9.8,
- pg: ^6.0.2,
- request: ^2.83.0,
- xml2js: ^0.4.19,
- yelp-fusion: ^1.0.4
- nodemon: ^1.9.2,
- sqlite3: ^3.1.4

