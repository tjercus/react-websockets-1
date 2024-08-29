/* --------- tokens --------- */

export const storeToken = (token: string) =>
  sessionStorage.setItem("jwt", token);

export const getToken = () => sessionStorage.getItem("jwt");

export const hasToken = () => sessionStorage.getItem("jwt") !== null;
