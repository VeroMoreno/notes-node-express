 // Encriptar nuestra super password
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

/*
Imaginate que quiero recuperar todas las notas
Tengo el usuario, pero para que me sirve el usuario?
Imaginate que quiero poner un tweet de quien es la nota.
entonces me obliga a hacer otra peticion a la base de datos

En mongoose existe .POPULATE
Queremos que nos rellene la informacion de las notas
de esta forma esto tira del modelo User.js
Primer parámetro: nombre de la propiedad
acepta un segundo parámetro para indicarle que quieres que te devuelva y que no
*/
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1,
    _id: 0
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, name, password } = body

  // Coste que va a tener de comptuacion el hashear este password, 10 por defecto
  const saltRounds = 10
  // Es asíncrono
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter