const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('css'))

let today = new Date()
let options = {
    weekday: 'long',
    day: 'numeric', 
    month: 'long'
}

let todoItems = []

let day = today.toLocaleString('en-US', options)


app.get('/', (req,res) => {

    res.render('list', { dayOfWeek: day, newListItem: todoItems})
})

app.post('/', (req,res) => {

    todoItems.push(req.body.newTodoItem)
    console.log(todoItems);
    
    res.redirect('/')
    
})

app.get('/about', (req,res) => {
    res.render('about', { dayOfWeek: day })
})

app.listen(port, () => console.log('Listening to requests on port '+ port)
)