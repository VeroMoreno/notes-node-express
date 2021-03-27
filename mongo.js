const mongoose = require('mongoose')

/* Variables de entorno, se le puede pasar un monton de cosas archivo .env */
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
// Lo cambiaremos con continuous integration
const connectionString = NODE_ENV == 'test'
? MONGO_DB_URI_TEST
: MONGO_DB_URI

/*
SUPERTEST GITHUB para endpoints /visionmedia/supertest
Vamos a testear los endpoints
Para ello tenemos que acceder a ellos de forma facil
Biblioteca que nos permite probar servidores HTTP de manera sencilla
*/

// conexion a mongo DB
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
})
.then(() => {
  console.log("Database connected")
}).catch(err => {
  console.log(err)
})

process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})