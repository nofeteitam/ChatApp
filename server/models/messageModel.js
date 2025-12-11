const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    "senderId": { type: String, required: true },
    "receiverId": { type: String, required: true },
    "message": { type: String, required: true },
    "timestamp": { type: Date },
});

const MessageModel = mongoose.model('Message', MessageSchema, "Messages");
module.exports = MessageModel;