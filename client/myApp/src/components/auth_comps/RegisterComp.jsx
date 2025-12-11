import React, { useState } from 'react'
import { postRequest } from "../../utils/httpRequests"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export const RegisterComp = () => {

    const navigate = useNavigate();

    const [newUser, setNewUser] = useState({
        username: "", password: "", email: "", role: "user", avatar: ''
    });
    const setUserDetails = (e) => {
        let { value, name } = e.target;
        setNewUser({ ...newUser, [name]: value })
    };

    const avatarUrl =
        newUser.avatar.trim() !== ""
            ? `https://i.pravatar.cc/150?u=${(newUser.avatar)}`
            : null;


    const registerUser = async () => {
        if (newUser.username == "" || newUser.password == "" || newUser.email == "" || newUser.avatar == "") {
            alert("Please fill in all the details");
            return;
        }
        let response = await postRequest("api/auth/register", newUser);
        if (typeof response === "string" && response.toLowerCase().includes("created")) {
            alert("הרשמה בוצעה בהצלחה!");
            navigate("/");
            return;
        }
        if (typeof response === "string" && response.toLowerCase().includes("another")) {
            alert(response.toLowerCase());
            return;
        }
        alert("something went wrong, try again later");
        console.log(response);
        console.log(response.toLowerCase());
    }

    return (
        <div>
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-green-600">
                    Sign Up
                </h2>

                <div>
                    <label className="block mb-1 text-gray-700">Name</label>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="type your name"
                        name='username' onChange={setUserDetails}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="email@example.com"
                        name='email' onChange={setUserDetails}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="••••••••"
                        name='password' onChange={setUserDetails}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Avatar name</label>
                    <input
                        type="text"
                        name="avatar"
                        placeholder="e.g. cat-ninja"
                        className="w-full border rounded-lg p-2"
                        onChange={setUserDetails}
                    />

                    {avatarUrl && (
                        <div className="mt-4  mb-1 text-center">
                            <p className="text-sm text-gray-600 mb-2">Avatar Preview:</p>
                            <img
                                src={avatarUrl}
                                alt="Avatar Preview"
                                className="w-24 h-24 mx-auto rounded-full border shadow"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <button onClick={registerUser}>Register</button>
                </div>


                <p className="text-center mt-5 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/" className="text-green-600 font-bold">
                        Click to Log In
                    </Link>
                </p>
            </div >

        </div >

    )
}
