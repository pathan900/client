import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../App'
import { useParams } from 'react-router-dom'


const UserProfile = () => {
    const [userProfile, setProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [showFollow, setShowFollow] = useState(state? !state.following.includes(userid) :true)

    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setProfile(result)
                console.log(result)
            })
    }, [])

    //follow user
    const followUser = () =>{
        fetch("/follow", {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res =>res.json())
        .then(data =>{
            console.log(data)
            dispatch({type:"UPDATE", payload:{followers:data.followers, following:data.following}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState =>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers, data._id]   //complex
                    }
                }
            }))
            setShowFollow(false)
        })
    }

        //Unfollow user
        const unfollowUser = () =>{
            fetch("/unfollow", {
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    unfollowId:userid
                })
            }).then(res =>res.json())
            .then(data =>{
                console.log(data)
                dispatch({type:"UPDATE", payload:{followers:data.followers, following:data.following}})
                localStorage.setItem("user",JSON.stringify(data))
                setProfile((prevState =>{
                    const newFollower = prevState.user.followers.filter(item => item!= item._id)
                    return {
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newFollower   //complex
                        }
                    }
                }))
                setShowFollow(true)
            })
        }
    return (
        <>
        {userProfile ? 
        
            <div className="container">
            <div className="box row">
                <div className="col s12 m4">
                    <img className="profile_pic" src={userProfile.user.pic} alt="profile_photo" />
                </div>
                <div className="col s12 m8">
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div className="details">
                        <div>
                            <h6>{userProfile.posts.length}</h6>
                            <h6>Posts</h6>
                        </div>
                        <div>
                            <h6>{userProfile.user.followers.length}</h6>
                            <h6>Followers</h6>
                        </div>
                        <div>
                            <h6>{userProfile.user.following.length}</h6>
                            <h6>Following</h6>
                        </div>
                    </div>
                    {
                        showFollow ? <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={()=> followUser()}>Follow</button>
                                   : <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={()=> unfollowUser()}>UnFollow</button>
                    }

                </div>
            </div>

            {/* <div className="row">
                <h5>{state ? state.name : "Loading..."}</h5>
                <p>Marketing Manager</p>
                <p>Content writer</p>
                <p>Romania</p>
            </div> */}

            <div className=" gallery">
                {
                    userProfile.posts.map(item => {
                        return (
                            <img className="img" src={item.photo} alt="post" key={item._id} />
                        )
                    })
                }
            </div>
        </div>
        
        : <h2>loading...</h2>}
       
        </>
    )
}

export default UserProfile
