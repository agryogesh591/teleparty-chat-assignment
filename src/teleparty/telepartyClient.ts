import { TelepartyClient, SocketEventHandler, SocketMessageTypes } from 'teleparty-websocket-lib';

// Interfaces based on the PDF Documentation
export interface IMessage {
  isSystemMessage: boolean;
  userIcon?: string;
  userNickname?: string;
  body: string;
  permId?: string;
  timestamp?: number;
}

export interface ITypingMessage {
  anyoneTyping: boolean;
  usersTyping: string[]; // array of permIds
}

// Global instance variable (so we don't recreate it)
let clientInstance: TelepartyClient | null = null;

export const getClient = (eventHandler: SocketEventHandler): TelepartyClient => {
  if (!clientInstance) {
    clientInstance = new TelepartyClient(eventHandler);
  }
  return clientInstance;
};

// Helper to destroy client if needed (optional)
export const destroyClient = () => {
  if (clientInstance) {
    // clientInstance.teardown(); // If library has a teardown method
    clientInstance = null;
  }
};

export { SocketMessageTypes };