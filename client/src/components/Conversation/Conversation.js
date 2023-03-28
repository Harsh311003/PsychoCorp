import React, { useEffect, useState } from "react"
import { getUser } from "../../api/UserRequest"
import profile from "../screens/UserProfile"


const Conversation = ({ data, currentUserId, online }) => {

    const [userData, setUserData] = useState(null)

    //userData jiski sath hum chat kerna chate hai
    useEffect(() => {
        const userid = data.members.find((id) => id !== currentUserId)
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setUserData(result)
            })
    }, [])
    // useEffect(()=> {

    //     // const userId = data.members.find((id)=>id!==currentUserId)
    //     console.log(userId)
    //     const getUserData = async ()=> {
    //          const {data} =  profile(userId)
    //          setUserData(data)
    //          console.log(data);
    //     }

    //     getUserData();
    //   }, [])
    return (
        <>
            <div className="follwer conversation">
                <div >
                    {online && <div className="online-dot" ></div>}
                    <img src={userData?.user?.pic}
                        className="followerImage"
                        style={{ width: "50px", height: "50px" }} />
                    <div className="name" style={{ fontSize: '0.8rem' }}>
                        <span>{userData?.user?.name}</span>
                        <br></br>
                        <span>{online? "online":"offline"}</span>
                    </div>
                    <hr></hr>
                </div>
            </div>
            {/* <h1>Your contacts</h1> */}
        </>
    )
}

export default Conversation