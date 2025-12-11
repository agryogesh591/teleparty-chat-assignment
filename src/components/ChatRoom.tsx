import React, { useState, useEffect, useRef } from 'react';
import { IMessage } from '../teleparty/telepartyClient';

interface ChatRoomProps {
  messages: IMessage[];
  roomId: string;
  onSendMessage: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
  isSomeoneTyping: boolean;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ messages, roomId, onSendMessage, onTyping, isSomeoneTyping }) => {
  const [input, setInput] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom logic
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
      // Stop typing status immediately after sending
      onTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    // Logic to handle "User is typing..."
    onTyping(true);
    
    // Clear old timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set new timeout to stop typing after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1500);
  };

  return (
    <div className="chat-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '10px' }}>
      <div className="chat-header" style={{ borderBottom: '1px solid #ddd', marginBottom: '10px' }}>
        <h2>Room ID: <span style={{ fontSize: '0.8em', color: '#555' }}>{roomId}</span></h2>
      </div>

      <div className="messages-list" style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #eee', 
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ 
            marginBottom: '10px', 
            textAlign: msg.isSystemMessage ? 'center' : 'left',
            color: msg.isSystemMessage ? '#888' : '#000'
          }}>
            {msg.isSystemMessage ? (
              <small><em>{msg.body}</em></small>
            ) : (
              <div style={{ background: '#fff', padding: '8px', borderRadius: '8px', display: 'inline-block', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                <strong>{msg.userNickname}: </strong>
                <span>{msg.body}</span>
              </div>
            )}
          </div>
        ))}
        {isSomeoneTyping && <div style={{fontStyle: 'italic', color: '#aaa', fontSize: '0.8rem'}}>Someone is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area" style={{ marginTop: '15px', display: 'flex' }}>
        <input 
          type="text" 
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleSend}
          style={{ marginLeft: '10px', padding: '10px 20px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;