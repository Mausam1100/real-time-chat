import { MessageCircle, X } from "lucide-react"
import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import { socket } from "../socket"

interface MessageArrayType {
    message: string,
    senderId: string
}

function Chat() {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const context = useContext(AppContext)
    const navigate = useNavigate()
    const [users, setUsers] = useState(0)
    const [message, setMessage] = useState('')
    const [messagesArray, setMessagesArray] = useState<MessageArrayType[]>([])
    if(!context) {
        throw new Error('useAppContext must be used inside AppContext.Provide')
    }

    const {roomCode, setShowChatRoom} = context

    function handleCancel () {
        socket.emit("leave-room", roomCode)
        navigate('/')
        setShowChatRoom(false)
    }

    function handleSendMessage(message: string) {
        if (!message.trim()) return;
        socket.emit('chat', {roomCode, message})
        setMessage('')
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesArray]);

    useEffect(() => {
        socket.on('receive-message', (data) => {
            setMessagesArray((prev) => [...prev, data])
        })

        return () => {
            socket.off('receive-message')
        }
    }, [])

    useEffect(() => {
        if (!roomCode) return
        const handler = (count: number) => {
            setUsers(count)
        }
        socket.on("room-users", handler)
        socket.emit("join-room", roomCode) 
        return () => {
            socket.off("room-users", handler)
        }
    }, [roomCode])

  return (
    <>
        <div className="h-screen flex text-white justify-center items-center w-screen bg-[#0a0a0a]">
            <div className="w-[90%] sm:w-[60%] lg-w-[50%] xl:w-[33%] max-w-162.5 border border-gray-700 p-4 rounded-lg">
                <div className="flex justify-between">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <MessageCircle size={18} />
                            <span className="font-bold text-lg">Real Time Chat</span>
                        </div>
                        <p className="text-gray-500 text-sm">Temporary room that expires after both users exit</p>
                    </div>
                    <div>
                        <button onClick={handleCancel} className="p-1 rounded-md hover:bg-gray-800 cursor-pointer"><X /></button>
                    </div>
                </div>

                <div className="w-full flex justify-between items-center py-2 px-3 font-medium text-sm rounded-lg text-[#6b6b6b] mt-4 bg-[#262626]">
                    <div>Room Code: {roomCode}</div>
                    <div>Users: {users}</div>
                </div>

                <div className="border border-gray-700 space-y-3 p-3 h-96 w-full mt-4 rounded-lg overflow-y-auto chat">
                    {messagesArray.map((data, index) => (
                        <div key={index} className={`flex ${data.senderId === socket.id ? "justify-end": "justify-start"}`}>
                            <div className="bg-white max-w-[80%] text-sm font-medium text-black rounded-md px-3 py-2">{data.message}</div>
                        </div>
                    ))}
                    <div ref={bottomRef}></div>
                </div>

                <div className="flex mt-3 items-center gap-x-2 h-full">
                    <input onKeyDown={(e) => {
                        if(e.key === "Enter" && message.trim()) {
                            handleSendMessage(message)
                        }
                    }} value={message} onChange={(e) => setMessage(e.target.value)} className="outline px-3 h-full outline-gray-700 py-2 rounded w-full" type="text" placeholder="Type a message..." />
                    <button onClick={() => handleSendMessage(message)} className="cursor-pointer h-full hover:bg-gray-300 bg-white font-medium text-black px-6 py-2 rounded-lg">Send</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default Chat