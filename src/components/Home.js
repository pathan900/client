import React, { useState, useEffect, useContext} from 'react'
import {UserContext} from '../App'
import {Link} from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    useEffect(() => {
        fetch("/allposts", {
            headers: {
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.posts)
            })
            .catch(error => console.log(error))
    }, [])
//like
    const like = (id) =>{
        fetch("/like", {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res =>res.json())
        .then(result =>{
            console.log(result)
            const newData = data.map(item =>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err => console.log(err))
    }
    //unlike
    const unlike = (id) =>{
        fetch("/unlike", {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res =>res.json())
        .then(result =>{
            const newData = data.map(item =>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err => console.log(err))
    }

    //comment
    const makeComment = (text, postId)=>{
        fetch('/comment', {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res =>res.json())
        .then(result =>{
                const newData = data.map(item =>{
                    if(item._id==result._id){
                        return result
                    }
                    else{
                        return item
                    }
                })
                setData(newData)
        }).catch(err => console.log(err))
    }

    //delete post
    const deletepost = (postId) =>{
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
        }).then(res =>res.json())
        .then(result =>{
            console.log(result)
            const newData = data.filter(item =>{
                return item._id !== result._id
            })
            setData(newData)
            window.location.reload();
        })
    }
    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card my-card" key={item._id}>
                            <h5><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link> {item.postedBy._id == state._id && <i className="material-icons" style={{cursor:"pointer", color:"red", float:"right"}} onClick={() =>{deletepost(item._id)}}>delete</i>}</h5>
                            <div className="card-image">
                                <img src={item.photo} alt="img" />
                            </div>
                            <div className="card-content input-field">
                                
                                {
                                    item.likes.includes(state._id)
                                    ? <i className="material-icons" style={{cursor:"pointer", color:"red"}} onClick={() =>{unlike(item._id)}}>favorite</i>
                                    : <i className="material-icons" style={{cursor:"pointer", color:"red"}} onClick={() =>{like(item._id)}}>favorite_border</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record =>{
                                      return  <h6 key={item._id}><strong>{record.postedBy.name}</strong> {record.text}</h6> 
                                    })
                                }
                                <form onSubmit={(e) =>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                <input type="text" placeholder="comment" />
                                </form>
                            </div>
                        </div>
                    )

                })
            }

        </div>
    )
}

export default Home
