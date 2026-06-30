import { createContext } from "react";

type AppContextType = {
  showChatRoom: boolean;
  setShowChatRoom: React.Dispatch<React.SetStateAction<boolean>>;
  roomCode: string;
  setRoomCode: React.Dispatch<React.SetStateAction<string>>
};

export const AppContext = createContext<AppContextType | null>(null)