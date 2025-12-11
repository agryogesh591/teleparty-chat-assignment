
# Teleparty Chat

This is a simple real-time chat application built with React and TypeScript. It uses a WebSocket connection to a Teleparty server to enable real-time communication between users in a chat room.

## 🔗 Live Demo
👉 **[Click here to view the Live App](https://agryogesh591.github.io/teleparty-chat-assignment/)**

## Features

*   Create a new chat room
*   Join an existing chat room with a Room ID
*   Send and receive messages in real-time
*   See when other users are typing

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine. You can download them from here: [https://nodejs.org/](https://nodejs.org/)

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/agryogesh591/teleparty-chat-assignment.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Deployment

This app is deployed using GitHub Pages. The `deploy` script in `package.json` handles the deployment process.

### `npm run deploy`

This command will create a `gh-pages` branch and deploy the contents of the `build` folder to it.

## Built With

*   [React](https://reactjs.org/) - The web framework used
*   [TypeScript](https://www.typescriptlang.org/) - Superset of JavaScript
*   [Teleparty WebSocket Lib](https://github.com/watchparty-org/teleparty-websocket-lib) - For WebSocket communication

