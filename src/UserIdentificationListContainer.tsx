import React, { useEffect, useState } from "react";
//
import { IdentifiableAndValuable } from "./types";
import UserIdentificationListView from "./UserIdentificationListView";
import { storeToken } from "./utils";

const HTTP_URL = "http://localhost:8080";

/**
 * Allows the user to identify themselves.
 * In a production environment you would display a login form.
 */
const UserIdentificationListContainer = () => {
  const [listItems, setListItems] = useState(
    [] as Array<IdentifiableAndValuable<string>>
  );

  useEffect(() => {
    fetch(`${HTTP_URL}/users`).then((response) => {
      response.json().then((data) => {
        setListItems(data);
      });
    });
  }, []);

  return (
    <div id="user-identification-list-container" className="card">
      <h2>{"Identify yourself"}</h2>
      <UserIdentificationListView
        eventHandlers={{
          handleItemClick: (event) => {
            const target = event.target as HTMLButtonElement;
            const userId = target.getAttribute("id");
            fetch(`${HTTP_URL}/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId }),
            }).then((response) => {
              response.json().then((data) => {
                // get back a JWT, set it in session storage
                data.token ? storeToken(data.token) : console.error(data);
                // refresh the app after identification
                window.location.href = "/";
              });
            });
          },
        }}
        listItems={listItems}
      ></UserIdentificationListView>
    </div>
  );
};

export default UserIdentificationListContainer;
