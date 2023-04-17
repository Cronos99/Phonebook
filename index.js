const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan("combined"))

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
    response.json(numbers)
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${numbers.length} people \n ${Date()}`)
})

app.get('/api/persons/:id', (request, response) => {  
    morgan('tiny')
    const id = Number(request.params.id)
    const person = numbers.find(number => number.id === id)
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log("hi");
  numbers = numbers.filter(number => number.id !== id)
  response.status(204).end()
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
  } else if (numbers.some(number => number.name === body.name)){
    return response.status(400).json({
      error: "Name already in phonebook dumdum"
    })
  }
  else {
    const phone = {name:body.name, number:body.number, id:generateId()}
    numbers = numbers.concat(phone)
    response.json(phone) 
  }
  
})


const PORT = 3001 || process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

