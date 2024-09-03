import { User } from "./types";

export const byNotIdentified = (user: User) => !user.identified;
