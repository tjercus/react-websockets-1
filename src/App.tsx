import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import ButtonContainer from "./ButtonContainer";
//
import { ConnectionManagerContainer } from "./ConnectionManagerContainer";
import ListContainer from "./ListContainer";

export function ConnectionState({ isConnected }: { isConnected: boolean }) {
  return <p>{`Connected? ${isConnected}`}</p>;
}

// "undefined" means the URL will be computed from the `window.location` object
const URL = "ws://localhost:8080";

const socket = io(URL as string, { autoConnect: false });
socket.auth = { username: uuidv4() };
socket.connect();

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    // logging server events for debug and test
    socket.onAny((msg, ...args) => console.log(msg, ...args));

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className="App">
      <ConnectionManagerContainer isConnected={isConnected} socket={socket} />
      <h1>{"Connected Components using Websockets"}</h1>
      <i>{"Turn off AdBlockers and Cookie blockers if connection fails."}</i>

      <div>
        <h2>{"ButtonContainer"}</h2>
        <ButtonContainer socket={socket} />
        <h2>{"ListContainer"}</h2>
        <ListContainer socket={socket} />
      </div>
    </div>
  );
}

export default App;
