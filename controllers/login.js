const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/User')

/* JWT
Es un estándar de la industria que lo que hace es que dos partes se puedan comunicar
de forma segura e intercambiar información, lo más interesante es que no solo hace eso,
es que no necesitas una bbdd, es totalmente agnóstico a donde lo puedas guardar esa
sesión, una vez que tienes guardada esa info, sin necesidad de persistirla en
algun sitio, puedes indicar dentro de ese token el usuario que es, info que te
pueda interesar, tenerla codificada y falsificarla porque está firmada digitalmente

3 partes del token JWT
roja: header info sobre algortimo y tipo de token
lila: info que queremos guardar en el token,
azul: verifica que la firma es correcta. (falsificar es dificil)

Esquema de autenticación tipo Bearer.
*/

loginRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, password } = body
  const user = await User.findOne({ username })

  const passwordCorrect = user == null
  ? false
  : await bcrypt.compare(password, user.passwordHash)
  if (!(user && passwordCorrect)) {
    response.status(401).json({
      error: 'invalid user or password'
    })
  }

  // info del token
  const userForToken = {
    id: user._id, // importante tenerlo
    username: user.username
  }

  // firmamos y usamos la palabra secreta
  // lo ideal es tenerla en una variable de entorno.
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 * 24 * 7 } // nuestro usuario se logueara cada 7 dias
    )

  response.send({
    name: user.name,
    username: user.username,
    token
  })
})

module.exports = loginRouter