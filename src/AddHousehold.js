
import './addHousehold.css';


import React from "react";

import  { useState,useEffect } from 'react';

import {Link} from "react-router-dom";

let username=localStorage.getItem('username');
let email=localStorage.getItem('email');
let password=localStorage.getItem('password');

function AddHousehold() {
 
    useEffect(()=>{
        isLoggedIn();    
      },[]);
    
    
      function isLoggedIn(){
    
               
          if(localStorage.getItem('username')==null||localStorage.getItem('username')=='null'){
              localStorage.clear();
              window.location.href = "/";
          }             
    }    


function toggleAddHousehold(){
    let text= document.getElementById('householdName').value;
    let submit=document.getElementById('submit_AddHousehold');
    if(text!=''){
        submit.disabled=false;
    }
    else{
        submit.disabled=true;
    }
    
}

  return (
    
      
      <main className='container'>
          <div className='row'>
              <Link to='/welcome' className='col-12'><i class="fas fa-caret-left"></i></Link>
          </div>
          <div className='row'>
                <div className='col-12'>
                    <h5 className='green'><b>Add a new Household</b> </h5>
                </div>                            
          </div>

          <form method='post' action='http://localhost:8080/api/postHousehold' className='row'>
                    <label for='householdName' className='grey'>Household Name
                        <input className='col-12' type='text' id='householdName' name='householdName' onKeyUp={()=>{toggleAddHousehold()}}></input>
                        <input value={username} name='username' hidden></input>
                        <input value={email} name='email' hidden ></input>
                        <input value={password} name='password' hidden ></input>
                    </label>
                    <button className='top2 col-12  button-secondary' id='submit_AddHousehold' type='submit' disabled>Add</button>

          </form>

          
          
      </main>    
  );
}

export default AddHousehold;
