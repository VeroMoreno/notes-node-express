const moongose = require('mongoose')

const { server } = require('../index')
// Vamos a utilizar el modelo de la nota en cualquier sitio.
const Note = require('../models/Note')
const {
  api,
  initialNotes,
  getAllContentFromNotes
} = require('./helpers')

// Cada vez que vayas a hacer un test
// Antes de cada test ejecutame este método que es asincrono.
beforeEach(async () => {
  // borramos todas las notas
  await Note.deleteMany({})

  // sequential
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('GET all notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two notes', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('the first note is about veritechie', async () => {
    const {
      contents
    } = await getAllContentFromNotes()

    expect(contents).toContain('Veritechie its amazing!')
  })
})

describe('create a note', () => {
  test('is possible with a valid note', async () => {
    const newNote = {
      content: 'Proximamente async/await',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('is not possible with an invalid note', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

test('a note can be deleted', async () => {
  const { response: firstResponse } = await getAllContentFromNotes()
  const { body: notes } = firstResponse
  const noteToDelete = notes[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const { contents, response: secondResponse } = await getAllContentFromNotes()

  expect(secondResponse.body).toHaveLength(initialNotes.length - 1)

  expect(contents).not.toContain(noteToDelete.content)
})

test('a note that has an invalid id can not be deleted', async () => {
  await api
    .delete('/api/notes/1234')
    .expect(400)

  const { response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length)
})

test('a note that has a valid id but do not exist can not be deleted', async () => {
  const validObjectIdThatDoNotExist = '60451827152dc22ad768f442'
  await api
    .delete(`/api/notes/${validObjectIdThatDoNotExist}`)
    .expect(404)

  const { response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length)
})

// añadimos hook para cerrar server, el servidor
afterAll(() => {
  moongose.connection.close()
  server.close()
})