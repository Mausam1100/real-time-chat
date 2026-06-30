import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './router'
import { useEffect, useState } from 'react'
import { AppContext } from './context/AppContext'
import { socket } from './socket'

function App() {
  const [showChatRoom, setShowChatRoom] = useState(false)
  const [roomCode, setRoomCode] = useState('')

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`User connected: ${socket.id}`)
    })
  }, [])
  return (
    <>
    <AppContext.Provider value={{showChatRoom, setShowChatRoom, roomCode, setRoomCode}}>
      <RouterProvider router={router} />
    </AppContext.Provider>
    </>
  )
}

export default App
