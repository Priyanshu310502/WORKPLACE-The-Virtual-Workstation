const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, min: 6, max: 255  },
    username: { type: String, required: true, min: 6, max: 255 },
    password: { type: String, required: true, min: 6, max: 255 },
    // faceDescriptor: { type: Array, default: [] }
  },
  { collection: 'user-data', timestamps: true }
)

const model = mongoose.model('userModel', userSchema)

module.exports = { userSchema, model }
