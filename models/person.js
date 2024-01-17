const mongoose = require('mongoose');
const url = process.env.MONGODB_URI;

console.log('connecting to MongoDB');
mongoose.set('strictQuery', false);

mongoose.connect(url).then(result => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB: ', error.message)
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // returned ._id is an object, convert to string for handling
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Person', personSchema);

