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
const Note = require('./models/Note')
const express = require('express')
const cors = require('cors')
const app = express()

// Importamos middleware
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

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

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
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
    // que vaya al siguiente middleware
    next(err)
  })
})

app.put('/api/notes/:id', (request, response, next) => {
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

app.delete('/api/notes/:id', (request, response) => {
  const { id } = request.params
  Note.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  }).catch(err => {
    next(err)
  })
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  if (!note.content) {
    return response.status(400).json({
      error: 'Required "content" field is missing'
    })
  }
  // nuevo objeto sin id y hacemos el .save
  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })
  newNote.save().then(savedNote => {
    response.json(savedNote)
  })
})

// El orden de los middleware y los path es importante.
// Middleware
app.use(handleError)
app.use(notFound)

// Este servidor tiene que escuchar de algún puerto:
const PORT = process.env.PORT // || 3001
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})
