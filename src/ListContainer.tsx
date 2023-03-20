import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import ListView from "./ListView";
//
import { IdentifyAndValuable } from "./types";

// used to identify the container component between App and Server
const CONTAINER_ID = "ListContainer";

interface Props {
  socket: Socket;
}

const ListContainer = ({ socket }: Props) => {
  const [listItems, setListItems] = useState(
    [] as Array<IdentifyAndValuable<string>>
  );

  useEffect(() => {
    const onListContainerChange = (
      items: Array<IdentifyAndValuable<string>>
    ) => {
      setListItems(items);
    };

    socket.on(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, onListContainerChange);

    return () => {
      socket.off(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, onListContainerChange);
    };
  }, []);

  return (
    <div id="list-container">
      <ListView listItems={listItems}></ListView>
      <button
        onClick={() => socket.emit(`APP:${CONTAINER_ID}:ADD_CMD`, uuidv4())}
      >
        {"add an item via the backer"}
      </button>
    </div>
  );
};

export default ListContainer;
