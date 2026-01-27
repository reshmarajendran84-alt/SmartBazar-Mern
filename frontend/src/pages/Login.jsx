import React, { useState } from 'react'

function Login() {
    const [email,setEmail]=useState("");
    handlechange=(e)=>{
        e.preventDefault();
        setEmail(e.target.value)
    }
    handleClick=()=>{
        
    }
  return (
    <div>
      <form>
  <input type='email' placeholder=' Enter your email'/>
      <button>Sent</button>
      <p>Forget Password</p>
      </form>
    
    </div>
  )
}

export default Login
