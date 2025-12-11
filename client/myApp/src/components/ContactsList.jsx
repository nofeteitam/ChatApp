// src/components/ContactsList.jsx
import React from "react";
import { useState, useEffect } from "react";
import API from "C:/fullstuck/FinalPro/client/myApp/src/api.js";
import { socket } from "C:/fullstuck/FinalPro/client/myApp/src/socket.js";

export default function ContactsList({ users = [], groups = [], selectedId, onSelect, addGroup }


) {

    const [userStatus, setUserStatus] = useState({});

    useEffect(() => {
        const loadInitialStatus = async () => {
            if (users.length === 0) {
                return;
            }
            //  console.log(users);
            const map = {};
            users.forEach(u => {
                const existing = userStatus[u._id];
                map[u._id] = {
                    online: existing ? existing.online : false,
                    lastSeen: u.lastSeen || existing?.lastSeen || null
                };
            });
            setUserStatus(map);
        };

        loadInitialStatus();
    }, [users])

    useEffect(() => {
        socket.on("initial_online_list", (onlineUsersIds) => {
            console.log("Received initial online list:", onlineUsersIds);
            setUserStatus(prevStatus => {
                const newStatus = { ...prevStatus };
                users.forEach(u => {
                    const key = u._id;
                    if (onlineUsersIds.includes(key)) {
                        newStatus[key] = { online: true, lastSeen: null };
                    }
                    else if (newStatus[key]) {
                        newStatus[key].online = false;
                    }
                });
                return newStatus;
            });
        });
        socket.on("user_status_change", (data) => {
            updateUserStatus(data.userId, data.online, data.lastSeen);
        });

        return () => {
            socket.off("initial_online_list");
            socket.off("user_status_change");
        };

    }, [users]);

    function updateUserStatus(userId, online, lastSeen) {
        console.log(userId, online, lastSeen);
        console.log("hey we here");
        setUserStatus(prev => ({
            ...prev,
            [userId]: { online, lastSeen }
        }));
        // console.log(userStatus);
    }

    useEffect(() => {
        socket.on("user_status_change", (data) => {
            console.log(data);
            updateUserStatus(data.userId, data.online, data.lastSeen);
        });

        return () => socket.off("user_status_change");
    }, []);

    const formatTimestamp = (isoDate) => {

        const date = new Date(isoDate);
        const now = new Date();

        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        if (isToday) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
        return date.toLocaleString([], {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (

        <div className="mt-0 w-90 border-x border-gray-200 h-full overflow-auto bg-white">
            <div className="p-1.5 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Contacts</h2>
                <button
                    className="bg-green-300 text-black px-2 py-0.5 rounded text-sm"
                    onClick={() => addGroup(true)}
                >
                    New Group
                </button>
            </div>

            {groups.map((g) => (
                <button
                    key={g._id}
                    onClick={() => onSelect({ ...g, isGroup: true })}
                    className={`w-full text-left flex items-center gap-3 p-3 border-b hover:bg-gray-50 ${selectedId === g._id ? "bg-gray-100" : ""
                        }`}
                >
                    <div className="w-12 h-12 rounded-full bg-purple-300 flex items-center justify-center text-white text-lg font-bold">
                        {g.name[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium">{g.name}</div>
                        <div className="text-xs text-gray-500">{g.members.length} members</div>
                    </div>
                </button>
            ))}

            {users.map((u) => (
                <button
                    key={u._id}
                    onClick={() => onSelect({ ...u, isGroup: false })}
                    className={`w-full text-left flex items-center gap-3 p-3 border-b hover:bg-gray-50 ${selectedId === u._id ? "bg-gray-100" : ""
                        }`}
                >
                    <img
                        src={`https://i.pravatar.cc/150?u=${u.avatar}` || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}`}
                        alt={u.username}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${userStatus[u._id]?.online ? "bg-green-500" : "bg-gray-400"}`}></span>
                            <span>{u.username}</span>
                        </div>
                        {!userStatus[u._id]?.online && (
                            <div className="text-xs text-gray-500">
                                lastSeen: {formatTimestamp(u.lastSeen)}
                            </div>
                        )}

                    </div>
                </button>
            ))}
        </div>
    );
}


