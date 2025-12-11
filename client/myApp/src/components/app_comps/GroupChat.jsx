import React, { useRef, useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { socket } from "C:/fullstuck/FinalPro/client/myApp/src/socket.js";
import API from "C:/fullstuck/FinalPro/client/myApp/src/api.js";
import EmojiPicker from "emoji-picker-react";

export default function GroupChat({ user, group }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const listRef = useRef();
    const [showEmoji, setShowEmoji] = useState(false);
    const textareaRef = useRef(null);

    {/*init*/ }
    useEffect(() => {
        if (!group) return
        if (!socket.connected) {
            socket.connect();
            socket.emit("user_connected", user._id);
        }
        console.log(group);

        const load = async () => {
            const res = await API.get(`/groups/${group._id}`);
            setMessages(res.data.messages);
            scroll();
        };
        load();


        socket.on(`group_${user._id}`, (msg) => {
            if (msg.groupId === group._id) {
                setMessages((p) => [...p, msg]);
                scroll();
            }
        });

        return () => socket.off(`group_${user._id}`);
    }, [group]);

    const scroll = () =>
        setTimeout(() => {
            if (listRef.current)
                listRef.current.scrollTop = listRef.current.scrollHeight;
        }, 50);

    const send = () => {
        if (!text.trim()) return;

        const payload = {
            groupId: group._id,
            senderId: user._id,
            senderName: user.username,
            message: text,
        };
        console.log(payload);

        socket.emit("group_message", payload);

        // setMessages((p) => [...p, { ...payload, timestamp: new Date() }]);
        setText("");
        scroll();
    };

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

    {/*Resize the text box*/ }
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [text]);


    return (
        <div className="mb-t w-90 h-full border-r border-gray-200 flex flex-col">
            {/*Name of the group, memmbers*/}
            <div className="p-2 border-b bg-gray-100 border-gray-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-white text-lg font-bold">
                    {group.name[0].toUpperCase()}
                </div>
                <div>
                    <div className="font-semibold">{group.name}</div>
                    {group.members && group.members.length > 0 && (
                        <div className="text-xs text-gray-500 truncate max-w-xs text-left">
                            {group.members.map(member => {
                                if (member._id === user._id) {
                                    return "You";
                                }
                                return member.username;
                            })
                                .join(', ')}
                        </div>
                    )}
                </div>
            </div>
            {/*background*/}
            <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3"
                style={{
                    backgroundImage: "url('/chatbacg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backdropFilter: "blur(1px) brightness(0.95)"

                }}>
                {/*pressent the messages*/}
                {messages.map((m, i) => {
                    const mine = m.senderId === user._id;
                    return (
                        <div
                            key={i}
                            className={`flex items-end gap-3 mb-4 ${mine ? "justify-end" : "justify-start"}`}
                        >
                            {!mine && (
                                <img
                                    src={`https://ui-avatars.com/api/?name=${m.senderName}&background=random`}
                                    alt=""
                                    className="w-9 h-9 rounded-full object-cover"
                                />
                            )}
                            <div
                                className={`relative p-4 rounded-2xl max-w-[70%] shadow-sm ${mine ? "bg-green-600 text-white" : "bg-gray-100 text-black"} `}>
                                <span
                                    className={`absolute top-4 w-3 h-3 rotate-45 ${mine ? "bg-green-600 right-[-6px]" : "bg-gray-100 left-[-6px]"} rounded-sm`}
                                ></span>
                                <div className="break-words text-[15px] leading-relaxed text-right rtl-text">
                                    {m.message}
                                </div>
                                <div className={`text-xs opacity-70 mt-1 text-right ${mine ? "text-white" : "text-gray-500"}`}>
                                    {formatTimestamp(m.timestamp || Date.now())}
                                </div>
                            </div>
                        </div>

                    );
                })}
            </div>

            <div className="p-2 px-4 bg-zinc-50 border-t border-gray-200 flex gap-3 items-center">
                {/*Text*/}
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                    className="flex-1 p-3 resize-none overflow-y-auto min-h-[48px] max-h-[200px]"
                    rows={1}
                    placeholder="Write a message..."
                />

                {/*Emoji*/}
                <button
                    className="text-2xl"
                    onClick={() => setShowEmoji(!showEmoji)}
                >
                    😊
                </button>

                {/*Adding Emoji to the existing text*/}
                {showEmoji && (
                    <div className="absolute bottom-12 center z-50">
                        <EmojiPicker
                            onEmojiClick={(emoji) => {
                                setText(prev => prev + emoji.emoji);
                                setShowEmoji(false);
                            }}
                        />
                    </div>
                )}

                {/*Image upload - option to the future
                 <button className="text-2xl">📷</button> */}

                {/*Audio upload - option to the future
                <button className="text-2xl">🎤</button> */}

                <button onClick={send} className="bg-green-600 text-black px-4 py-2 rounded-xl">Send</button>
            </div>
        </div>
    );
}
