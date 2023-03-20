import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { randomUUID } from "crypto";
import ListContainerBacker from "./ListContainerBacker";

type ID = string;

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

type ServerType =
  | ClientToServerEvents
  | ServerToClientEvents
  | InterServerEvents
  | SocketData;

/* -------------------- runtime --------------------*/

const PORT_NR = 8080;

const httpServer = createServer();

const io = new Server<ServerType>(httpServer, {
  cors: {
    //origin: "http://localhost:5173", // the address of the HTTP server serving the App
    origin: "*", // the address of the HTTP server serving the App
  },
});

io.on("connection", (socket) => {
  // @ts-ignore
  console.log("app/socket was connected ...");

  // use the catch-all to log any event during development
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  /* --------- register server container components ('backers') here ----------  */

  ListContainerBacker(socket);
});

console.log(`websocket server listening: ${PORT_NR} since ${new Date()}`);
httpServer.listen(PORT_NR);
