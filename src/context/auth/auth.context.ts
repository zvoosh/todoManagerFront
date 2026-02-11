import { createContext } from "react";
import type { TUserReturned } from "./auth.provider";

export interface AuthContextType {
  user: TUserReturned | null;
  setUserCtx: (user: TUserReturned | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
