const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            senderName: { type: String },
            message: { type: String },
            timestamp: { type: Date, default: Date.now }
        }
    ],
}, { timestamps: true });


const GroupModel = mongoose.model('Group', GroupSchema, "groups");
module.exports = GroupModel;

