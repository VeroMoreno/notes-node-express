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

const express = require('express')
const cors = require('cors')
const app = express()

// Con esto cualquier origen funciona en nuestra api
app.use(cors())
// Soporta la request que se hacen cuando se pasa un objeto y lo va a parsear.
app.use(express.json())

// Middleware: intercepta la peticion que pasa por tu api
// para publicar archivos estáticos etc.
/* app.use((request, response, next) => {

}) */

const notes = [
  {
    id: 1,
    content: "Veri is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
];

/* Le pasamos un callback a node.js
Se va a ejecutar cada vez que le llegue una request */
/* const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json'})
  response.end(JSON.stringify(notes))
}) */

app.get('/', (request, response) => {
  response.send('Hello Veri')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// Imsomnia es muy parecido a Postman

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  // generar id mirando las notas
  const ids = notes.map(note => note.id)
  // valor maximo de todas las IDS
  const maxId = Math.max(...ids)
  const newNote = {
    id : maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }
  // vamos a añadir esta nota, a la lista de notas.
  // ERROR TypeError: Assignment to constant variable
  notes = [...notes, newNote]
  // notes = notes.concat(netNote) // valen las dos
  response.json(newNote)
})


// Este servidor tiene que escuchar de algún puerto:
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})
