import React,{useEffect,useState, useContext} from 'react'
import {UserContext} from '../App'


const Profile = () => {
    const [mypics, setPics]=useState([])
    const [image, setImage] = useState("");
    const {state, dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/profile',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res =>res.json())
        .then(result =>{
            setPics(result.myposts)
            console.log(result)
        })
    },[])
    useEffect(()=>{
        if(image){
            const data = new FormData
            data.append("file",image);
            data.append("upload_preset","instagram-clone");
            data.append("cloud_name","abdulkaleem");
            fetch("	https://api.cloudinary.com/v1_1/abdulkaleem/image/upload",{
                method:"post",
                body:data
            }).then(res=>res.json())
            .then(data =>{
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt"),
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res =>res.json())
                .then(result =>{
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC", payload:result.pic})
                })
            })
            .catch(err =>{console.log(err)})
        }
    },[image])
    const updatePic = (file) =>{
        setImage(file)

    }
    return (<div className="container">
        <div className="box row">
            <div className="col s12 m4">
                <img className="profile_pic" src={state ? state.pic : ""} alt="profile_photo"/>
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light #42a5f5 blue lighten-1">
                        <span>Update Profile picture</span>
                        <input type="file" onChange={e => { updatePic(e.target.files[0]) }} />
                    </div>
                 
                </div>

            </div>
            <div className="col s12 m8">
                <h4>{state?state.name:"Loading..."}</h4>
                <div className="details">
                    <div>
                    <h6>{mypics.length}</h6>
                    <h6>Posts</h6>
                    </div>
                    <div>
                    <h6>{state ? state.followers.length : "fetching..."}</h6>
                    <h6>Followers</h6>
                    </div>
                    <div>
                    <h6>{state ? state.following.length :  "fetching..."}</h6>
                    <h6>Following</h6>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
            <h5>{state?state.name:"Loading..."}</h5>
            <p>Marketing Manager</p>
            <p>Content writer</p>
            <p>Romania</p>
        </div>

        <div className="gallery">
        {
            mypics.map(item=>{
                return(
                <img className="img" src={item.photo} alt="post" key={item._id}/>
                )
            })
        }
        </div>
        </div>
    )
}

export default Profile
