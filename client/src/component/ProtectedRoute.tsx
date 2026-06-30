import { useContext, type ReactNode } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

type Props = {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("AppContext not found");
  }

  const { showChatRoom } = context;

  if (showChatRoom === false) {
    return <Navigate to="/" />;
  }

  return children;
};