const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors')


morgan.token('body', function getBody (request) { return JSON.stringify(request.body) })

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'});
};

//middleware
app.use(express.json());
app.use(express.static('dist'))
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

const generateId = () => {
  const maxId = persons.length > 0 ? 
    Math.max(...persons.map(person => person.id)) : 0;
  return maxId + 1;
}

const generatePhoneNumber = () => {
  let phoneNumber = '';
  for ( let i=0; i < 10; i++) {
    phoneNumber += (Math.floor(Math.random() * 10));
  }

  return phoneNumber;
};

const validNewEntry = (input) => {
  if (persons.some(person => {
      return person.name === input.name || person.number === input.number
    }
  )) return false;

  return true;
}


app.get('/api/persons', (request,response) => {
  response.json(persons);
});

app.post('/api/persons', (request,response) => {
  
  const id = generateId();
  const body = request.body;
  const phoneNumber = generatePhoneNumber();
  console.log(request.body)

  if (!body.name) {
    return response.status(404).json({"error": "Content Missing"});
  };

  const person = {
    id: id,
    name: body.name,
    number: phoneNumber
  }

  if (validNewEntry(person)) {
    persons = persons.concat(person);
    response.json(person);
  } else {
    return response.status(500).json({
      "error": "That person or number already exists"
    })
  }
});

app.get('/api/info', (request, response) => {
  const numPersons = persons.length;
  const date = new Date();
  const body = `<p>There is information for ${numPersons} contacts.</p>
                <p>${date.toString()}`;

  response.send(body);
});

app.get('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
   const person = persons.find( person => person.id === id);

   if (person) {
    response.json(person)
   } else {
    response.statusMessage ="That resource does not exist";
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id)
});

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


