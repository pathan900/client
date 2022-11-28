import React, { useEffect, createContext, useReducer, useContext } from 'react'
import './App.css';
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/Home'
import Signup from './components/Signup'
import Signin from './components/Signin'
import Profile from './components/Profile'
import CreatePost from './components/CreatePost';
import {reducer, initialState} from './reducer/userReducer'
import UserProfile from './components/UserProfile';


export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){   //if user is present
      dispatch({type:"USER", payload:user})
    }
    else{   //if user is not present then redirect to singin page
      history.push("/signin")
    }
  },[])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/signin">
        <Signin />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/createpost">
        <CreatePost />
      </Route>
      <Route exact path="/profile/:userid">
        <UserProfile/>
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  console.log(state)
  
  return (
    <UserContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
