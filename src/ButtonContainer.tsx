// @ts-ignore
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import ListView from "./ListView";
import { IdentifyAndValuable } from "./types";

const CONTAINER_ID = "ButtonContainer";

interface Props {
  socket: Socket;
}

const ButtonContainer = ({ socket }: Props) => {
  const [buttonState, setButtonState] = useState(false);

  useEffect(() => {
    const onListContainerChange = (newButtonState: boolean) => {
      if (buttonState !== newButtonState) {
        setButtonState(newButtonState);
      }
    };

    socket.on(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, onListContainerChange);

    return () => {
      socket.off(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, onListContainerChange);
    };
  }, []);

  return (
    <div id="button-container" className="card">
      <p>{"a connected button:"}</p>
      <button
        onClick={() => {
          const newState = !buttonState;
          setButtonState(newState);
          return socket.emit(`APP:${CONTAINER_ID}:SET_CMD`, newState);
        }}
      >
        {buttonState ? "true" : "false"}
      </button>
    </div>
  );
};

export default ButtonContainer;
