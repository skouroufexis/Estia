
import './notifications.css';
import  { useState,useEffect } from 'react';

import React from "react";

function Notifications() {
  const [all_Notifications, getAll_Notifications] = useState('');
  
  let household=localStorage.getItem('household');
  let username=localStorage.getItem('username');
  let email=localStorage.getItem('email');
  useEffect(()=>{    
    isLoggedIn();      
  },[]);

  function isLoggedIn(){
      if(localStorage.getItem('username')==null||localStorage.getItem('username')=='null'){
          localStorage.clear();
          window.location.href = "/";
      }      
    
    else{
      getNotifications();  
    }
}

  function getNotifications(){    
      getAll_Notifications('');
      let path='http://localhost:8080/api/getNotifications?household='+household+'&email='+email+'&username='+username;
      var xhttp = new XMLHttpRequest();    
      xhttp.open("GET", path);
      xhttp.send();
      xhttp.onload = function() {  
         if(this.status==200){
            let response=JSON.parse(this.responseText);
            getAll_Notifications(response);            
         }
        
      };   
  }


  function shoppingList(category,subcategory,item){

    
    // household,category,subcategory,item
    let path='http://localhost:8080/api/postShoppinglist';

    let data=`household=${household}&category=${category}&subcategory=${subcategory}&item=${item}&email=${email}&username=${username}`;

    var xhttp = new XMLHttpRequest();    
    xhttp.open("POST", path);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(data);
    xhttp.onload = function() {  
        if(this.status==200){          
          getNotifications();          
        }
      
    };  
  }


  function removeExpiry(item,dateAdded){
     
     let path='http://localhost:8080/api/deleteExpiry';

     let data=`household=${household}&item=${item}&date=${dateAdded}&email=${email}&username=${username}`;
 
     var xhttp = new XMLHttpRequest();    
     xhttp.open("POST", path);
     xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
     xhttp.send(data);
     xhttp.onload = function() {  
         if(this.status==200){          
           getNotifications();          
         }       
     };      
  }

  
  //gets items from file and creates list of products         
  function getItems(all_Notifications){
    if(all_Notifications!='')
    {  
      let itemsList=[];
      
      let l=all_Notifications.length;
      
      let c;

      for(c=0;c<l;c++){
      
      
        let  notifications= all_Notifications[c].split(',');
          
          
          let item=notifications[0];
          let message=notifications[1];
          let category=notifications[2];
          let subcategory=notifications[3];
          let autolist=notifications[4];
          let added=notifications[5];
          
          //populate list array to displayed--different colours for the two different notification messages
          if(message=='Stock below minimum'){

            itemsList.push( 
              <div className='row top1 record' key={c}>         
                <p className='col-5 margin-v-auto left vertical-centre'><span className='left2'>{item}</span></p>
                <p className='col-5 margin-v-auto left vertical-centre green2'>{message}</p>              
                <div className='col-2 background-white'>     

                  {(autolist=='on' && message=='Stock below minimum') && <button className='left2'><i class="fas fa-tasks grey"></i></button>}             
                  {(autolist=='off' && message=='Stock below minimum' && added=='false') && <button className='left2 btn green' title='add to shopping list' onClick={()=>{shoppingList(category,subcategory,item);}}>+ <i class="far fa-list-alt"></i></button>} 
                  {(autolist=='off' && message=='Stock below minimum' && added=='true') && <button className='left2'><i class="left2 fas fa-tasks grey"></i></button>}
                  
                  
                </div>
            </div> ) 
            
          }
          else{
            itemsList.push( 
              <div className='row top1 record' key={c}>     
                <p className='col-5 margin-v-auto left vertical-centre'><span className='left2'>{item}</span></p>
                <p className='col-5 margin-v-auto left vertical-centre red'>{message}</p>                  

                <div className='col-2 background-white'>                       
                  <button className='left2 btn green' title='send to trash' onClick={()=>{removeExpiry(item,added);}}><i class="fas fa-trash"></i></button> 
                </div>

            </div> ) 

          }
          
          
          
          
        
          
      }
      

      return(
        <div>
          <div className='row top2 headers sticky-top'>
              <h6 className='col-5 left'>Item</h6>
              <h6 className='col-5 left'>Message</h6>
              <h6 className='col-2 left'></h6>                               
          </div>
          {itemsList}
        </div>
      );
    }else{
      return(
          <div className='row top1'>         
              <p className='col margin-v-auto  left lightgrey'>No Notifications found</p>              
          </div>
      )
    }
    
  }

  return (
    
      
      <main className='container'>
          <div className='row left'>
              <h5 className='col left'>Notifications</h5>
          </div>         
          <div id='main-container_Transactions'>
            {getItems(all_Notifications)}            
          </div>

          { all_Notifications!='' &&
            <div className='row'>
              <div className='col lightgrey'><small className='left1'>scroll down to see more notifications</small></div>
            </div>
          }
      </main>    
  );
}

export default Notifications;
