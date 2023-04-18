const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}
  
const password = process.argv[2]

const url = `mongodb+srv://chris:${password}@fullstackcourse.g231yap.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const numSchema = new mongoose.Schema({
    name: String,
    number: String
  })


const Number = mongoose.model('Number', numSchema)
/*
const num = new Number({
  name: "ada lovelace",
  number: "420-0121"
})

num.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
}) 
*/

Number.find({}).then(result => {
  result.forEach(note => {
    console.log(`${note.name} - ${note.number}`)
  });
})