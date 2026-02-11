import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userId: string;
  username: string;
  setUser: (userId: string, username: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: "",
      username: "",
      setUser: (userId, username) => set({ userId, username }),
    }),
    {
      name: "user-storage",
    },
  ),
);
