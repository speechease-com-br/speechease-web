"use client";

import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { dashboardService } from "@/infrastructure/dashboard-infra";
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextProps {
  user: any;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const token = Cookies.get("speech-ease-auth");
  console.log('token: ', token);

  const { data } = useQuery({
    queryKey: ["me"],
    enabled: !!token,
    queryFn: () => dashboardService.me(token as string),
  });

  return (
    <UserContext.Provider value={{ user: data, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};