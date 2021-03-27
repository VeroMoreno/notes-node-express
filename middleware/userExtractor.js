const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  // guardar información que esté en la request, está muy bien porque asi no tienes que preocuparte de sacarla de otro sitio
  const authorization = request.get('authorization')
  let token = ''
  // startWith = que empiece por bearer
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  // Si no tenemos token o el token decodificado no tenemos la id, ¡NO TIENES ACCESO!
  if(!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const { id: userId } = decodedToken
  // mutamos la request
  request.userId = userId
  next()
}