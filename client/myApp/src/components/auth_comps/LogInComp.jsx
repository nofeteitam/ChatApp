import React, { useState } from 'react'
import { postRequest } from "../../utils/httpRequests"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from "C:/fullstuck/FinalPro/client/myApp/src/api.js";
import { socket } from "C:/fullstuck/FinalPro/client/myApp/src/socket.js";

export const LogInComp = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", password: "" });

  const setUserDetails = (e) => {
    let { value, name } = e.target;
    setUser({ ...user, [name]: value })
  };

  const logInBtn = async () => {
    if (user.username == "" || user.password == "") {
      alert("Please fill in all the details");
      return;
    }
    let response = await postRequest("api/auth/login", user);

    if (typeof response === "string") {
      console.log("we here")
      alert(response);
      return;
    }
    if (response.message === "Login successful") {
      //console.log(response.message);
      //console.log(response);
      alert("התחברות בוצעה בהצלחה!");
      console.log(response);
      let userData = {
        username: response.username,
        _id: response._id,
        avatar: response.avatar,
        lastSeen: response.lastSeen
      };
      console.log(userData);
      if (!socket.connected) {
        socket.connect();
        socket.emit("user_connected", response._id);
      }
      navigate("/home", { state: { user: userData } });
      return;
    }
    alert("שגיאה לא צפויה");
    console.log("Unexpected response:", response);

  }
  return (
    <div>{
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-600">
          Sign In
        </h2>

        <div>
          <label className="block mb-1 text-gray-700">שם</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your username"
            name='username' onChange={setUserDetails}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">סיסמה</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 mb-3"
            placeholder="••••••••"
            name='password' onChange={setUserDetails}
          />
        </div>

        <div>
          <button onClick={logInBtn}>Sign-In</button>
        </div>


        <p className="text-center mt-5 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 font-bold">
            Click to Sign Up
          </Link>
        </p>
      </div>
    }
    </div>


  )
}
