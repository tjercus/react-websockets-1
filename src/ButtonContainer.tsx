// @ts-ignore
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const CONTAINER_ID = "ButtonContainer";

interface Props {
  socket: Socket;
}

const ButtonContainer = ({ socket }: Props) => {
  const [buttonState, setButtonState] = useState(false);

  useEffect(() => {
    const onListContainerChange = (newButtonState: boolean) => {
      setButtonState(newButtonState);
    };

    socket.on(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, onListContainerChange);

    return () => {
      socket.off(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, onListContainerChange);
    };
  }, []);

  return (
    <div id="button-container" className="card">
      <p>
        {
          "This connected button will be randomly updated from the Server Container Component:"
        }
      </p>
      <button
        onClick={() => {
          const newState = !buttonState;
          setButtonState(newState);
          return socket.emit(`APP:${CONTAINER_ID}:SET_CMD`, newState);
        }}
      >
        {"" + buttonState}
      </button>
    </div>
  );
};

export default ButtonContainer;
