import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as console from "node:console";
import { createServer } from "node:http";
import { Server } from "socket.io";
//
import ButtonContainerBacker from "./ButtonContainerBacker";
import ListContainerBacker from "./ListContainerBacker";
import { ID, ServerType, User } from "./types";
import { byNotIdentified } from "./utils";

// in-memory datastore as a Map
let users = new Map<ID, User>(
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

app.get("/query/:subject", (req: Request, res: Response) => {
  const subject = req.params.subject ?? "unknown";
  switch (subject) {
    case "users":
      res.json(Array.from(users.values()).filter(byNotIdentified));
      break;
    default:
      res.status(404).json({ message: "subject not found" });
      break;
  }
});

app.post("/command", (req: Request, res: Response) => {
  const cmdType = req.body?.type;
  const userId = req.body?.payload;
  const userFromDb = users.get(userId);

  console.log("command received", cmdType, userId, userFromDb);

  switch (cmdType) {
    case "IDENTIFY_CMD":
      if (userFromDb === undefined) {
        res.status(401).json({ message: "User not found" });
      } else {
        // mark user as identified in local db
        const updatedUser: User = {
          id: userFromDb.id,
          identified: true,
          value: userFromDb.value,
        };
        users.set(userId, updatedUser);
        // for now just use the userId as token
        res.json({ token: userId });
      }
      break;
    case "DE-IDENTIFY_CMD":
      if (userFromDb === undefined) {
        res.status(401).json({ message: "User not found" });
      } else {
        // mark user as de-identified in local db
        const updatedUser = {
          id: userFromDb.id,
          identified: false,
          value: userFromDb.value,
        };
        users.set(userId, updatedUser);
        // let the user know that he is de-identified
        res.status(200);
      }
      break;
    default:
      res.status(404).json({ message: "command not found" });
      break;
  }
});

/* -------------------- websocket --------------------*/

const io = new Server<ServerType>(httpServer, {
  cors: {
    //origin: "http://localhost:5173", // the address of the HTTP server serving the App
    origin: "*", // the address of the HTTP server serving the App
  },
});

// Middleware to check JWT in Socket.IO connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log(`token from websocket handshake [${token}]`);
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
