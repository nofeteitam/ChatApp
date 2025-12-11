const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    "username": { type: String, required: true, unique: true },
    "password": { type: String, required: true },
    "email": { type: String, required: true, unique: true },
    "role": { type: String, enum: ['admin', 'user'], default: 'user' },
    "avatar": { type: String, required: true, },
    "lastSeen": {
        type: Date,
        default: () => new Date()
    }
})

const UserModel = mongoose.model('User', UserSchema, "users");
module.exports = UserModel;