/* notes-api-backend
NODEMON, permite actualizar sin hacer f8 f9
npm i nodemon -D  Detecta cualquier cambio y actualiza.
npm run dev en scripts de package.json para arrancar.
npm install express para usar express.
npm install eslint -D
npm install standard -D

^2.0.7 - semantic versionin, cada numero tiene semanticamente un significado
^ - Se actualiza o no la version
~ o nada - No actualiza la version
2 - mayor / cambia todo sobre el paquete.
0 - minor / tiene una nueva feature
7 - patch / hotfix (arreglo de bug)
 */


// Módulo nativo de node.js
// const http = require('http')

// Hacemos funcionar el archivo .env
require('dotenv').config()
// - Importamos fichero que hace la conexion a mongo.js
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')

// const Note = require('./models/Note')

// Importamos middleware
// const jwt = require('jsonwebtoken')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')


const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
// const User = require('./models/User')
const loginRouter = require('./controllers/login')

// Con esto cualquier origen funciona en nuestra api
app.use(cors())
// Soporta la request que se hacen cuando se pasa un objeto y lo va a parsear.
app.use(express.json())

// Middleware: intercepta la peticion que pasa por tu api
// para publicar archivos estáticos etc.
/* app.use((request, response, next) => {}) */

// El orden de los Middleware y los path es importante.
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(handleError)
app.use(notFound)

// Este servidor tiene que escuchar de algún puerto:
const PORT = process.env.PORT // || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})

module.exports = {app, server}

