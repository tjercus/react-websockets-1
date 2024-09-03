/**
 * Is the entered value itself a nullable or does it have no content?
 */
export const hasNoValue = (value: unknown | null) =>
  typeof value === "undefined" ||
  value === null ||
  value === "" ||
  (value.constructor === Object && Object.keys(value).length === 0) ||
  (Array.isArray(value) && value.length === 0);

/**
 * The inverse of 'hasNoValue'
 */
export const hasValue = (value: unknown | null): boolean => !hasNoValue(value);

/* --------- tokens --------- */

// :: (string) -> void
export const storeToken = (token: string) =>
  sessionStorage.setItem("jwt", token);

// :: () -> string
export const getLocallyStoredToken = () => sessionStorage.getItem("jwt") ?? "";

// :: () -> boolean
export const hasToken = () => hasValue(sessionStorage.getItem("jwt"));
