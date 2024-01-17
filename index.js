require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')


morgan.token('body', function getBody (request) { return JSON.stringify(request.body) })

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'});
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'});
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
};


//middleware
app.use(express.json());
app.use(express.static('dist'))
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.get('/api/persons', (request,response) => {
  Person.find({}).then( person => {
    response.json(person)
  })
});

app.post('/api/persons', (request,response, next) => {
  const body = request.body;

  if (!body.name || !body.number ) {
    return response.status(404).json({"error": "Content Missing"});
  };

  const person = new Person({
    name: body.name,
    number: body.number
  });


  person.save({runValidators: true})
    .then(savedPerson => { response.json(savedPerson)})
    .catch( error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;
  console.log(name, number)

  Person.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date();
      const body = `<p>There is information for ${count} contacts.</p>
                    <p>${date.toString()}</p>`;
    response.send(body);
    })
});

app.get('/api/persons/:id', (request,response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      console.log(person)
      if (person) {
        response.json(person);
      } else {
        response.statusMessage ="That resource does not exist";
        response.status(404).end();
      }
    })
     .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => response.status(204).end)
  .catch(error => next(error))
});

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


