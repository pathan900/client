import React,{useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../App'

const Signin = () => {
    const {state, dispatch} = useContext(UserContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const postData = () =>{
        fetch("/signin", {
            method:"post",
            headers:{
                "Content-Type":"application/json",   
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data =>{
            if(data.error){
                M.toast({html: data.error, classes: 'rounded #e53935 red darken-1'});
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user}) // this will go to userReducer
                M.toast({html: "Signed in Successfully", classes: 'rounded #e53935 #1de9b6 teal accent-3'});
                history.push("/");
            }
        }).catch(error =>{
            console.log(error);
        })
    }
    return (
        <div>
            <div className="card auth_card input-field">
                <h2 className="brand-logo">Instagram</h2>
                <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)}/>
                <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={()=> postData()}>Log In</button>
                <Link to="/signup">
                <p>Don't have an account? Sign up</p>
                </Link>
            </div>
        </div>
    )
}

export default Signin
