import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";

import ButtonContainerBacker from "./ButtonContainerBacker";
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

// in-memory datastore as a Map
let users = new Map(
  [
    { id: "user-one-id", identified: false, value: "user one" },
    { id: "user-two-id", identified: false, value: "user two" },
    { id: "user-three-id", identified: false, value: "user three" },
  ].map((user) => [user.id, user])
);

/* -------------------- runtime --------------------*/

const PORT_NR = 8080;

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

const httpServer = createServer(app);

app.get("/hello", (req: Request, res: Response) => {
  console.log("/hello was hit");
  res.json({ message: "welcome human!" });
});
app.get("/users", (req: Request, res: Response) => {
  const unidentifiedUsers = Array.from(users.values()).filter(
    (user) => !user.identified
  );
  console.log("unidentified users", unidentifiedUsers);
  res.json(unidentifiedUsers);
});

app.post("/login", (req: Request, res: Response) => {
  const userId = req.body?.userId;
  const userFromDb = users.get(userId);
  if (userFromDb === undefined) {
    res.status(401).json({ message: "User not found" });
  } else {
    // mark user as identified in local db
    const updatedUser = {
      id: userFromDb.id,
      identified: true,
      value: userFromDb.value,
    };
    users.set(userId, updatedUser);
    // for now just use the userId as token
    res.json({ token: userId });
  }
});

const io = new Server<ServerType>(httpServer, {
  cors: {
    //origin: "http://localhost:5173", // the address of the HTTP server serving the App
    origin: "*", // the address of the HTTP server serving the App
  },
});

// Middleware to check JWT in Socket.IO connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log("token from websocket handshake", token);
  // Verify token here
  if (token) {
    return next();
  }
  return next(new Error("Authentication error"));
});

io.on("connection", (socket) => {
  // @ts-ignore
  console.log("app/socket was connected ...");

  // use the catch-all to log any event during development
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  /* --------- register server container components ('backers') here ----------  */

  ButtonContainerBacker(io, socket);
  ListContainerBacker(io, socket);
});

console.log(
  `http and websocket server listening: ${PORT_NR} since ${new Date()}`
);
httpServer.listen(PORT_NR);
