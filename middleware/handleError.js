const ERROR_HANDLERS = {
  CastError: res =>
    res.status(400).send({ error: 'id used is malformed'}),

  ValidationError: (res, { message }) =>
    res.status(409).send({ error: message }),

  JsonWebTokenError: (res) =>
    res.status(401).json({ error: 'token missing or invalid' }),

  // TokenExpirerError: Error para saber cuando ha expirado el token, en el controlador podemos ver si es inválido o ha expirado
  // se necesita HTTPS si o si!
  // Puedes probar http en localhost
  TokenExpirerError: res =>
    res.status(401).json({ error: 'token expired' }),

  defaultError: res => res.status(500).edn()
}

module.exports = (error, request, response, next) => {
  console.log(error.name)
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  handler(response, error)
}