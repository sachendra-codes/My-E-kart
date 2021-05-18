require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
app = express()
const PORT = process.env.PORT || 8000

// My Routes
const authRoutes = require('./routes/auth.js')
const userRoutes = require('./routes/user.js')
const categoryRoutes = require('./routes/category.js')
const productRoutes = require('./routes/product.js')
const orderRoutes = require('./routes/order.js')

app.use(bodyparser.json())
app.use(cookieParser())
app.use(cors())

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)

getConnection = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to DB')
  } catch (err) {
    console.log('failed to connect')
    console.log(err)
  }
}
getConnection()

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`)
})
