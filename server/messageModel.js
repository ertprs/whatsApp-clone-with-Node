import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
    message: String,
    name: String,
    received:Boolean
},{ timestamps: true })

export default mongoose.model('messages', messageSchema)