import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./auth.context";

export type TUserReturned = {
  id: string;
  username: string;
  email: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUserReturned | null>(null);

  const setUserCtx = (user: TUserReturned | null) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, setUserCtx }}>
      {children}
    </AuthContext.Provider>
  );
};
