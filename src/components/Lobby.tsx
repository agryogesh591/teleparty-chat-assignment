import React, { useState } from "react";
import { createRoom, joinRoom } from "../teleparty/telepartyClient";

interface LobbyProps {
  onJoin: (roomId: string, nickname: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onJoin }) => {
  const [nickname, setNickname] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleCreate = async () => {
    if (!nickname.trim()) return;

    const room = await createRoom(nickname);
    onJoin(room.id, nickname);
  };

  const handleJoin = async () => {
    if (!nickname.trim() || !roomId.trim()) return;

    await joinRoom(roomId, nickname);
    onJoin(roomId, nickname);
  };

  return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f5f5f5"
    }}
  >
    <div
      style={{
        width: "330px",   // ⬅️ reduced width
        background: "white",
        padding: "30px",   // ⬅️ slightly smaller padding
        borderRadius: "12px",
        boxShadow: "0px 0px 20px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "22px" }}>
        Teleparty Lobby
      </h2>

      {/* Nickname */}
      <input
        placeholder="Enter nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "14px"
        }}
      />

      <button
        onClick={handleCreate}
        style={{
          width: "100%",
          padding: "10px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          marginBottom: "18px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        Create Room
      </button>

      <hr style={{ marginBottom: "18px" }} />

      {/* ROOM ID INPUT */}
      <input
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "14px"
        }}
      />

      <button
        onClick={handleJoin}
        style={{
          width: "100%",
          padding: "10px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        Join Room
      </button>
    </div>
  </div>
);

};

export default Lobby;
