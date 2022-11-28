import React,{useState, useEffect} from 'react'
import { useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const history = useHistory();
    useEffect(()=>{
        if(url){
            fetch("/createpost", {
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            }).then(res=>res.json()) 
            .then(data =>{
                if(data.error){
                    M.toast({html: data.error, classes: 'rounded #e53935 red darken-1'});
                }
                else{
                    M.toast({html: "Posted Successfully", classes: 'rounded #e53935 #1de9b6 teal accent-3'});
                    history.push("/");
                }
            }).catch(error =>{
                console.log(error);
            })
        }

    },[url])
    const uploadDetails = () =>{
        const data = new FormData
        data.append("file",image);
        data.append("upload_preset","instagram-clone");
        data.append("cloud_name","abdulkaleem");
        fetch("	https://api.cloudinary.com/v1_1/abdulkaleem/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data =>{
            setUrl(data.url)
        })
        .catch(err =>{console.log(err)})

       
    }
    return (
        <div className="card input-field container " style={{margin:"20px auto", padding:"20px", textAlign:"center",maxWidth: "500px"}}>
            <input type="text" placeholder="title" value={title} onChange={e=> setTitle(e.target.value)} />
            <input type="text" placeholder="body" value={body} onChange={e=> setBody(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #42a5f5 blue lighten-1">
                    <span>Photo</span>
                    <input type="file"  onChange={e=>{setImage(e.target.files[0])}} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={()=>uploadDetails()}>Submit</button>

        </div>
    )
}

export default CreatePost
