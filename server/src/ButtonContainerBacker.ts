import { Server, Socket } from "socket.io";

const TEN = 10;
const ONE_SECOND = 1000;
const EMIT_INTERVAL_MS = TEN * ONE_SECOND;

// in memory datastore for now
let buttonState = false;

const CONTAINER_ID = "ButtonContainer";

/**
 * Backs a React Client Container on the Server. It handles both listening for and sending events
 * @param {Server} io - socket.io server instance (used for broadcasting to all clients)
 * @param {Socket} socket - specific connection to the client
 * Events are named in three parts <APP|SRVR>:<containerId>:<event-name>
 */
const ButtonContainerBacker = (io: Server, socket: Socket) => {
  // @ts-ignore
  socket.on(`APP:${CONTAINER_ID}:SET_CMD`, (newButtonState: boolean) => {
    // NOTE that 'io.emit' will send to all connected sockets
    // @ts-ignore
    io.emit(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, newButtonState);
    buttonState = newButtonState;
  });

  // emit a server update to the client Container every x seconds
  setInterval(() => {
    const newState = Math.random() < 0.5; // random boolean
    // @ts-ignore
    io.emit(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, newState);
    buttonState = newState;
  }, EMIT_INTERVAL_MS);

  // @ts-ignore
  io.emit(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, buttonState);
};

export default ButtonContainerBacker;
