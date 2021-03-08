const mongoose = require('mongoose')
/* Variables de entorno, se le puede pasar un monton de cosas archivo .env */
const connectionString = process.env.MONGO_DB_URI

// conexion a mongo DB
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
})
.then(() => {
  console.log("Database connected")
}).catch(err => {
  console.log(err)
})