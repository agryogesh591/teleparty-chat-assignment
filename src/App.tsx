import React, { useEffect, useState, useRef } from 'react';
import { getClient, SocketMessageTypes, IMessage, ITypingMessage } from './teleparty/telepartyClient';
import { SocketEventHandler } from 'teleparty-websocket-lib';
import Lobby from './components/Lobby';
import ChatRoom from './components/ChatRoom';
import './App.css'; // Assuming you have basic CSS

const App: React.FC = () => {
  const [view, setView] = useState<'lobby' | 'chat'>('lobby');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isReady, setIsReady] = useState(false); // Check if socket is connected
  const [roomId, setRoomId] = useState<string>('');
  const [isSomeoneTyping, setIsSomeoneTyping] = useState(false);
  
  // Ref to access the client without re-rendering issues
  const clientRef = useRef<any>(null);

  useEffect(() => {
    // 1. Define Event Listener
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

        // Handle Chat Messages
        if (message.type === SocketMessageTypes.SEND_MESSAGE) {
          setMessages((prev) => [...prev, message.data]);
        }
        
        // Handle Typing Presence
        if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
          const data = message.data as ITypingMessage;
          setIsSomeoneTyping(data.anyoneTyping);
        }
      }
    };

    // 2. Initialize Client
    clientRef.current = getClient(eventHandler);

    // Cleanup on unmount (optional)
    return () => {
       // logic to close connection if needed
    };
  }, []);

  const handleCreateRoom = async (nickname: string) => {
    if (!clientRef.current || !isReady) return;
    try {
      const id = await clientRef.current.createChatRoom(nickname);
      setRoomId(id); // PDF says create returns ID (check return type in console if unsure)
      // Usually createChatRoom returns the ID directly or an object. 
      // If it returns object, adjust to `id.roomId`
      console.log("Room Created:", id); 
      setView('chat');
    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  const handleJoinRoom = async (nickname: string, roomIdInput: string) => {
    if (!clientRef.current || !isReady) return;
    try {
      // PDF says load previous messages on join
      const history = await clientRef.current.joinChatRoom(nickname, roomIdInput);
      console.log("Joined Room, History:", history);
      setRoomId(roomIdInput);
      
      // If history has messages, load them
      if (history && history.messages) {
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
    // PDF Requirement: { body: string }
    clientRef.current.sendMessage(SocketMessageTypes.SEND_MESSAGE, { body: text });
  };

  const handleTyping = (isTyping: boolean) => {
    if (!clientRef.current) return;
    // PDF Requirement: { typing: boolean }
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
          isSomeoneTyping={isSomeoneTyping}
        />
      )}
    </div>
  );
};

export default App;