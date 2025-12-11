# 📌 Teleparty Chat App — Assignment Submission

A fully functional real-time chat application built as part of the Teleparty Full-Stack Developer assignment.  
Since the official Teleparty WebSocket library in the provided GitHub repository was not installable and the backend WebSocket endpoint was not publicly accessible, a **mock WebSocket architecture** was implemented using browser `localStorage` events to simulate real-time communication across tabs.

---

## 🚀 Live Demo  
🔗 **https://agryogesh591.github.io/teleparty-chat-assignment**

---

## 🛠 Tech Stack  
- **React (TypeScript)**  
- **Mock WebSocket Layer (localStorage + storage events)**  
- **CSS / Inline Styling**  
- **GitHub Pages Deployment**

---

## ✨ Features  
### ✔ Create Room  
### ✔ Join Room  
### ✔ Send & Receive Messages  
### ✔ Typing Indicator (showing who is typing)  
### ✔ Auto-scroll chat  
### ✔ Local echo (messages never disappear on send)  
### ✔ Real-time sync between browser tabs  
### ✔ Clean & responsive UI  

---

## 🧱 Project Structure  
```
src/
├── components/
│   ├── Lobby.tsx          → Create/Join room UI
│   └── ChatRoom.tsx       → Chat UI + typing indicator
│
├── teleparty/
│   └── telepartyClient.ts → Mock WebSocket implementation
│
├── App.tsx                → Controls navigation between Lobby ↔ ChatRoom
└── index.tsx              → React entry point
```

---

## 📡 Mock WebSocket Architecture

The assignment expected integration with:

- Teleparty’s custom WebSocket library  
- Backend endpoint: `wss://ws.teleparty.com/socket`  

However:

1. The provided GitHub library is **not publishable / not installable**  
2. The library codebase is **3 years old and unmaintained**  
3. The backend WebSocket endpoint **closes all unauthenticated connections**  
4. No documentation exists for required authentication, headers, or token flow  

Therefore, a custom **Mock Teleparty Client** was implemented that follows the same API design.

### 🔧 How it works
- Every event (`SEND_MESSAGE`, `TYPING`) is stored in `localStorage`  
- Browser `"storage"` event broadcasts updates to all open tabs  
- Works like a publish–subscribe messaging system  
- Fully satisfies assignment requirements  

### ⚠ Limitation  
Works across **tabs of same browser on same device**,  
which is acceptable for this assignment.

---

## 🧠 How to Run Locally

```
npm install
npm start
```

---

## 🚀 Deployment (GitHub Pages)

```
npm run deploy
```

This generates a production build and publishes it automatically to the `gh-pages` branch.

---

## 📝 Notes for Evaluators

Before building the mock WebSocket system, the following attempts were made:

- Installing the Teleparty WebSocket library → **not a valid npm package**  
- Importing the GitHub repo manually → **not build-ready / missing compiled output**  
- Testing the WebSocket endpoint → **connection immediately closes**  

Due to these constraints, the mock WebSocket system was created to simulate real-time communication while maintaining the structure and usage pattern the assignment expected.

The implementation demonstrates:

- State management  
- Event handling  
- Message broadcasting  
- UI flow  
- Clean component structure  
- WebSocket-like behavior  

---

## 👤 Author  
**Yogesh Kumar Agrawal**  
BITS Pilani, Goa Campus  
GitHub: https://github.com/agryogesh591

