const express = require('express');
const app = express();
require("dotenv").config();
require("./configs/connectDB")();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const authRouter = require('./routers/authRouter');
const usersRouter = require("./routers/usersRouter");
const messagesRouter = require("./routers/messagesRouter");
const groupRouter = require("./routers/groupRouter");


app.use(express.json());
app.use(require('cors')({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    credentials: true
}));

app.use(require("express-session")({
    secret: process.env.SESSION_SECRET,
    name: "MyCookie",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: 'lax'
    }
}));

// ROUTERS
app.use("/api/users", usersRouter);
app.use("/api/messages", messagesRouter);
app.use('/api/auth', authRouter);
app.use('/api/groups', groupRouter);

// SOCKET.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// socket logic
require("./socket/chatSocket")(io);

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});



