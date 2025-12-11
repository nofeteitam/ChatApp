// socket/chatSocket.js
const Message = require("../models/messageModel");
const GroupModel = require("../models/groupModel");
const UserModel = require("../models/usersModel");
//const Group = require("../models/Group");

const onlineUsers = {};

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("user_connected", (userId) => {
            onlineUsers[userId] = socket.id;
            console.log("User online:", userId);
            io.emit("user_status_change", { userId, online: true, lastSeen: null });

            const currentlyOnline = Object.keys(onlineUsers);
            socket.emit("initial_online_list", currentlyOnline);
        });

        socket.on("disconnect", () => {
            const userId = Object.keys(onlineUsers).find(
                (id) => onlineUsers[id] === socket.id
            );

            if (userId) {
                delete onlineUsers[userId];

                UserModel.findByIdAndUpdate(userId, {
                    lastSeen: new Date()
                }).catch(console.error);

                io.emit("user_status_change", {
                    userId,
                    online: false,
                    lastSeen: new Date()
                });
            }
        });

        socket.on("send_message", async (data) => {
            const msg = new Message({
                senderId: data.senderId,
                receiverId: data.receiverId,
                message: data.message,
                timestamp: new Date()
            });

            await msg.save();

            io.emit(`chat_${data.receiverId}`, msg);
        });

        socket.on("group_message", async (data) => {
            console.log("we here ");
            const { groupId, senderId, senderName, message } = data;
            const group = await GroupModel.findById(groupId);
            console.log("we here " +
                group);
            if (!group) return;

            const msg = {
                senderId,
                senderName,
                message,
                timestamp: new Date()
            };

            group.messages.push(msg);
            await group.save();


            group.members.forEach((memberId) => {
                io.emit(`group_${memberId}`, { ...msg, groupId });
            });

        });

        socket.on("disconnect", () => {
            const userId = Object.keys(onlineUsers).find(
                (id) => onlineUsers[id] === socket.id
            );

            if (userId) {
                delete onlineUsers[userId];


                UserModel.findByIdAndUpdate(userId, {
                    lastSeen: new Date()
                }).catch(console.error);

                io.emit("user_status_change", {
                    userId,
                    online: false,
                    lastSeen: new Date()
                });
            }
        });

    });
};
