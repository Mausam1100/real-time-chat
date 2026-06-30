import { Copy, MessageCircle } from "lucide-react"
import { useContext, useState } from "react";
import { socket } from "../socket";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function Room() {
    const [generatedCode, setGeneratedCode] = useState('')
    const [code, setCode] = useState('')
    const [showCode, setShowCode] = useState(false)
    const context = useContext(AppContext)
    const navigate = useNavigate()
    
    if (!context) {
        throw new Error("useAppContext must be used inside AppContext.Provider");
    }

    const {setShowChatRoom, setRoomCode} = context

    const generateRoomCode = () => {
        const code = Math.random().toString(36).slice(2, 8).toUpperCase();
        setGeneratedCode(code)
        setShowCode(true)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
    }

    const handleJoinRoom = (code: string)  => {
        if(!code) {
            alert("Enter the room code")
            return
        }
        socket.emit('join-room', code)
        setShowChatRoom(true)
        setRoomCode(code)
        navigate('/chat')
        setCode('')
    }
  return (
    <>
        <div className="h-screen flex text-white justify-center items-center w-screen bg-[#0a0a0a]">
            <div className="w-[90%] sm:w-[60%] lg-w-[50%] xl:w-[33%] max-w-162.5 border border-gray-700 p-4 rounded-lg">
                <div>
                    <div className="flex items-center gap-x-2">
                        <MessageCircle size={18} />
                        <span className="font-bold text-lg">Real Time Chat</span>
                    </div>
                    <p className="text-gray-500 text-sm">Temporary room that expires after both users exit</p>
                </div>

                <div>
                    <button onClick={generateRoomCode} className="w-full hover:bg-gray-300 cursor-pointer my-3 bg-white text-black rounded-sm font-semibold text-center py-2">Create New Room</button>
                    
                    <div className="my-1 flex gap-x-2 h-full items-center">
                        <input value={code} onChange={(e) => setCode(e.target.value)} type="text" className="w-full h-full outline-1 outline-[#858485] rounded px-2 py-1" placeholder="Enter Room Code" />
                        <button onClick={() => handleJoinRoom(code)} className="bg-white hover:bg-gray-300 cursor-pointer text-nowrap h-full font-semibold rounded px-3 py-1 text-black">Join Room</button>
                    </div>
                </div>

                {showCode && <div className="bg-[#262626] w-full rounded-lg py-4 mt-4">
                    <p className="text-[#696969] font-medium text-sm text-center">Share this code with your friend</p>
                    <div className="flex justify-center items-center">
                        <div className="text-center tracking-wider font-bold text-lg py-1">{generatedCode}</div>
                        <button onClick={handleCopy} className="hover:bg-gray-900 cursor-pointer p-2 rounded-md"><Copy size={18} strokeWidth={2} /></button>
                    </div>
                </div>}
            </div>
        </div>
    </>
  )
}

export default Room