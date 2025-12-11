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
  
  // Wapas simple boolean kar diya
  const [isSomeoneTyping, setIsSomeoneTyping] = useState(false);
  
  const clientRef = useRef<any>(null);

  useEffect(() => {
    const eventHandler: SocketEventHandler = {
      onConnectionReady: () => {
        console.log("Socket Connection Ready!");
        setIsReady(true);
      },
      onClose: () => {
        console.log("Socket Closed.");
        setIsReady(false);
        alert("Connection lost. Please reload.");
      },
      onMessage: (message: any) => {
        // Handle Messages
        if (message.type === SocketMessageTypes.SEND_MESSAGE) {
          setMessages((prev) => [...prev, message.data]);
        }
        
        // Handle Typing (Simple Logic)
        if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
          const data = message.data as ITypingMessage;
          setIsSomeoneTyping(data.anyoneTyping);
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
      setView('chat');
    } catch (err) { console.error(err); }
  };

  const handleJoinRoom = async (nickname: string, roomIdInput: string) => {
    if (!clientRef.current || !isReady) return;
    try {
      const history = await clientRef.current.joinChatRoom(nickname, roomIdInput);
      setRoomId(roomIdInput);
      if (history && history.messages) {
        setMessages(history.messages);
      }
      setView('chat');
    } catch (err) { alert("Error joining room"); }
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
      {!isReady && <div className="loading-bar">Connecting...</div>}
      
      {view === 'lobby' && (
        <Lobby isReady={isReady} onCreate={handleCreateRoom} onJoin={handleJoinRoom} />
      )}

      {view === 'chat' && (
        <ChatRoom 
          messages={messages} 
          roomId={roomId}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          isSomeoneTyping={isSomeoneTyping} // Simple boolean pass kar rahe hain
        />
      )}
    </div>
  );
};

export default App;