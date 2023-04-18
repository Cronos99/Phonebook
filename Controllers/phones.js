const phonesRouter = require('express').Router()
const Number = require('../models/number')
const logger = require('../utils/logger')

phonesRouter.get('/', (request, response) => {
    Number.find({}).then(numbers => {
      response.json(numbers)
    })
})

phonesRouter.get('/:id', (request, response, next) => {  
  Number.findById(request.params.id).then(number => {
    response.json(number)
  }).catch(error => next(error))
})

phonesRouter.delete('/:id', (request, response, next) => {
  Number.findByIdAndDelete(request.params.id).then(number => {
    response.status(204).end()
  }).catch(error => next(error))
})


phonesRouter.post("/", (request, response, next) => {
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
    }).catch(error => next(error))
  }
  
})

phonesRouter.put(`/:id`, (request, response, next) => {
  const body = request.body

  const number = {
    name: body.name,
    number: body.number
  }

  Number.findByIdAndUpdate(request.params.id, number, {new:true}).then(updatedNote => {
    response.json(updatedNote)
  }).catch(error => next(error))

})

module.exports = phonesRouter