import { createServer } from "http";
import { Server } from "socket.io";
import { randomUUID } from "crypto";

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

const arr = [
  { id: "one-id", value: "one" },
  { id: "two-id", value: "two" },
];

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
  console.log("app was connected ...");
  // @ts-ignore
  //socket.on("APP:evt", (msg) => console.log("message from app:", msg));

  // use the catch-all log any event during development
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  /*
  const users = [];
  // Array.from(io.of("/").sockets).map(socket => {//etc.})
  for (let [id, socket] of io.of("/").sockets) {
    // @ts-ignore
    //console.log("socket", socket.handshake.auth.username);
    users.push({
      userID: id,
      // username was created by the client app and attached to the sockets' 'auth' property on connecting to the server
      username: socket?.handshake?.auth?.username ?? "unknown",
    });
  }
   */

  // NOTE That sending with 'socket' (=== client) then only that client will get the update
  // @ts-ignore
  socket.on("APP:ListContainer:ADD_CMD", (data: string) => {
    const newItem = { id: randomUUID(), value: data };
    // NOTE that 'socket.broadcast.emit' will send to all other connected sockets (so not itself)
    // @ts-ignore
    socket.emit("SRVR:ListContainer:CHANGE_EVT", [...arr, newItem]);
    arr.push(newItem);
  });

  // @ts-ignore
  socket.emit("SRVR:ListContainer:CHANGE_EVT", arr);
});

console.log(`websocket server listening: ${PORT_NR} since ${new Date()}`);
httpServer.listen(PORT_NR);
