const mongoose = require('mongoose')



const password = process.argv[2]
const personName= process.argv[3]
const personNumber  = process.argv[4]

const url = `mongodb+srv://mlyell21:${password}@cluster0.ygufjfz.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

function savePerson (personName, personNumber) {
  const person = new Person({
    name: personName,
    number: personNumber,
  })

  person.save().then( () => {
    console.log('Person added!')
    mongoose.connection.close()
  })
}

function displayAllPeople () {
  Person.find({}).then(result => {
    result.forEach( person => {
      console.log(person.name)
      console.log(person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
} else if (process.argv.length > 3) {
  savePerson(personName, personNumber)
} else {
  displayAllPeople()
}


