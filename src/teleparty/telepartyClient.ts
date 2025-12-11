// telepartyClient.ts

type Listener = (msg: any) => void;
let listeners: Listener[] = [];

let currentRoomId: string | null = null;
let currentUser: string | null = null;

// ---------------- BROADCAST ----------------
const broadcast = (msg: any) => {
  localStorage.setItem(
    "tp-event",
    JSON.stringify({ msg, ts: Date.now() }) // ensures event always fires
  );
};

// ---------------- RECEIVE -------------------
window.addEventListener("storage", (e) => {
  if (e.key === "tp-event" && e.newValue) {
    const { msg } = JSON.parse(e.newValue);

    // Ignore events from other rooms
    if (msg.data?.roomId && msg.data.roomId !== currentRoomId) return;

    listeners.forEach((fn) => fn(msg));
  }
});

// ---------------- READY ---------------------
export const onReady = (cb: () => void) => {
  console.log("Mock WebSocket ready");
  cb();
};

// ---------------- CREATE ROOM -----------------
export const createRoom = async (nickname: string) => {
  const id = "room-" + Math.floor(Math.random() * 50000);
  currentRoomId = id;
  currentUser = nickname;

  return { id };
};

// ---------------- JOIN ROOM -------------------
export const joinRoom = async (roomId: string, nickname: string) => {
  currentRoomId = roomId;
  currentUser = nickname;
};

// ---------------- SEND MESSAGE ----------------
// NOW WITH UNIQUE ID TO PREVENT DUPLICATES
export const sendMessage = (user: string, body: string) => {
  const id = Date.now() + "-" + Math.random(); // unique ID

  const localMsg = {
    type: "SEND_MESSAGE",
    data: { user, body, roomId: currentRoomId, self: true, id },
  };

  const remoteMsg = {
    type: "SEND_MESSAGE",
    data: { user, body, roomId: currentRoomId, self: false, id },
  };

  // Local echo
  listeners.forEach((fn) => fn(localMsg));

  // Send to others
  broadcast(remoteMsg);
};

// ---------------- TYPING INDICATOR ------------
export const sendTyping = (user: string, typing: boolean) => {
  broadcast({
    type: "TYPING",
    data: { user, typing, roomId: currentRoomId },
  });
};

// ---------------- REGISTER LISTENER -----------
export const onMessage = (cb: Listener) => {
  listeners.push(cb);
};
