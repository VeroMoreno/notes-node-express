const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
  // Las notas que hemos creado previamente no tienen usuario y no encajan con este esquema
  // para resolverlo tienes una ejecucion que normalices los nuevos datos
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Transformamos el objeto que esperamos, podemos cambiar como funciona el toJSON que tiene el schema. Ahora el objeto tiene ese .id
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// modelo - c rear clase para crear instancia de estas notas, Note tiene el schema noteSchema.
const Note = model('Note', noteSchema)

/* const note = new Note({
  content: 'Mongo Db its amazing',
  date: new Date(),
  important: true
})

note.save()
  .then( result => {
    console.log(result)
    // Cerramos la conexion de mongo
    mongoose.connection.close()
  })
  .catch(err => {
    console.log(err)
  }) */

module.exports = Note