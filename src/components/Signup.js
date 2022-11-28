import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined); 
    const history = useHistory()
    useEffect(()=>{
        if(url){
            uploadDetails()
        }
    },[url])
    const uploadpic = () =>{
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
    const uploadDetails = () =>{
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "invalid email", classes: 'rounded #e53935 red darken-1' });
            return
        }
        // if(!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)){
        //     M.toast({html: "Password must be ALPHANUMERIC with both UPPER and LOWER case letter and a special character and of minimum 8 characters long", classes: 'rounded #e53935 red darken-1'});
        //     return
        // }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: 'rounded #e53935 red darken-1' });
                }
                else {
                    M.toast({ html: data.message, classes: 'rounded #e53935 #1de9b6 teal accent-3' });
                    history.push("/signin")
                }
            }).catch(error => {
                console.log(error);
            })
    }
    const PostData = () => {
        if(image){
            uploadpic()
        }else{
            uploadDetails()
        }
    }
    return (
        <div>
            <div className="card auth_card input-field">
                <h2 className="brand-logo">Instagram</h2>
                <input type="text" placeholder="name" value={name} onChange={e => setName(e.target.value)} />
                <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light #42a5f5 blue lighten-1">
                        <span>Profile Image</span>
                        <input type="file" onChange={e => { setImage(e.target.files[0]) }} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={() => PostData()}>Sign Up</button>
                <Link to="/signin">
                    <p>Have an account? Log in</p>
                </Link>
            </div>
        </div>
    )
}

export default Signup
