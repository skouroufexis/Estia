
import './main.css';
import logo from './images/logo.png';

import React from "react";
import  { useState,useEffect } from 'react';



function Header() {

  const [username, setUsername] = useState(''); 
  const [newUsername, setNewUsername]=useState('');
  const [email, setEmail] = useState('');  
  const [changePassword,setChangePassword] = useState('Change password');
  const [currentPassword, setCurrentPassword]=useState('');
  const [newPassword, setNewPassword]=useState('');  
  const [newPassword2, setNewPassword2]=useState('');  
  const [passwordsMatch1, setPasswordsMatch1]=useState('false');  
  const [error2,setError2]=useState('');
  const [userMessage, setUserMessage]=useState('');



  useEffect(()=>{
   
    //check if user is logged in and add username to header
   if(localStorage.getItem('username')!=null){
    setUsername(localStorage.getItem('username')); 
    setCurrentPassword(localStorage.getItem('password'));
    setNewUsername(localStorage.getItem('username'));
    setEmail(localStorage.getItem('email'));
    }  
    
  },[]);

  function openUserModal(){
    let modal=document.getElementById('userModal');
    
    //hide elements with sticky-top class
    let sticky=document.getElementsByClassName('sticky-top');
      sticky=sticky[0];
    if(sticky!=undefined){    
      sticky.style.visibility='hidden';
    }
      modal.style.display='block';
      setTimeout(() => {
        modal.style.transform='translateY(0)';
        modal.style.opacity='1';
      }, 100);
}


function closeUserModal(){  
  let modal=document.getElementById('userModal');
  let sticky=document.getElementsByClassName('sticky-top');  
  modal.style.transform='translateY(-10px)';
  modal.style.opacity='0';          
  setTimeout(() => {       
    modal.style.display='none';  
    sticky=sticky[0];
    if(sticky!=undefined){
    
      sticky.style.visibility='visible';                          
    }
    
    
  }, 100);

}

function logout(){
  localStorage.clear();
  window.location.href = "/";   
  
}

function openModalAccount(){
  let modal=document.getElementById('modalAccount');
    
    modal.style.display='block';
    document.getElementById('username').value=username;
    setTimeout(() => {
      modal.style.transform='translateX(0)';
      modal.style.opacity='1';
    }, 100);
}

function openModalMessage(){
  let modal=document.getElementById('modalMessageAccount');          
    
    modal.style.display='block';
    setTimeout(() => {
      modal.style.transform='translateY(0)';
      modal.style.opacity='1';
    }, 100);
}

function closeModalMessage(){

    if(userMessage=='Account successfully deleted'){
      localStorage.clear();
      window.location.href = "/";   
    }
    else{
      closeModalAccount(2);
      let modal=document.getElementById('modalMessageAccount');        
       modal.style.opacity='0';
      modal.style.transform='translateY(-10px)';
       setTimeout(() => {      
        modal.style.display='none';                
      }, 100);
    }
    
  }

function closeModalAccount(n){
  
  if(n==2){
    let modal=document.getElementById('modalAccount');        
    modal.style.opacity='0';
    modal.style.transform='translateX(-10px)';
    setTimeout(() => {      
      modal.style.display='none';     
     setChangePassword('Change password');   
     setPasswordsMatch1('false');   
     setError2('');
     setNewPassword('');
     setNewPassword2('');
    }, 100);
  }

  else{
    saveAccountChanges();
  }  
}


function saveAccountChanges(){

    let newUser;
    let newPass;
    // save changes and return true
    if(newPassword!=''){
      localStorage.setItem('password',newPassword);
      setCurrentPassword(newPassword);
      newPass=newPassword;
    }
    else{
      newPass=currentPassword;
    }
   
    if(newUsername!=''){
      localStorage.setItem('username',newUsername);
      setUsername(newUsername);
      newUser=newUsername;
      
    }
    else{
      newUser=username;
    }

    // change data in the files
    
    var xhttp = new XMLHttpRequest();
    
            xhttp.open("POST", "http://localhost:8080/api/putUser");
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            let data=`email=${email}&oldPassword=${currentPassword}&newPassword=${newPass}&oldUsername=${username}&newUsername=${newUser}`;            
            xhttp.send(data);
            xhttp.onload = function() {
            if(this.status==200){
                
              let response=this.responseText;                        
                setUserMessage(response);    
                console.log(response); 
                openModalMessage();           
                
            }
            else{
              let response=this.responseText;                        
              setUserMessage(response);    
              console.log(response);            
              openModalMessage();        
            }
        }

}

//toggles textbox for changing password
function togglePassword(){
  if(changePassword=='Change password'){
    setChangePassword('Cancel');
  }
  else{
    setChangePassword('Change password');
    setPasswordsMatch1('false');    
    setError2('');
    setNewPassword('');
    setNewPassword2('');
  }
}

//checks if new password matches (user enters it 2 times)
function checkPasswords(){

  if(newPassword!=''){  //password changed   
    if(newPassword2!=newPassword){
      setError2('Passwords do not match');
      return false;
    }    
    else{
      setError2('');      
                
      return true;
    }
  }
  else{ // only username changed
    return true;
  }
}


function promptDelete(){
  let modal=document.getElementById('modalDeleteAccount');
  modal.style.display='block';
    
    setTimeout(() => {
      modal.style.transform='translateY(0)';
      modal.style.opacity='1';
    }, 100);
}


function closePromptDelete(n){

  let modal=document.getElementById('modalDeleteAccount');
  
  modal.style.opacity='0';
  modal.style.transform='translateY(-10px)';  
    setTimeout(() => {
      
      modal.style.display='none';    

      if(n==1){ //user confirms delete account        
        var xhttp = new XMLHttpRequest();
    
            xhttp.open("POST", "http://localhost:8080/api/deleteUser");
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            let data=`email=${email}&username=${username}`;            
            xhttp.send(data);
            xhttp.onload = function() {
            if(this.status==200){
                
              let response=this.responseText;                        
                setUserMessage(response);    
                console.log(response); 
                openModalMessage();           
                
            }
            else{
              let response=this.responseText;                        
              setUserMessage(response);    
              console.log(response);            
              openModalMessage();        
            }
        }


      }



    }, 100);
  
}



    
  
  return (    
    
    
    <header className='container top2 border maincontent'>

        <div id='userModal'>
            {/* modal for displaying warning before deleting a household */}     
             <div id='modalDeleteAccount'>                         
                <div className='row centre top2'>
                    <p className='col' ><b>Are you sure you want to delete your account?</b></p>
                </div>
                <div className='row justify-centre   top1'>                
                    <button className='col-3 left1 btn btn-primary'onClick={()=>{
                      closePromptDelete(1);
                    }} >Yes</button>               
                    <button className='col-3 left1 btn btn-primary2'onClick={()=>{
                      closePromptDelete(2);
                    }} >cancel</button>                 
                </div>
            </div> 


                <div className='row centre top2'>
                    <p className='green' ><b>{username}</b></p>
                </div>

                <div className='row centre top1'>       
                  <button className='col btn black' onClick={()=>{openModalAccount()}} ><i class="fas fa-cog"></i></button>               
                  
                </div>

                <div className='row centre  top1'>       
                  <button className='col btn black' onClick={()=>{logout()}}><i class="fas fa-sign-out-alt"></i></button>                                 
                </div>

                

                
                <div className='row justify-centre top2'>       
                    <button className='col-3  btn btn-primary' onClick={()=>{closeUserModal()}}>Back</button>               
                </div>


                <div className='row justify-centre top2'>
                  <button className='col-3 btn red' onClick={()=>{
                    promptDelete();
                    }}><i class="fas fa-trash-alt"></i> Delete account
                  </button>                  
               </div>       


        </div> 

        


        {/* modal for editing user account */}
          <div className='container' id='modalAccount'>  

             <div className='row  top2'>
                <label className='col-8   black'><b>Edit account information</b></label>
             </div>

             <div className='row'>
              <button className='left' onClick={()=>{closeModalAccount(2)}} ><i class="fas fa-caret-left"></i></button>
            </div>

             <div className='row  top2'>
                <label className='col-8  grey'>Username</label>
                <input className='col-8 left1 top1' id='username' onKeyUp={()=>{
                  setNewUsername(document.getElementById('username').value);
                }} ></input>
             </div>

             
             <div className='row  top1'>
                <button className='col-8 left1  btn button-secondary left' onClick={()=>togglePassword()}>{changePassword}</button>
             </div>
              
             { changePassword=='Cancel' &&
               <span>
                 <div className='row  top1'>
                  <label className='col-8    grey'>Current Password</label>                  
                  <input type='password' className='col-8 left1  top1' id='currentPassword' onKeyUp={()=>{                    
                      

                      if(document.getElementById('currentPassword').value==currentPassword){
                        setPasswordsMatch1('true');    
                        setNewPassword('');                                            
                      }
                      else{
                        
                          setPasswordsMatch1('false');
                          setNewPassword('');

                      }
                    
                  }} ></input>
                  </div>

               {passwordsMatch1=='true' &&
                 <div className='row  top1'>
                  <label className='col-8 left1  grey'>New Password</label>
                  <input type='password' className='col-8 left1 top1' id='newPassword' onKeyUp={()=>{
                    setNewPassword(document.getElementById('newPassword').value);
                    
                    setError2('');
                  }}></input>
               </div>}
               
               {newPassword!='' && 
               <div className='row  top1'>
                  <label className='col-8  left1 top1  grey'>Repeat new password</label>
                  <span className='col-8 left1 red '><small><b>{ error2}</b></small></span>
                  <input type='password' className='col-8 left1 top1' id='newPassword2' onKeyUp={()=>{
                    setNewPassword2(document.getElementById('newPassword2').value); 
                    setError2('');                                     
                  }}></input> 
               </div>
               }
              
               
               </span>
             }

              {(newUsername!=username ||newPassword2!='')&&

                <div className='row'>
                  <button className='col-8 left1 top2 btn btn-primary' onClick={()=>{
                   if (checkPasswords()){   
                                         
                     closeModalAccount(1);
                   };                  
                 }} ><b>Save changes</b></button>
                 

                 

                </div>
                
              }
            
          </div>  

          <div className='border' id='modalMessageAccount'>
              <div className='row  left1  top2'>
                  <p className='col green' ><b>{userMessage}</b></p>
              </div>

              
              <button className='btn btn-primary  left2' onClick={()=>{closeModalMessage()}} >OK</button>
            
           </div>      

      {
        username=='' &&
        <div className='container'><img src={logo} className='button ' id='logo'></img><span className='button'> <b>Estia</b></span></div>
      }

      {
        username!='' &&
        <div className='container'><img src={logo} className='button' id='logo' onClick={()=>{openUserModal()}}></img><span className='lightgrey button' onClick={()=>{openUserModal()}}> |{username}</span> </div>
      }
    </header>            
  );
}

export default Header;
