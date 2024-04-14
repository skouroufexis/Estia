
import './error.css';
import React from "react";
import {Link,useParams} from "react-router-dom";
import  { useState,useEffect } from 'react';

function ErrorMessage() {  
  let { origin, message } = useParams();
  useEffect(()=>{
    isLoggedIn();    
  },[]);


  function isLoggedIn(){

      if(message!='Account successfully created'){
        if(localStorage.getItem('username')==null||localStorage.getItem('username')=='null'){
          localStorage.clear();
          window.location.href = "/";
        }             
      }  
      
}  


  
  if(origin=='index'){
    origin='/';
  }
  else{
    origin='/'+origin;
  }
  
  return (
    
      
      <main className='container'>
          <div className='row'>          
            <div className='col-12 centre top1'>
                  <p className='green'><b>{message}</b></p>
            </div>
            <Link to={origin} className='col-12 centre'><button className='col btn button-secondary'>OK</button> </Link>
          </div>
          
      </main>    
  );
}

export default ErrorMessage;
