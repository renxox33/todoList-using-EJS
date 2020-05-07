const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
var todaysDate = new Date()
let day = ''

if(todaysDate.getDay() === 6 || todaysDate.getDay() === 0 ) 
    day = 'Weekend'
else
    day = 'Weekday'

app.get('/', (req,res) => {
    res.render('list', {dayOfWeek: day})
    res.sendFile(__dirname + '/index.html')
})

app.listen(port, () => console.log('Listening to requests on port '+ port)
)