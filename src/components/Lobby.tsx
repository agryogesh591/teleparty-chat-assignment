import React, { useState } from 'react';

interface LobbyProps {
  isReady: boolean;
  onCreate: (nickname: string) => void;
  onJoin: (nickname: string, roomId: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ isReady, onCreate, onJoin }) => {
  const [nickname, setNickname] = useState('');
  const [joinId, setJoinId] = useState('');

  return (
    <div className="lobby-container" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Teleparty Chat Challenge</h1>
      
      <div style={{ margin: '20px 0' }}>
        <input 
          type="text" 
          placeholder="Enter your nickname" 
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ padding: '10px', width: '250px' }}
        />
      </div>

      <div className="actions" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        {/* Create Room Section */}
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h3>Create a New Room</h3>
          <button 
            disabled={!isReady || !nickname} 
            onClick={() => onCreate(nickname)}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Create Room
          </button>
        </div>

        {/* Join Room Section */}
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h3>Join Existing Room</h3>
          <input 
            type="text" 
            placeholder="Room ID" 
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            style={{ display: 'block', margin: '10px auto', padding: '5px' }}
          />
          <button 
            disabled={!isReady || !nickname || !joinId} 
            onClick={() => onJoin(nickname, joinId)}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Join Room
          </button>
        </div>
      </div>
      
      {!isReady && <p style={{color: 'red'}}>Waiting for connection...</p>}
    </div>
  );
};

export default Lobby;