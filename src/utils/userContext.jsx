"use client";
import { createContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const pathname = usePathname();

  const checkExpiration = async () => {
    fetch(`/api/session`)
      .then((response) => response.json())
      .then((data) => {
        if (!data) setCurrentUser(null);
        else
          fetch(`/api/users?id_user=${data?.id_user}`)
            .then((response) => response.json())
            .then((data) => {
              setCurrentUser(data?.users[0]);
            });
      });
  };

  useEffect(() => {
    checkExpiration();
  }, [pathname]);

  return (
    <UserContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </UserContext.Provider>
  );
}