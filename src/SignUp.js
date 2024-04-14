import  { useState,useEffect } from 'react';
import React from "react";
import './signUp.css';

import {
  BrowserRouter as Router,    
  Link,useParams
} from "react-router-dom";

import { validate } from 'react-email-validator';

function SignUp() {
   
    
    
    useEffect(()=>{
     //
    
    },[]);

    const [username, setusername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [repeatpassword, setrepeatpassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    


    function validateFields(){
        
        try { 
            if(!validate(email)) throw "Please use a valid email address";
            if(password!=repeatpassword) throw "Passwords do not match";
            
            openModal(1);
          }
          catch(err) {
            setErrorMessage(err)
            openModal(0);
            
            
          }

    }

    function openModal(n){
        let modal=document.getElementsByClassName('modals2');          
          modal=modal[n];
          modal.style.display='block';
          setTimeout(() => {
            modal.style.transform='translateY(0)';
            modal.style.opacity='1';
          }, 100);
    }

    function closeModal(n,action='none'){  
        let modal=document.getElementsByClassName('modals2');
        modal=modal[n];    
        modal.style.transform='translateY(-10px)';
        modal.style.opacity='0';          
        setTimeout(() => {       
          modal.style.display='none';                            
        }, 100);

        if(action==1){
            
            //proceed with signup
            var xhttp = new XMLHttpRequest();
    
            xhttp.open("POST", "http://localhost:8080/api/postUser");
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            let data=`username=${username}&email=${email}&password=${password}`;
            
            xhttp.send(data);
            xhttp.onload = function() {
            if(this.status==200){
                
                let origin='index';
                let response=JSON.parse(this.responseText);        
                let message=response.message;
                let path='http://localhost:3000/error/'+origin+'/'+message;
                window.location.replace(path);
            }
            else{
                let origin='index';
                let response=JSON.parse(this.responseText);        
                let message=response.message;
                setErrorMessage(message);
                openModal(0)                
            }
          
        };




        }
    }
    



    return (
      
      
        
        <main className='container'>

            <div className='modals2'>                         
                <div className='row centre top2'>
                    <p className='col' ><b>{errorMessage}</b></p>
                </div>
                <div className='row justify-centre   top1'>                
                    <button className='col-3 left1 btn btn-primary' onClick={()=>{closeModal(0)}}>OK</button>               
                </div>
            </div> 

            <div className='modals2'>                         
                <div className='row centre top2'>
                    <p className='col' ><b>Please review your information</b></p>
                </div>

                <div className='row centre'>
                    <p className='col-6  right green'>username:</p>
                    <p className='col-6  left grey'>{username}</p>
                </div>

                <div className='row centre'>
                    <p className='col-6  right green'>email:</p>
                    <p className='col-6  left grey'>{email}</p>
                </div>

                <div className='row centre'>
                    <p className='col-6  right green'>password:</p>
                    <p className='col-6  left grey'>{password}</p>
                </div>
                

                <div className='row justify-centre   top1'>                
                    
                    <button className='col-6 top1 left1 btn btn-primary' onClick={()=>{closeModal(1,1)}}>Confirm</button>
                    <button className='col-6 top2 left1 btn' onClick={()=>{closeModal(1,0)}}>Cancel</button>               
                    
                    
                </div>
            </div> 
            
            <div className='row maincontent'>
                <Link to='/' className='col-12'><i className="fas fa-caret-left"></i></Link>
            </div>

            <div className='row'> 
                <h5 className='col-12 green top1'><b> Sign up </b></h5>    
            </div>
            <label className='row grey'>username 
                <input type='text' id='usernameSignUp' onKeyUp={()=>{
                    setusername(document.getElementById('usernameSignUp').value.trim());
                    
                }}></input>
            </label>            

            <label className='row grey'>email
                <input type='text' id='emailSignUp' onKeyUp={()=>{
                    setEmail(document.getElementById('emailSignUp').value.trim());
                    
                }} ></input>
            </label>            

            <label className='row  grey'>password
                <input type='password' id='passwordSignUp' onKeyUp={()=>{
                    setpassword(document.getElementById('passwordSignUp').value.trim());
                    
                }}></input>
            </label>        

            {
                password!='' &&
                <label className='row  grey'>Repeat Password
                <input type='password' id='repeatpasswordSignUp'onKeyUp={()=>{
                    setrepeatpassword(document.getElementById('repeatpasswordSignUp').value.trim());
                    
                    
                }}></input>
            </label> 

            
            }

            

            { username!='' && email!='' && password!='' && repeatpassword!='' &&
                <div className='row '>
                    <button className='btn btn-primary top2' onClick={()=>{validateFields();}} >Sign up</button>
                    
                </div>
                
            }






            
        </main>    
    );
  }
  
  export default SignUp;