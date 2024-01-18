const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connecting to MongoDB')
mongoose.set('strictQuery', false)

mongoose.connect(url).then( () => {
  console.log('connected to MongoDB')
})
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  number: {
    type: String,
    minLength: 9,
    maxLength: 23,
    validate: {
      validator: function(phoneNumber) {
        const regex = /^(?:[0-9]{2}-[0-9]{5,}|[0-9]{3}-[0-9]{4,})$/
        return regex.test(phoneNumber)
      }
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // returned ._id is an object, convert to string for handling
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

