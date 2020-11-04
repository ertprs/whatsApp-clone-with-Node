import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import Messages from './messageModel.js'
import Pusher from 'pusher'



// app config
const app = express()
const port = process.env.PORT || 8000

//middleware
app.use(express.json())
app.use(cors())


// pusher config 
const pusher = new Pusher({
    appId: "1100558",
    key: "cdf43416aafbcf93fc2c",
    secret: "c9ff5d51c375a1a900a2",
    cluster: "ap4",
    useTLS: true
})
const db = mongoose.connection
db.once('open', () => {
    console.log('DB connected')
    const msgCollection = db.collection('messages')
    const changeStream = msgCollection.watch()
    changeStream.on('change', (change) => {
        // console.log('change occured',change)
        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument
            pusher.trigger('messages', 'inserted', {
                _id:messageDetails._id,
                message: messageDetails.message,
                name: messageDetails.name,
                received:messageDetails.received,
                timestamp: messageDetails.createdAt
            })
        } else {
            console.log('Error triggering Pusher')
        }
    })
})

// db config
const connection_rul = "mongodb+srv://db-admin:DBadmin@cluster0.y2qlt.mongodb.net/whatsApp?retryWrites=true&w=majority"
mongoose.connect(connection_rul, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

// app routes
app.get('/', (req, res) => res.status(200).send('whatsApp server is up and running'))

app.get('/messages', (req, res) => {
    Messages.find((err, data) => {
        if (err) {
           return res.status(500).json({err})
        } else {
           return res.status(200).json(data)
        }
    })
})

app.post('/messages/add', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).json({err})
        } else {
            res.status(201).json({data})
        }
    })

})


// listen
app.listen(port,() => console.log('whatsApp server is up and running'))