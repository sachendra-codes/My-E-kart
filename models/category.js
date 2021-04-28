const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlen: 30,
      trim: true,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Category', categorySchema)
