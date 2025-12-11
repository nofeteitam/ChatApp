const UserModel = require("../models/usersModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerUser = async (userData) => {
    try {
        if (!userData.username || !userData.password || !userData.email)
            return "Pleae Provide all details";
        const existingUser = await UserModel.findOne({ username: userData.username });
        if (existingUser) {
            return "Username already exists, please choose another one";
        }
        const existingEEmail = await UserModel.findOne({ email: userData.email });
        if (existingEEmail) {
            return "email already exists, please choose another one";
        }
        userData.password = await bcrypt.hash(userData.password, 10);
        console.log(userData)
        let newUser = new UserModel(userData);
        await newUser.save();
        return "User created successfully";
    } catch (error) {
        return "Error creating User : " + error.message;
    }
}
const logInUser = async (userData) => {
    try {
        if (!userData.username || !userData.password)
            return "Pleae Provide all details";
        let { username, password } = userData;
        let user = await UserModel.findOne({ username })
        if (!user) {
            console.log("we here")
            return "User not exist, please register";
        }
        let compareResponse =
            await bcrypt.compare(password, user.password);
        if (!compareResponse) return "Incorrect password";
        let lastSeen = new Date();
        user.lastSeen = lastSeen;
        let res = await user.save();
        // console.log(res);
        let _id = user._id;
        let avatar = user.avatar;
        let token =
            jwt.sign({ id: user._id, role: user.role },
                process.env.SECRET_KEY, { expiresIn: '2h' })
        console.log("we didnt crash til here");
        return { message: "Login successful", token, username, _id, avatar, lastSeen }
    } catch (error) {
        console.log("we crash here")
        return "Error  : " + error.message;
    }
}

module.exports = { registerUser, logInUser }