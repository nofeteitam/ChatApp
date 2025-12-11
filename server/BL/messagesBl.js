const Message = require("../models/messageModel");

exports.getChatHistory = async (u1, u2) => {
    return await Message.find({
        $or: [
            { senderId: u1, receiverId: u2 },
            { senderId: u2, receiverId: u1 }
        ]
    }).sort({ timestamp: 1 });
};
