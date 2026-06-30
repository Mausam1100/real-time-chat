import { createBrowserRouter } from "react-router-dom";
import Room from "./component/Room";
import Chat from "./component/Chat";
import { ProtectedRoute } from "./component/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Room />
    }, 
    {
        path: '/chat',
        element: (
            <ProtectedRoute>
                <Chat />
            </ProtectedRoute>
        )
    }
])