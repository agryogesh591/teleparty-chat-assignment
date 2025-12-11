import React, { useEffect, useState, useRef } from 'react';
import { getClient, SocketMessageTypes, IMessage, ITypingMessage } from './teleparty/telepartyClient';
import { SocketEventHandler } from 'teleparty-websocket-lib';
import Lobby from './components/Lobby';
import ChatRoom from './components/ChatRoom';
import './App.css';

const App: React.FC = () => {
  const [view, setView] = useState<'lobby' | 'chat'>('lobby');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [roomId, setRoomId] = useState<string>('');
  
  // Yahan change kiya hai: Boolean ki jagah String | null
  const [typingDisplay, setTypingDisplay] = useState<string | null>(null);
  
  // Trick: Ye ID aur Nickname ka connection yaad rakhega
  const userNamesRef = useRef<Record<string, string>>({});

  const clientRef = useRef<any>(null);

  useEffect(() => {
    const eventHandler: SocketEventHandler = {
      onConnectionReady: () => {
        console.log("Socket Connection Ready!");
        setIsReady(true);
      },
      onClose: () => {
        console.log("Socket Closed. Please reload.");
        setIsReady(false);
        alert("Connection lost. Please reload the page.");
      },
      onMessage: (message: any) => {
        console.log("Received Message:", message);

        if (message.type === SocketMessageTypes.SEND_MESSAGE) {
          const msg = message.data;
          
          // MAPPING LOGIC: Agar message mein permId aur Nickname hai, toh save kar lo
          if (msg.permId && msg.userNickname) {
            userNamesRef.current[msg.permId] = msg.userNickname;
          }
          
          setMessages((prev) => [...prev, msg]);
        }
        
        if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
          const data = message.data as ITypingMessage;
          
          if (data.anyoneTyping && data.usersTyping && data.usersTyping.length > 0) {
            // Typing karne wale ki ID nikalo
            const typerId = data.usersTyping[0];
            // Check karo kya hum iska naam jante hain?
            const name = userNamesRef.current[typerId] || "Someone"; 
            setTypingDisplay(name);
          } else {
            setTypingDisplay(null);
          }
        }
      }
    };

    clientRef.current = getClient(eventHandler);
  }, []);

  const handleCreateRoom = async (nickname: string) => {
    if (!clientRef.current || !isReady) return;
    try {
      const id = await clientRef.current.createChatRoom(nickname);
      setRoomId(id);
      console.log("Room Created:", id); 
      setView('chat');
    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  const handleJoinRoom = async (nickname: string, roomIdInput: string) => {
    if (!clientRef.current || !isReady) return;
    try {
      const history = await clientRef.current.joinChatRoom(nickname, roomIdInput);
      console.log("Joined Room, History:", history);
      setRoomId(roomIdInput);
      
      if (history && history.messages) {
        // History load karte waqt bhi users ko yaad kar lo
        history.messages.forEach((msg: any) => {
             if (msg.permId && msg.userNickname) {
                 userNamesRef.current[msg.permId] = msg.userNickname;
             }
        });
        setMessages(history.messages);
      }
      
      setView('chat');
    } catch (err) {
      console.error("Failed to join room", err);
      alert("Could not join room. Check ID.");
    }
  };

  const handleSendMessage = (text: string) => {
    if (!clientRef.current) return;
    clientRef.current.sendMessage(SocketMessageTypes.SEND_MESSAGE, { body: text });
  };

  const handleTyping = (isTyping: boolean) => {
    if (!clientRef.current) return;
    clientRef.current.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, { typing: isTyping });
  };

  return (
    <div className="app-container">
      {!isReady && <div className="loading-bar">Connecting to Teleparty Server...</div>}
      
      {view === 'lobby' && (
        <Lobby 
          isReady={isReady} 
          onCreate={handleCreateRoom} 
          onJoin={handleJoinRoom} 
        />
      )}

      {view === 'chat' && (
        <ChatRoom 
          messages={messages} 
          roomId={roomId}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          typingUser={typingDisplay} // Ab ye sahi variable pass kar raha hai
        />
      )}
    </div>
  );
};

export default App;