import React, { useEffect, useState } from "react";
//
import { fetchUsers, identifyWithResponse } from "./httpApi";
import { IdentifiableAndValuable } from "./types";
import UserIdentificationListView from "./UserIdentificationListView";
import { storeToken } from "./utils";

const POLLING_INTERVAL_MS = 5 * 1000;

/**
 * Allows the user to identify themselves.
 * In a production environment you would display a identify form.
 */
const UserIdentificationListContainer = () => {
  const [listItems, setListItems] = useState(
    [] as Array<IdentifiableAndValuable<string>>
  );

  useEffect(() => {
    fetchUsers().then(setListItems);
    // do a simple polling to keep the list up to date across all clients
    setInterval(() => {
      fetchUsers().then(setListItems);
    }, POLLING_INTERVAL_MS);
  }, []);

  return (
    <div id="user-identification-list-container" className="card">
      <p>
        {
          "In a perfect, utopian world, nobody needs to authenticate themselves."
        }
      </p>
      <h2>{"Please identify yourself"}</h2>
      <UserIdentificationListView
        eventHandlers={{
          handleItemClick: (event) => {
            const target = event.target as HTMLButtonElement;
            const userId = target.getAttribute("id") ?? "";
            identifyWithResponse(userId).then((tokenObj) => {
              // get back a JWT, set it in session storage
              tokenObj.token
                ? storeToken(tokenObj.token)
                : console.error(tokenObj);
              // refresh the app after identification
              window.location.href = "/";
            });
          },
        }}
        listItems={listItems}
      ></UserIdentificationListView>
    </div>
  );
};

export default UserIdentificationListContainer;
