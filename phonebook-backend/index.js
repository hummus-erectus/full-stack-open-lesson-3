require('dotenv').config()
const express = require('express')
const morgan = require("morgan")
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

// app.get('/info', (request, response) => {
//   response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date}</p>`)
// })

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    // .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {

  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'Name field is missing'
    })
  }

  if (body.number === undefined) {
    return response.status(400).json({
      error: 'Number field is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  // if (persons.find(p => p.name === person.name)){
  //   return response.status(400).json({
  //     error: 'A person with that name already exists'
  //   })
  // }

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})