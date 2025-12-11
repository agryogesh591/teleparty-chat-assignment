import React, { useState } from "react";
import Lobby from "./components/Lobby";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {!roomId ? (
        <Lobby
          onJoin={(id, nick) => {
            setRoomId(id);
            setNickname(nick);
          }}
        />
      ) : (
        <ChatRoom roomId={roomId} nickname={nickname} />
      )}
    </div>
  );
}

export default App;
