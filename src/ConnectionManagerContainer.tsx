import React from "react";
import { Socket } from "socket.io-client";
//
import { ConnectionState } from "./App";
import { getLocallyStoredToken } from "./utils";

interface Props {
  isConnected: boolean;
  socket: Socket;
}

export const ConnectionManagerContainer = ({ isConnected, socket }: Props) => {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <aside id={"connection-manager"}>
      <ConnectionState isConnected={isConnected} />
      <p>
        {"You are identified as "}
        <strong>{getLocallyStoredToken()}</strong>
      </p>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </aside>
  );
};
