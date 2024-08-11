// @ts-ignore
import React from "react";
//
import { IdentifiableAndValuable } from "./types";

interface Props {
  listItems: Array<IdentifiableAndValuable<string>>;
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
