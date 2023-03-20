// @ts-ignore
import React from "react";
//
import { IdentifyAndValuable } from "./types";

interface Props {
  listItems: Array<IdentifyAndValuable<string>>;
}

const ListView = ({ listItems = [] }: Props) => {
  return (
    <div>
      <h2>
        {listItems.length} {"items"}
      </h2>
      <ul>
        {listItems.map((item) => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListView;
