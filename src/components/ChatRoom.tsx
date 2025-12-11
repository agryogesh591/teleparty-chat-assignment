import React, { useEffect, useRef, useState } from "react";
import { onMessage, sendMessage, sendTyping } from "../teleparty/telepartyClient";

interface ChatRoomProps {
  roomId: string;
  nickname: string;
}

let listeners: any[] = [];

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, nickname }) => {
  const [messages, setMessages] = useState<{ user: string; body: string }[]>([]);
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null); // NEW
  const [input, setInput] = useState("");

  const chatRef = useRef<HTMLDivElement>(null);
  const processed = useRef<Set<string>>(new Set()); // prevent duplicates

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Listener for receiving messages
  useEffect(() => {
    const handler = (msg: any) => {
      // ------------- RECEIVE MESSAGE -------------
      if (msg.type === "SEND_MESSAGE") {
        if (processed.current.has(msg.data.id)) return;
        processed.current.add(msg.data.id);

        setMessages((prev) => [...prev, msg.data]);
        setTyping(false);
        setTypingUser(null);
      }

      // ------------- TYPING INDICATOR -------------
      if (msg.type === "TYPING") {
        if (msg.data.user !== nickname) {
          if (msg.data.typing) {
            setTyping(true);
            setTypingUser(msg.data.user); // show user name
          } else {
            setTyping(false);
            setTypingUser(null);
          }
        }
      }
    };

    listeners.push(handler);
    onMessage(handler);

    // cleanup
    return () => {
      listeners = listeners.filter((fn) => fn !== handler);
    };
  }, [nickname]);

  // Send message
  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(nickname, input);
    sendTyping(nickname, false);
    setInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "330px",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
          Room: {roomId}
        </h3>

        {/* MESSAGE BOX */}
        <div
          ref={chatRef}
          style={{
            border: "1px solid #ccc",
            height: "220px",
            overflowY: "auto",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          {messages.map((m, i) => {
            const isSelf = m.user === nickname;
            return (
              <div
                key={i}
                style={{
                  textAlign: isSelf ? "right" : "left",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: isSelf ? "#007bff" : "#eee",
                    color: isSelf ? "white" : "black",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    maxWidth: "85%",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>{m.user}: </strong> {m.body}
                  <div
                    style={{
                      fontSize: "10px",
                      marginTop: "4px",
                      opacity: 0.8,
                      textAlign: isSelf ? "right" : "left",
                    }}
                  >
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* TYPING INDICATOR */}
        {typing && typingUser && (
          <div
            style={{
              fontStyle: "italic",
              color: "gray",
              marginBottom: "8px",
              fontSize: "13px",
            }}
          >
            {typingUser} is typing...
          </div>
        )}

        {/* INPUT AREA */}
        <input
          value={input}
          placeholder="Type a message..."
          onChange={(e) => {
            setInput(e.target.value);
            sendTyping(nickname, true);
          }}
          onBlur={() => sendTyping(nickname, false)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        <button
          onClick={handleSend}
          style={{
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
