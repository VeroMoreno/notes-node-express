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
require('./mongo.js')
const User = require('./models/User')
const Note = require('./models/Note')
const express = require('express')
const cors = require('cors')
const app = express()

// Importamos middleware
// const jwt = require('jsonwebtoken')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

const userExtractor = require('./middleware/userExtractor')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// Con esto cualquier origen funciona en nuestra api
app.use(cors())
// Soporta la request que se hacen cuando se pasa un objeto y lo va a parsear.
app.use(express.json())

// Middleware: intercepta la peticion que pasa por tu api
// para publicar archivos estáticos etc.
/* app.use((request, response, next) => {

}) */

let notes = []

/* Le pasamos un callback a node.js
Se va a ejecutar cada vez que le llegue una request */
/* const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json'})
  response.end(JSON.stringify(notes))
}) */

app.get('/', (request, response) => {
  response.send('Hello Veritechie')
})

app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({})
    response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  Note.findById(id)
  .then(note => {
      return note
        ? response.json(note)
        : response.status(404).end()
  })
  .catch(err => {
    next(err)
  })
})

// Tenemos estas 3 rutas protegidas, con userextractor si no tienes token de usuario no puedes usarlas.
app.put('/api/notes/:id', userExtractor, (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }
  // El tercer parámetro es para que moongose me devuelva en la petición
  Note.findByIdAndUpdate(id, newNoteInfo, {new:true})
  .then(result => {
    response.json(result)
  }).catch(err => {
    // que vaya al siguiente middleware
    next(err)
  })
})

app.delete('/api/notes/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params
  // const note = await Note.findById(id)
  // if (!note) return response.sendStatus(404)
  const res = await Note.findByIdAndDelete(id)
  if (res === null) return response.sendStatus(404)
  response.status(204).end()
})

app.post('/api/notes', userExtractor, async (request, response, next) => {
  const {
    content,
    important = false
  } = request.body

  // AQUI ESTABA LO DEL DECODED TOKEN, AHORA EN MIDDLEWARE userExtractor.
  // recuperamos el userId
  const { userId } = request

  const user = await User.findById(userId)
  if (!content) {
    return response.status(400).json({
      error: 'Required "content" field is missing'
    })
  }
  // nuevo objeto sin id y hacemos el .save
  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })
  try {
    const savedNote = await newNote.save()
    // aqui concatena la nota nueva a las anteriores
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

// El orden de los middleware y los path es importante.
// Middleware
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

