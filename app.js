const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('css'))

mongoose.connect('mongodb+srv://admin-raj:Test123@cluster0-3zpqz.mongodb.net/todolistItems', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name of to-do cannot be empty']
    }
})

const listSchema = mongoose.Schema({
    name: String,
    list: [itemSchema]
})

const Item = mongoose.model('Item', itemSchema)

const List = mongoose.model('List', listSchema)

const newItem1 = new Item({
    name: 'Fix DTD'
})

const newItem2 = new Item({
    name: 'Code some more'
})

const newItem3 = new Item({
    name: 'Exercise'
})

const itemsList = [newItem1, newItem2, newItem3]

// Item.insertMany(itemsList, (err, items) => {
//     if(err){
//         console.log(err)
//     } else{
//         console.log('Todos inserted')
//         console.log(items);
        
//     }
// })



app.get('/', (req,res) => {

    Item.find({}, (err,items) => {
        if(err){
            console.log(err)
        } else{  
            res.render('list', { dayOfWeek: 'Today', newListItem: items})
        }
    })

    
})

app.post('/', (req,res) => {

    const listName = req.body.listName.toLowerCase()

    const newTodoItem = new Item({     
            name: req.body.newTodoItem
    })

    if(listName === 'today'){
        Item.insertMany([newTodoItem], (err, data) => {
            if(err){
                console.log(err);
                
            }else{
                console.log(data);
                res.redirect('/')
            }
        })
    } else{
        List.findOne({ name: listName }, async (err, foundList) => {
            if(err){
                console.log(err);
                
            } else{
                if(foundList){
                    
                    foundList.list.push(newTodoItem)
                    await foundList.save()
                    res.redirect('/' + listName)
                }
            }
        })
    }
    
})

app.post('/delete', (req,res) => {
    const itemId =  req.body.checkbox
    const listName = req.body.listName.toLowerCase()

    if(listName === 'today'){
        Item.findOneAndDelete({ _id: itemId }, (err) => {
            
            if(err){
                console.log(err);   
            }
            res.redirect('/')
        })
    } else{
        List.findOneAndUpdate({ name: listName }, {$pull: {list: {_id: itemId}}}, (err, foundList) => {
            if(err){
                console.log(err);
                
            } else{
                if(foundList){
                    foundList.save()
                    res.redirect('/' + listName)
                }
            }
        })
    }

    
})

app.get('/:listId', (req,res) => {
    const listName = req.params.listId.toLowerCase()

    List.findOne({ name: listName }, (err, list) => {
        if(err){
            console.log(err);
        } else{
            if(list){
                res.render('list', { dayOfWeek: listName.toUpperCase(), newListItem: list.list })
                
            } else{

                const newList = new List({
                    name: listName,
                    list: itemsList
                })
            
                newList.save()
                res.redirect('/' + req.params.listId)
            }
            
        }
    })

    
})

app.get('/about', (req,res) => {
    res.render('about', { dayOfWeek: day })
})

app.listen(port, () => console.log('Listening to requests on port '+ port)
)