const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
    console.log(req.session.token)
    const { token } = req.session;
    if (!token) return res.status(401).send("Access denied");
    try {
        jwt.verify(token, process.env.SECRET_KEY);
        console.log("Token is valid");
        next();
    } catch (error) {
        console.log("Invalid token:", error.message);
        return res.status(403).send("Invalid token");
    }
}

module.exports = validateToken;