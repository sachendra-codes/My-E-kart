const mongoose = require('mongoose')
const { Schema } = mongoose
const { createHmac } = require('crypto')
const { v4: uuidv4 } = require('uuid')
const userSchema = new Schema({
  name: {
    type: String,
    maxlen: 30,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    maxlen: 30,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  encry_password: {
    type: String,
    required: true,
  },
  salt: String,
  role: {
    type: Number,
    default: 0,
  },
  purchases: {
    type: Array,
    default: [],
  },
})
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = uuidv4()
    this.encry_password = this.securePassword(password)
  })
  .get(function () {
    return this._password
  })
userSchema.method = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password
  },
  securePassword: function (plainPassword) {
    if (!plainPassword) return ''
    try {
      return createHmac('sha256', this.salt).update(plainPassword).digest('hex')
    } catch (err) {
      return ''
    }
  },
}
module.exports = mongoose.model('User', userSchema)
