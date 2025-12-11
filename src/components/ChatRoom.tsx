import React, { useState, useEffect, useRef } from 'react';
import { IMessage } from '../teleparty/telepartyClient';

interface ChatRoomProps {
  messages: IMessage[];
  roomId: string;
  onSendMessage: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
  typingUser: string | null; // Corrected Type
}

const ChatRoom: React.FC<ChatRoomProps> = ({ 
  messages, 
  roomId, 
  onSendMessage, 
  onTyping, 
  typingUser 
}) => {

  const [input, setInput] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]); // Scroll even when typing status appears

  const handleSend = () => {
    if (!input.trim()) return;

    onSendMessage(input);
    setInput('');
    onTyping(false);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    // Typing start
    onTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Stop typing after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1500);
  };

  return (
    <div className="chat-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '10px' }}>
      <div style={{ borderBottom: '1px solid #ddd', marginBottom: '10px', paddingBottom: '10px' }}>
        <h2>Room ID: <span style={{ color: '#e50914' }}>{roomId}</span></h2>
      </div>

      <div className="messages-list" style={{
        height: '400px',
        overflowY: 'auto',
        border: '1px solid #eee',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            marginBottom: '10px',
            alignSelf: msg.isSystemMessage ? 'center' : 'flex-start',
            maxWidth: '80%'
          }}>
            {msg.isSystemMessage ? (
              <small style={{ color: '#888' }}><em>{msg.body}</em></small>
            ) : (
              <div style={{ 
                background: '#fff',
                padding: '8px 12px',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)' 
              }}>
                <strong style={{ color: '#333', display: 'block', fontSize: '0.8rem' }}>{msg.userNickname}</strong>
                <span style={{ fontSize: '1rem' }}>{msg.body}</span>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {typingUser && (
          <div style={{ 
            fontStyle: 'italic', 
            color: '#888', 
            fontSize: '0.85rem', 
            marginTop: '5px',
            paddingLeft: '5px' 
          }}>
             User <strong style={{color: '#000'}}>{typingUser}</strong> is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-area" style={{ marginTop: '15px', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
        />

        <button
          onClick={handleSend}
          style={{
            marginLeft: '10px',
            padding: '10px 25px',
            background: '#e50914',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;