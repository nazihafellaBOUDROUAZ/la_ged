import React from 'react'
import './welcome.css'
import logo from "../pictures/logoo.png";
import welcome from "../pictures/welcome.png";

function Welcome() {
  return (
    <div>
   <h1 className='welcome-tete'> 
      <img src={logo} alt="Logo"/>
      <a  href="/signin">
      <button  className='signin-btn'> Sign In</button>
      </a>
    </h1>
    <div>
    <img  className='welcome-pic' src={welcome} alt="welcome" />
    </div>
   </div>
  )
}

export default Welcome

  