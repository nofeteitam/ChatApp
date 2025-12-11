// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ContactsList from "./ContactsList";
import ChatWindow from "./ChatWindow";
import CreateGroupModal from "./CreateGroupModal ";
import GroupChat from "./GroupChat";
import { socket } from "../../socket";
import API from "../../api";


export const HomeComp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currenUser =
        location.state?.user || { _id: "Guest", username: "Guest", avatar: "" };
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groups, setGroups] = useState([]);



    const createGroup = async (name, members) => {
        try {
            const res = await API.post("/groups", { name, members });
            const groupObj = { ...res.data, isGroup: true };
            setGroups((g) => [...g, groupObj]);
            setSelected(groupObj);
            setShowGroupModal(false);
            fetchGroups();
        } catch (err) {
            console.error("create group", err);
        }

    };

    const fetchGroups = async () => {
        try {

            const res = await API.get("/groups");
            const allGroups = res.data;
            console.log(allGroups);
            const userGroups = allGroups.filter(g =>
                g.members.some(m => m._id === currenUser._id)
            );

            setGroups(userGroups);
        } catch (err) {
            console.log("Error loading groups:", err);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);


    useEffect(() => {
        if (currenUser._id === "Guest") return;
        const load = async () => {
            console.log(currenUser);
            try {
                const res = await API.get("/users");
                const others = res.data.filter(
                    (u) => u.username !== currenUser.username
                );
                setUsers(others);
            } catch (err) {
                console.error("load users", err);
            }
        };

        load();
    }, []);

    const logout = () => {
        socket.disconnect();
        navigate("/");
    };


    const handleSelectContact = (select) => {
        setSelected(select);
        //console.log("SELECTED:", selected);
    };

    return (
        <div className="mt-0 h-screen flex flex-col bg-white border border-gray-200 shadow-sm rounded-lg">
            {/*  */}
            <div className="h-12 bg-green-700 text-black flex justify-between items-center px-4 shadow-md">
                <div className="flex items-center gap-3">
                    <img
                        src={`https://i.pravatar.cc/150?u=${currenUser.avatar}`}
                        alt={currenUser.avatar}
                        className="w-10 h-10 rounded-full"
                    />
                    <h2 className="text-lg font-semibold">
                        Hello {currenUser.username}
                    </h2>
                </div>

                <button
                    onClick={logout}
                    className="bg-gray/50 hover:bg-black px-2 py-1 rounded-xl text-sm font-bold text-black"
                >
                    LOGOUT
                </button>
            </div>


            <div className="flex flex-2">

                {showGroupModal && (
                    <CreateGroupModal
                        curUser={currenUser}
                        users={users}
                        onClose={() => setShowGroupModal(false)}
                        onCreate={createGroup}
                    />
                )}

                <ContactsList
                    users={users}
                    groups={groups}
                    selectedId={selected?._id}
                    onSelect={handleSelectContact}
                    addGroup={setShowGroupModal}
                />

                {/* CHAT AREA */}
                {currenUser._id === "Guest" ? (
                    <div className="w-90 flex items-center justify-center text-gray-400 text-xl">
                        please login
                    </div>
                ) : (
                    selected ? (
                        selected.isGroup ? (
                            < GroupChat user={currenUser} group={selected} />

                        ) : (
                            <ChatWindow user={currenUser} contact={selected} />
                        )
                    ) : (
                        <div className="w-90 flex items-center justify-center text-gray-400">
                            Select a contact to start a chat
                        </div>
                    )
                )}
            </div>
        </div>
    );
};
