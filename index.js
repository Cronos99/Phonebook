require('dotenv').config()


const express = require('express')
const Number = require('./models/number')
var morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const { log } = require('console')
const { request } = require('http')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan("combined"))

const errorHandler = (error, request, response,  next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}

app.use(errorHandler)


let numbers = [
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
      "number": "39-23-5423122"
    }
]


app.get('/', (request, response) => {
    response.send("hello world")
})

app.get('/api/persons', (request, response) => {
    Number.find({}).then(numbers => {
      log(numbers)
      response.json(numbers)
    })
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${numbers.length} people \n ${Date()}`)
})

app.get('/api/persons/:id', (request, response, next) => {  
  Number.findById(request.params.id).then(number => {
    response.json(number)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Number.findByIdAndDelete(request.params.id).then(number => {
    response.status(204).end()
  })
})

const generateId = () => {
  const minId = numbers.length > 0 ? Math.max(...numbers.map(n => n.id)):0
  return minId+1
}


app.post("/api/persons", (request, response) => {
  const body = request.body
  if (!body.name){
    return response.status(400).json({
      error: "Missing a name"
    })
  } else if (!body.number){
    return response.status(400).json({
      error: "Missing a number"
    })
  } 
  else {
    const phone = new Number({
      name: body.name,
      number: body.number
    })

    phone.save().then(savedPhone => {
      response.json(savedPhone)
    })
  }
  
})

app.put(`/api/notes/:id`, (request, response, next) => {
  const body = request.body

  const number = {
    name: body.name,
    number: body.number
  }

  Number.findByIdAndUpdate(request.params.id, number, {new:true}).then(updatedNote => {
    response.json(updatedNote)
  }).catch(error => next(error))

})


const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

