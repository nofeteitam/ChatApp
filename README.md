# Real-Time Chat Application

## Overview

This project is a full-featured **Real-Time Chat Application** that includes both a **backend server** and a **frontend client**.

The system is built with:
- **Backend:** Node.js, Express, MongoDB, Socket.IO
- **Frontend:** React, Vite, Tailwind CSS

The application provides real-time messaging capabilities with user authentication, online status tracking, group chats, and a WhatsApp-style user interface.

---

## System Capabilities

The system supports the following features:

- User registration and login
- JWT-based authentication
- User list display
- Online / Offline status using Socket.IO
- "Last Seen" status
- Real-time private messaging
- Group creation and group messaging
- Persistent message storage in MongoDB
- WhatsApp-inspired UI design
- Responsive and modern chat interface
  
---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Socket.IO Client
- Axios

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Socket.IO
- JWT (jsonwebtoken)
- bcrypt (password hashing)
- CORS
- dotenv

---

## Project Structure

client/myApp
- ├── public
- ├── src
- │ ├── assets
- │ ├── components
- │ ├── redux
- │ ├── utils
- │ ├── api.js
- │ ├── socket.js
- │ ├── App.jsx
- │ ├── main.jsx
- │ └── index.css
- ├── index.html
- ├── vite.config.js
- ├── package.json
- └── README.md

server
- ├── BL
- ├── configs
- ├── models
- ├── routers
- ├── socket
- ├── validations
- ├── main.js
- ├── .env
- └── package.json
  
---

## Installation & Setup

### 1. Clone the Project
```bash
git clone <your-repository-url>
cd FINALPRO
```

### 2. Install Server Dependencies
**Required Packages**
- express
- express-session
- mongoose
- cors
- bcrypt
- jsonwebtoken
- socket.io
- dotenv
- cookie-parser
- nodemon

**Check server \ .env file inside the server folder :**
```PORT=4000
MONGO_URI=your_mongo_connection_string
SECRET_KEY=yourSecretKey
SESSION_SECRET=yourSessionSecret
```

**Run the Server**
```npm start```

**Server will run at:**
```http://localhost:4000```

### 3. Install Client Dependencies
```
cd client/myApp
npm install
```
**Required Packages**
- react
- react-dom
- socket.io-client
- axios
- tailwindcss

**Start the Client**
```npm run dev```

**Client will run at:**
```http://localhost:5173```

## How to Use the System

- Start the backend server (npm start)
- Start the frontend client (npm run dev)
- Register a new user or log in
- Select a user and open a chat
- Send real-time messages
- Create a group and add users
- Send group messages

## Optional Enhancements
- Image / file uploads
- Voice messages
- Group management (admins, permissions)
- Stickers







