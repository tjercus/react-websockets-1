import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

interface Props {
  socket: Socket;
}

interface Identifiable {
  id: string;
}

interface Valuable<T> {
  value: T;
}

const ListContainer = ({ socket }: Props) => {
  const [listItems, setListItems] = useState(
    [] as Array<Identifiable & Valuable<string>>
  );

  useEffect(() => {
    const onListContainerChange = (
      items: Array<Identifiable & Valuable<string>>
    ) => {
      setListItems(items);
    };

    socket.on("SRVR:ListContainer:CHANGE_EVT", onListContainerChange);

    return () => {
      socket.off("SRVR:ListContainer:CHANGE_EVT", onListContainerChange);
    };
  }, []);
  return (
    <div id="list-container">
      <ul>
        {listItems.map((item) => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
      <button
        onClick={() => socket.emit("APP:ListContainer:ADD_CMD", uuidv4())}
      >
        add an item
      </button>
    </div>
  );
};

export default ListContainer;
