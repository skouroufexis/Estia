import  { useState,useEffect } from 'react';
import React from "react";
import './login.css';

import {
  BrowserRouter as Router,    
  Link,useParams
} from "react-router-dom";

    

function Login() {
   
    
    
    useEffect(()=>{
     //
     
     
    checkLoggedUser();

    },[]);
  
    const [email,setEmail]=useState('');

    const [password,setPassword]=useState('');

    const [errorMessage,setErrorMessage]=useState('');


    //control if user is already logged in
    function checkLoggedUser(){
       
        if(localStorage.getItem('username')!=null){
            
            window.location.href = "/welcome";            
            //
        }     
        
        
    }


    function submitLogin(){


        var xhttp = new XMLHttpRequest();
    
            xhttp.open("POST", "http://localhost:8080/api/postLogin");
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            let data=`email=${email}&password=${password}`;            
            xhttp.send(data);
            xhttp.onload = function() {
            if(this.status==200){
                
                let response=JSON.parse(this.responseText);                        
                localStorage.setItem('username',response.username);                
                localStorage.setItem('email',response.email);
                localStorage.setItem('password',response.password);                
                window.location.href = "/welcome";
                
                
            }
            else{
                let origin='index';
                let response=JSON.parse(this.responseText);        
                let message=response.message;
                setErrorMessage(message);
                openModal(0)                
            }
        }

    }

    function openModal(){
        let modal=document.getElementsByClassName('modals2');          
          modal=modal[0];
          modal.style.display='block';
          setTimeout(() => {
            modal.style.transform='translateY(0)';
            modal.style.opacity='1';
          }, 100);
    }

    function closeModal(){  
        let modal=document.getElementsByClassName('modals2');
        modal=modal[0];    
        modal.style.transform='translateY(-10px)';
        modal.style.opacity='0';          
        setTimeout(() => {       
          modal.style.display='none';                            
        }, 100);

    }
    


    
  
    return (
      
        
        <main className='container'>

            <div className='modals2'>                         
                <div className='row centre top2'>
                    <p className='col' ><b>{errorMessage}</b></p>
                </div>
                <div className='row justify-centre   top1'>                
                    <button className='col-3 left1 btn btn-primary' onClick={()=>{closeModal()}}>OK</button>               
                </div>
            </div> 




            <div className='row left'>
                <h5 className='col left green'><b>Sign in</b></h5>
            </div>
            
            <label className='row top1 grey'>Email    
                    <input type='text' id='email' onKeyUp={()=>{
                        setEmail(document.getElementById('email').value.trim());
                    }}></input>            
            </label>

            <label className='row top1 grey'>Password    
                    <input type='text' id='password' onKeyUp={()=>{
                        setPassword(document.getElementById('password').value.trim());
                    }}></input>            
            </label>

            <div className='row top1'>
                <button className='btn btn-primary top2' onClick={()=>{submitLogin()}}  >ok</button>
            </div>

            
            <Link to='/signup' className='col-4 col-lg'>
                <div className='row top1'>
                    <button className='btn green'>Sign up</button>
                </div>    
            </Link>

        </main>    
    );
  }
  
  export default Login;
