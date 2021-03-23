const { app } = require('../index')
const supertest = require('supertest')
// const User = require('../models/User')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Veritechie its amazing!',
    important: true,
    date: new Date()
  },
  {
    content: 'Sígueme en https://instagram.com/veritechie',
    important: true,
    date: new Date()
  },
  {
    content: '¡Super fan del Midu!',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes,
  getUsers
}