import { randomUUID } from "crypto";
import * as console from "node:console";
import { Server, Socket } from "socket.io";

const ONE_SECOND = 1000;

let repeaterPointer: NodeJS.Timeout; // there is no sane default for Timer

// in memory datastore for now
let arr = [
  { id: "one-id", value: "one" },
  { id: "two-id", value: "two" },
];

const CONTAINER_ID = "ListContainer";

/**
 * Backs a React Client Container on the Server. It handles both listening for and sending events
 * @param {Server} io - socket io server instance (used for broadcasting to all clients)
 * @param socket
 * Events are named in three parts <APP|SRVR>:<containerId>:<event-name>
 */
const ListContainerBacker = (io: Server, socket: Socket) => {
  // NOTE That sending with 'socket' (=== client) then only that client will get the update
  // @ts-ignore
  socket.on(`APP:${CONTAINER_ID}:ADD_CMD`, (data: string) => {
    const newItem = { id: randomUUID(), value: data };
    // NOTE that 'socket.broadcast.emit' will send to all other connected sockets (so not itself)
    // @ts-ignore
    io.emit(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, [...arr, newItem]); // poor man's db update
    arr.push(newItem);
  });

  socket.on(`APP:${CONTAINER_ID}:CLEAR_CMD`, () => {
    // @ts-ignore
    io.emit(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, []); // poor man's db update
    arr = [];
  });

  socket.on(`APP:${CONTAINER_ID}:UPDATE_INTERVAL_CMD`, (nr: number) => {
    console.log("updating global list push interval to", nr);
    // notify all clients of the new interval
    io.emit(`SRVR:${CONTAINER_ID}:UPDATED_INTERVAL_EVT`, nr); // poor man's db update
    // destroy previous timed repeater
    clearInterval(repeaterPointer);
    // emit a server update to the client Container every x seconds
    repeaterPointer = setInterval(() => {
      const newItem = { id: randomUUID(), value: randomUUID() };
      // @ts-ignore
      io.emit(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, [...arr, newItem]); // poor man's db update
      arr.push(newItem);
    }, nr * ONE_SECOND);
  });

  // @ts-ignore
  socket.emit(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, arr);
};

export default ListContainerBacker;
