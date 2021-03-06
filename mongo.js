const mongoose = require('mongoose')
const { Schema, model } = mongoose
const connectionString = `mongodb+srv://veronica:veronica@sandbox.tvib4.mongodb.net/app?retryWrites=true&w=majority`

// conexion a mongo DB
mongoose.connect(connectionString)
.then(() => {
  console.log("Database connected")
}).catch(err => {
  console.log(err)
})

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean
})

// modelo - crear clase para crear instancia de estas notas, Note tiene el schema noteSchema.
const Note = model('Note', noteSchema)

const note = new Note({
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
  })