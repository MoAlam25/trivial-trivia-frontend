import React, { useContext, useEffect, useState } from 'react';
import { Context } from './Context'
import { useNavigate } from "react-router-dom";

export default function Login(){
    let navigate = useNavigate();
    const { setLoginToTrue, reassignUserInfo, login, isLogin, reassignUserName  } = useContext(Context);

    const [enteredUserName,setEnteredUserName] = useState(null)
    const [enteredPassword,setEnteredPassword] = useState(null)

    const logInAndNavigate =  (enteredUserName,enteredPassword) => {
        login(enteredUserName, enteredPassword)
    }

    useEffect(()=>{
        if(isLogin){
            reassignUserName(enteredUserName)
            navigate('/category')
        }
    }, [isLogin])

    return(
        <div className = "login">
        <h1>Sign In</h1>
        <label className='user'> User </label>
        <input
            type = "text"
            placeholder = "Please enter your username"
            onChange={(event)=> {
                setEnteredUserName(event.target.value)
            }} 
        />
        <input 
            type = "password"
            placeholder = "Please enter your password"
            onChange={(event) =>{
                setEnteredPassword(event.target.value)
            }}
        />
        <button className = "button"
            onClick = {() => logInAndNavigate(enteredUserName,enteredPassword)}
        >
        Login 
        </button>
        <button className = "button"
            onClick = {() => navigate('/Register')}
        >
        Register
        </button>
        <button className = "button"
            onClick =  {() => console.log(isLogin)}
        >
        Check
        </button>
        </div>
    )
}