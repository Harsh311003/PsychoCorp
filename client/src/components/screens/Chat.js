import React , {useState,useContext, useEffect} from "react";
// const React, {useState,useContext, useEffect} = require("/react");
import { UserContext } from "../../App";
import { userChats } from "../../api/ChatRequest";
// import { useDispatch, useSelector } from "react-redux";
import Conversation from "../Conversation/Conversation"
import ChatBox from "../ChatBox/ChatBox"
import {io} from "socket.io-client"
import '../ChatBox/ChatBox.css'

const Chat = () =>{
      
    
    const [currentChat,setCurrentChat] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    console.log(state);
    const [chats, setChats] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const socket = React.useRef();
    const [sendMessage, setSendMessage] = useState(null);
    const [recieveMessage, setRecieveMessage] = useState(null);

     //connect to Socket.io
     useEffect(()=> {
        socket.current=io("http://localhost:8800");
        // console.log(state._id)
        socket.current.emit("new-user-add",(state._id))
        socket.current.on('get-users',(users) =>{ //users is coming from activeUsers
            setOnlineUsers(users);
            console.log(users);
        } )
 },[state._id])

 
    //receive message from socket server
    useEffect(()=>{
        socket.current.on("receive-message", (data) =>{
            setRecieveMessage(data)
        })
    },[])

//sending message to socket server 
    useEffect(()=> {

        if(sendMessage!==null)
        {
            socket.current.emit('send-message',sendMessage)
        }
        
    },[sendMessage])

   
    // fetching chat of database from user
    //async function for intracting the db
    useEffect(()=>{
        const getChats = async()=> {
            try {
                const {data} = await userChats(state._id)

                
                setChats(data)
                console.log(data)

            } catch (error) {
                console.log(error);
            }
        }
        getChats()
    },[state])
     
    //sending the current chat as parameter 
     const checkOnlineStatus = (chat) => {
        const chatMember = chat.members.find((member)=> member!== state._id)
        const online = onlineUsers.find((user)=>user.userId === chatMember)
        return online ? true : false;
     }
    return (
        <>
        <div  className="Chat">
            {/* Left Side */}
            <div className="Left_side_chat">
                 
                 <div className="Chat-container">
                <h3>chats</h3>
                <div className="Chat-List">
                    {chats.map((chat) =>(
                        
                        
                        <div onClick={() => setCurrentChat(chat)}>
                            <Conversation data={chat} currentUserId={state._id} online = {checkOnlineStatus(chat)}/>
                          
                        </div>

                    ))}
                </div>
                </div>
            </div>
             
             {/* Right side */}
             <div className="Right-side-chat">
                   
                   {/* chat body */} 
                   
                   <ChatBox chat ={currentChat} currentUser = {state._id} setSendMessage={setSendMessage} recieveMessage={recieveMessage}/>

             </div>
        </div>
        </>
    )
}

export default Chat;