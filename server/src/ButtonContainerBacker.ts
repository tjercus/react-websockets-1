import { randomUUID } from "crypto";
import { Socket } from "socket.io";

// in memory datastore for now
let buttonState = false;

const CONTAINER_ID = "ButtonContainer";

/**
 * Backs a React Client Container on the Server. It handles both listening for and sending events
 * @param {ServerType} socket is like a 'client' or a connection to one browser(tab)
 * Events are named in three parts <APP|SRVR>:<containerId>:<event-name>
 */
const ButtonContainerBacker = (socket: Socket) => {
  // @ts-ignore
  socket.on(`APP:${CONTAINER_ID}:SET_CMD`, (newButtonState: boolean) => {
    // NOTE that 'socket.broadcast.emit' will send to all other connected sockets (so not itself)
    // @ts-ignore
    socket.emit(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, newButtonState);
    buttonState = newButtonState;
  });

  // emit a server update to the client Container every x seconds
  setInterval(() => {
    const newState = Math.random() < 0.5;
    // @ts-ignore
    socket.emit(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, newState); // random boolean
    buttonState = newState;
  }, 4 * 1000);

  // @ts-ignore
  socket.emit(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, buttonState);
};

export default ButtonContainerBacker;
