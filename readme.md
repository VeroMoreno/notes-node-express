# 🚀 Basic Notes API BACKEND (Node + Express + MongoDB)

// Init a project with Node.js
```shell
 npm init - y
```

### Scripts
```shell
 npm run start
 npm run dev
```

### Dev Dependencies
* Nodemon (Automatic update)
* Standard (Eslint)
* Jest (Testing)
  --verbose
  --silent: what you get from console.log will not be returned by the console
  --detectOpenHandles - There is something that we are not closing
  Package JSON:  "test:watch": "npm run test -- --watch" guion guion empty is refer to test: --verbose--silent
* Supertest (Endpoint testing with jest)

### Dependencies
* Cors (Any origin works in our API)
* Express
* Mongoose (schemas)
* dotenv (get the .env file working with environment variables)
* bcrypt (Hash our password) node.bcrypt.js
* mongoose-unique-validator (Validate unique values)
* JWT (Jason Web Tokens)

### FYI secondary Info
https://sentry.io/ : Sentry's application monitoring platform helps every developer
diagnose, fix, and optimize the performance of their code.

### Backend Testing
* Jest

### How to (remember that!)
create_user.rest - Create an user
login_user.rest  - Get JWT
create_note.rest - Create a note with Authorization: Bearer