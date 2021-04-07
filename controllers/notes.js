const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')


/* Le pasamos un callback a node.js
Se va a ejecutar cada vez que le llegue una request */
/* const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json'})
  response.end(JSON.stringify(notes))
}) */


notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
    response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
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
notesRouter.put('/:id', userExtractor, (request, response, next) => {
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

notesRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params
  // const note = await Note.findById(id)
  // if (!note) return response.sendStatus(404)
  const res = await Note.findByIdAndDelete(id)
  if (res === null) return response.sendStatus(404)
  response.status(204).end()
})

notesRouter.post('/', userExtractor, async (request, response, next) => {
  const {
    content,
    important = false
  } = request.body

  // AQUI ESTABA LO DEL DECODED TOKEN, AHORA EN MIDDLEWARE userExtractor.
  // recuperamos el userId
  const { userId } = request
  console.log(request)
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

module.exports = notesRouter