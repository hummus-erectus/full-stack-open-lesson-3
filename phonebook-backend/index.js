const express = require('express')
const morgan = require("morgan")
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

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
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const randomId = Math.floor(Math.random()*999999)

  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'Name field is missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number field is missing'
    })
  }

  const person ={
    id: randomId,
    name: body.name,
    number: body.number,
  }

  if (persons.find(p => p.name === person.name)){
    return response.status(400).json({
      error: 'A person with that name already exists'
    })
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})