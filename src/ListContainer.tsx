import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
//
import ListView from "./ListView";
import { IdentifiableAndValuable } from "./types";

// used to identify the container component between App and Server
const CONTAINER_ID = "ListContainer";

const DEFAULT_INTERVAL_SECONDS = 15;

interface Props {
  socket: Socket;
}

const ListContainer = ({ socket }: Props) => {
  const [serverPushIntervalSeconds, setServerPushIntervalSeconds] = useState(
    DEFAULT_INTERVAL_SECONDS
  );

  const [listItems, setListItems] = useState(
    [] as Array<IdentifiableAndValuable<string>>
  );

  useEffect(() => {
    const onListContainerChange = (
      items: Array<IdentifiableAndValuable<string>>
    ) => {
      console.log("server updated list items", items);
      setListItems(items);
    };

    socket.on(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, onListContainerChange);

    socket.on(
      `SRVR:${CONTAINER_ID}:UPDATED_INTERVAL_EVT`,
      setServerPushIntervalSeconds
    );

    return () => {
      socket.off(`SRVR:${CONTAINER_ID}:CHANGE_EVT`, onListContainerChange);
    };
  }, []); // run only once

  return (
    <div id="list-container" className="card">
      <section>
        <label htmlFor={"serverPushIntervalSeconds"}>
          {"Server push repeat interval in seconds (type to start/change) "}
        </label>
        <input
          className={"numeric-input"}
          name={"serverPushIntervalSeconds"}
          onChange={(evt) => {
            const newInterval = parseInt(evt.target.value, 10);
            setServerPushIntervalSeconds(newInterval);
            socket.emit(`APP:${CONTAINER_ID}:UPDATE_INTERVAL_CMD`, newInterval);
          }}
          placeholder={"0"}
          type={"number"}
          value={serverPushIntervalSeconds}
        />
      </section>

      <section>
        <button
          onClick={() => socket.emit(`APP:${CONTAINER_ID}:ADD_CMD`, uuidv4())}
        >
          {"add an item via the backer"}
        </button>
        <button onClick={() => socket.emit(`APP:${CONTAINER_ID}:CLEAR_CMD`)}>
          {"clear the list via the backer"}
        </button>
      </section>

      <ListView listItems={listItems}></ListView>
    </div>
  );
};

export default ListContainer;
