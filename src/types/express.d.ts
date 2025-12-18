import { IUser } from "./Users.Types";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export {};
