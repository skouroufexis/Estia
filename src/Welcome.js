
import './welcome.css';


import React from "react";

import  { useState,useEffect } from 'react';

import {Link} from "react-router-dom";



function Welcome() {

  
  let username=localStorage.getItem('username');
  let email=localStorage.getItem('email');
  let password=localStorage.getItem('password');
  
  localStorage.clear();
  
  localStorage.setItem('username',username);
  localStorage.setItem('email',email);
  localStorage.setItem('password',password);

  const [all_Welcome, getAll_Welcome] = useState('');
  const [selectedHousehold, setSelectedHousehold]=useState('');
  const [oldHouseholdName, setOldHouseholdName]=useState('');
  

  useEffect(()=>{    
    
    isLoggedIn();
        
  },[]);

  function isLoggedIn(){
    if(localStorage.getItem('username')==null||localStorage.getItem('username')=='null'){
        localStorage.clear();
        window.location.href = "/";
    } 
    else{
      getHouseholds();
    }            
}  

  
  
  

  function select_Welcome(household){
    
    localStorage.setItem('household',household);
    window.location.href = "/transactions";
    
  }

  function getHouseholds(){    
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "http://localhost:8080/api/getHouseholds");


    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let data=`email=${email}&password=${password}&username=${username}`;  

    xhttp.send(data);

    xhttp.onload = function() {
      if(this.status==200){
          let response=JSON.parse (this.responseText);
          getAll_Welcome(response.folders);  
          
          if(response.length==3){
            document.getElementById('addHouseHold_Welcome').style.display='none';
          }
          else{
            document.getElementById('addHouseHold_Welcome').style.display='block';
          }
          // document.getElementById('addHouseHold_Welcome').style.display='block';
      }
  };

  }  
  
  

  function showItems_Welcome(){
      
      let households=[];

      let l = all_Welcome.length;
      let c;

      for(c=0;c<l;c++){
        
        if(all_Welcome[c]!='.DS_Store'){
            let n=c;
            households.push(
              <div className= 'row top2  background-green'>
                  
                        
                       <div className='col  top1'>
                         <button  onClick={()=>{select_Welcome(all_Welcome[n])}} >
                            <i class="fas fa-house-user button-img green"></i> 
                         </button>                                            
                         <span className='black button' onClick={()=>{select_Welcome(all_Welcome[n])}}>
                            {all_Welcome[c]}
                         </span>   

                         <span className='left2 black button' onClick={()=>{openModal(all_Welcome[n]);}}>
                         <i class="far fa-edit"></i>
                         </span>   
                       </div>                                                         
                  

                  {/* <div className='col border'>
                    <button className='btn' onClick={()=>{                    
                      openModal(all_Welcome[n]);
                      }}><i class="far fa-edit"></i>
                    </button>
                  </div> */}
              </div>
            );

        }
        
      }

      return (<div>{households}</div>);

      
  }
  

  function openModal(household){

    //set selected household
    setSelectedHousehold(household);
    setOldHouseholdName(household);

    //set the household's name in the modal's input
    document.getElementById('input_household').value=household;


    let modal=document.getElementsByClassName('modals2');
      
      modal=modal[0];
      modal.style.display='block';
      setTimeout(() => {
        modal.style.transform='translateY(0)';
        modal.style.opacity='1';
      }, 100);
  }


  function openModal2(){

    let modal=document.getElementsByClassName('modals');
      
      modal=modal[0];
      modal.style.display='block';
      setTimeout(() => {
        modal.style.transform='translateY(0)';
        modal.style.opacity='1';
      }, 100);
  }


  function closeModal(){  
    getHouseholds();
    let modal=document.getElementsByClassName('modals2');
    modal=modal[0];
  
    modal.style.transform='translateY(-10px)';
    modal.style.opacity='0';          
    setTimeout(() => {       
      modal.style.display='none';   
      
      //update household name  
      let path='http://localhost:8080/api/putHousehold?oldName='+oldHouseholdName+'&newName='+selectedHousehold+'&email='+email+'&username='+username;
      var xhttp = new XMLHttpRequest();    
      xhttp.open("GET", path);
      xhttp.send();
      xhttp.onload = function() {  
         if(this.status==200){
            console.log('household name updated');
            getHouseholds();
         }
      };
    }, 100);
  }

  function closeModal2(n){  
    
    if(n==1){
      
      //delete household       
       let path='http://localhost:8080/api/deleteHousehold?name='+oldHouseholdName+'&email='+email+'&username='+username;;
       var xhttp = new XMLHttpRequest();    
       xhttp.open("GET", path);
       xhttp.send();
       xhttp.onload = function() {  
          if(this.status==200){
             console.log('household deleted');             
          }
       };      
    }
    
    let modal=document.getElementsByClassName('modals');
    modal=modal[0];
  
    modal.style.transform='translateY(-10px)';
    modal.style.opacity='0';          
    setTimeout(() => {       
      modal.style.display='none';    
      
      closeModal();

    }, 100);
  }


  return (
    
      
      <main className='container'>
         
          <div>

            {showItems_Welcome()}
            <Link to='/addHousehold'><button className='col-12 top2 left' id='addHouseHold_Welcome'><b><i class="fas fa-house-user button-img black"></i> +</b></button></Link>
            
          </div>

          {/* modal for editing household */}
          <div className='modals2' >                                                   
             <div className='row  top2'>
                <label className='col-8 left2  black'><b>Edit or delete household</b></label>
             </div>
             <div className='row   top1'>
                <input className='col-8 left2 border'  id='input_household' onKeyUp={()=>{
                  setSelectedHousehold(document.getElementById('input_household').value.trim());
                }} ></input>                
                <button className='col-1 left1 btn btn-primary' onClick={()=>{closeModal()}}>ok</button>
                <button className='col-1 btn btn-primary2 left1' onClick={()=>{openModal2()}}  > <i class="fas fa-trash"></i></button>
             </div>  


             {/* modal for displaying warning before deleting a household */}     
             <div className='modals'>                         
              <div className='row centre top2'>
                  <p className='col' ><b>Are you sure you want to delete this household?</b></p>
              </div>
              <div className='row justify-centre   top1'>                
                  <button className='col-3 left1 btn btn-primary' onClick={()=>{closeModal2(1)}}>Yes</button>               
                  <button className='col-3 left1 btn btn-primary2' onClick={()=>{closeModal2(2)}}>cancel</button>                 
              </div>
            </div>  


          </div>    

          
          

      </main>    
  );
}

export default Welcome;
