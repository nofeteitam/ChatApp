import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import API from "../../api";
import EmojiPicker from "emoji-picker-react";

export default function ChatWindow({ user, contact }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const listRef = useRef();
    const [showEmoji, setShowEmoji] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!contact) return;

        // connect socket if not connected
        if (!socket.connected) {
            socket.connect();
            socket.emit("user_connected", user._id);
        }

        // load history
        const load = async () => {
            try {
                console.log(user)
                const res = await API.get(`/messages/${user._id}/${contact._id}`);
                //console.log(res.data)
                setMessages(res.data || []);
                scrollToBottom();
            } catch (err) {
                console.error("load history:", err);
            }
        };
        load();

        const eventName = `chat_${user._id}`;
        socket.on(eventName, (msg) => {
            if (
                (msg.senderId === contact._id && msg.receiverId === user._id) ||
                (msg.senderId === user._id && msg.receiverId === contact._id)
            ) {
                setMessages((p) => [...p, msg]);
                scrollToBottom();
            }
        });

        return () => {
            socket.off(eventName);
        };

    }, [contact]);

    const scrollToBottom = () => {
        setTimeout(() => {
            if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
        }, 50);
    };

    const send = () => {
        if (!text.trim()) return;

        const payload = {
            senderId: user._id,
            receiverId: contact._id,
            message: text.trim(),
            timestamp: new Date().toISOString(),
        };

        // emit to server
        socket.emit("send_message", payload);

        // optimistic update (server will also save and broadcast)
        setMessages((p) => [...p, payload]);
        setText("");
        scrollToBottom();
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

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [text]);

    return (
        <div className="mb-t w-90 border-r border-gray-200 h-full flex flex-col">
            <div className="p-2 bg-gray-100 border-b border-gray-200 flex items-center gap-3">
                <img src={contact ? `https://i.pravatar.cc/150?u=${contact.avatar}` :
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(contact?.username || "")}`}
                    className="w-10 h-10 rounded-full" />
                <div>
                    <div className="font-semibold">{contact?.username}</div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3" style={{
                backgroundImage: "url('/chatbacg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backdropFilter: "blur(1px) brightness(0.95)"

            }} ref={listRef}>
                {messages.map((m, i) => {
                    const mine = m.senderId === user._id;
                    return (
                        <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
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
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                    className="flex-1 p-3 resize-none overflow-y-auto min-h-[48px] max-h-[200px]"
                    rows={1}
                    placeholder="Write a message..."
                />

                {/* Emoji*/}
                <button
                    className="text-2xl"
                    onClick={() => setShowEmoji(!showEmoji)}
                >
                    😊
                </button>

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
