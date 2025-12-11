import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

export default function CreateGroupModal({ curUser, users, onClose, onCreate }) {
    const [name, setName] = useState("");
    const [selected, setSelected] = useState([curUser]);

    const toggle = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-80">
                <h2 className="text-xl font-bold mb-4">Create Group</h2>

                <input
                    placeholder="Enter group name"
                    className="border p-2 w-full rounded mb-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="h-40 overflow-auto border rounded p-2">
                    {users.map((u) => (
                        <label key={u._id} className="flex items-center gap-2 mb-2">
                            <input type="checkbox" onChange={() => toggle(u._id)} />
                            {u.username}
                        </label>
                    ))}
                </div>

                <button
                    onClick={() => onCreate(name, selected)}
                    className="bg-green-600 w-full text-black rounded py-2 mt-4"
                >
                    Done
                </button>

                <button onClick={onClose} className="text-black-500 mt-3 block text-center">
                    Cancel
                </button>
            </div>
        </div>
    );
}
