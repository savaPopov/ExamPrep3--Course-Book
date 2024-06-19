const { Schema, model, Types } = require('mongoose')

const dataSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  certificate: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  signUpList: {
    type: [Types.ObjectId],
    ref: 'User',
    default: []
  },
  author: {
    type: Types.ObjectId,
    ref: 'User'
  }
})

const Data = model('Data', dataSchema)

module.exports = {
  Data
}