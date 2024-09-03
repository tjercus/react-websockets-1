import { IdentifiableAndValuable, ServerCommand, Token } from "./types";

export const HTTP_URL = "http://localhost:8080";

const sendQuery = async (
  subject: string
): Promise<Array<IdentifiableAndValuable<string>>> =>
  (await fetch(`${HTTP_URL}/query/${subject}`)).json();

const sendCommand = async <T>(command: ServerCommand): Promise<T> =>
  (
    await fetch(`${HTTP_URL}/command`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    })
  ).json();

/* ------------------------ public abstractions ------------------------*/

export const fetchUsers = (): Promise<Array<IdentifiableAndValuable<string>>> =>
  sendQuery("users");

/**
 * Same as identify but then with return.
 */
export const identifyWithResponse = (userId: string): Promise<Token> =>
  sendCommand({ type: "IDENTIFY_CMD", payload: userId });

/**
 * In case of a re-connect the client can let the server know that he is still identified.
 * is in its core a silent 'identifyWithResponse' call.
 */
export const identify = (userId: string): void => {
  sendCommand({ type: "IDENTIFY_CMD", payload: userId }).then(console.log);
};

/**
 * In case of a disconnect the client can let the server know that he is not identified.
 */
export const deIdentify = (userId: string): void => {
  sendCommand({ type: "DE-IDENTIFY_CMD", payload: userId }).then(console.log);
};
