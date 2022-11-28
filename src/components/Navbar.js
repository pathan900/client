import React, {useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'


const Navbar = () => {
    const {state, dispatch} = useContext(UserContext)
    const user = JSON.parse(localStorage.getItem("user"))
    const history = useHistory()
    return (
        <div className="container-small">
            <nav>
                <div className="nav-wrapper white">
                    <Link to={state ?"/" : "/signin"} className="brand-logo left">Instagram</Link>
                    <ul id="nav-mobile" className="right">
                        {!user && <li><Link to="/signin">Login</Link></li> }
                        {!user && <li><Link to="/signup">Signup</Link></li>}
                        {user && <li><Link to="/createpost">New Post</Link></li>}
                        {user && <li><Link to="/profile">Profile</Link></li> }
                        {user && <li><button className="btn waves-effect waves-light #f44336 red" 
                        onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        history.push("/signin")
                        }}>Logout</button></li> }
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
