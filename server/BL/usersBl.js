const User = require("../models/usersModel");

exports.getUsers = async () => {
    return await User.find({}, "_id username avatar lastSeen");
};
