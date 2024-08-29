// @ts-ignore
import React from "react";
//
import { IdentifiableAndValuable } from "./types";

interface Props {
  eventHandlers: {
    handleItemClick: (event: React.MouseEvent | React.KeyboardEvent) => void;
  };
  listItems: Array<IdentifiableAndValuable<string>>;
}

const UserIdentificationListView = ({
  eventHandlers,
  listItems = [],
}: Props) => {
  console.log("UserIdentificationListView", listItems);
  return (
    <div>
      <h2>
        {listItems?.length} {"items"}
      </h2>
      <ul>
        {listItems?.map((item) => (
          <li key={item.id}>
            {item.value}
            <button id={item.id} onClick={eventHandlers.handleItemClick}>
              {"this is me"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserIdentificationListView;
