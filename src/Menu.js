
import './menu.css';


import React from "react";
import  { useState,useEffect } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function Menu() {

    const [selected, select] = useState(0);
    let currentPage = window.location.pathname; 
    
    useEffect(() => {

        isLoggedIn();
          
      });


      function isLoggedIn(){

              
          if(localStorage.getItem('username')==null||localStorage.getItem('username')=='null'){
              localStorage.clear();
              window.location.href = "/";
          }      
        
        else{
          let menuItems=document.getElementsByClassName('menuItem');
         let l=menuItems.length;   
         let c;
         for(c=0;c<l;c++){
             menuItems[c].style.color='black';
         }         
         menuItems[selected].style.color='darkorange';
         checkUrl();  
        }
    }

      //in case user refreshes, the correct menu shall be orange
      function checkUrl(){
          
          let menuItems=document.getElementsByClassName('menuItem');
          
          let l=menuItems.length;   
          let c;
           for(c=0;c<l;c++){
               menuItems[c].style.color='black';

           }    

        if(currentPage.includes('/transactions')){
           
          
           menuItems[0].style.color='darkorange';           
           select(0);
        }
        else if(currentPage.includes('/stock') || currentPage.includes('/stock-category/') 
                || currentPage.includes('/new-item/')
                ||currentPage.includes('/item-balance/')
                ||currentPage.includes('/item-settings/')
                )
                {
          
           menuItems[1].style.color='darkorange';
           select(1);
        }
        else if(currentPage.includes('/notifications')){
          // let menuItems=document.getElementsByClassName('menuItem');                           
           menuItems[2].style.color='darkorange';
          select(2);
        }
        else if(currentPage.includes('/favourites')){
          // let menuItems=document.getElementsByClassName('menuItem');                           
           menuItems[3].style.color='darkorange';
          select(3);
        }
        else if(currentPage.includes('/list')){
          // let menuItems=document.getElementsByClassName('menuItem');                           
           menuItems[4].style.color='darkorange';
          select(4);
        }
        else if(currentPage.includes('/households')){
          // let menuItems=document.getElementsByClassName('menuItem');                           
           menuItems[5].style.color='darkorange';
          select(5);
        }


      }
    
      

  return (
        
        <footer className='container'>
            <div className='row' id='footer-main'>
              <Link  to='/transactions' className='col-4 col-lg'>
                <button className='full menuItem' onClick={()=>select(0)}>              
                    <i class="fas fa-exchange-alt"></i> 
                    <br></br>
                  <small>Transactions</small>                                 
                </button>
              </Link>
  
              <Link to='/stock' className='col-4 col-lg '>
                <button className='full menuItem' onClick={()=>select(1)}>
                <i class="fas fa-layer-group"></i>
                  <br></br>
                  <small>Stock</small>
                  </button>
              </Link>

              <Link to='/notifications' className='col-4 col-lg' onClick={()=>select(2)}>
                <button className=' full menuItem'>
                  <i class="fas fa-bell"></i>
                  <br></br>
                  <small>Notifications</small>
                </button>
              </Link>

              <Link to='/favourites' className='col-4 col-lg' onClick={()=>select(3)}>
                <button className='full menuItem'>
                  <i class="fas fa-star"></i>
                  <br></br>
                  <small>Favourites</small>
                </button>
              </Link>

              <Link to='/list' className='col-4 col-lg' onClick={()=>select(4)}>
                <button className='full menuItem'>
                  <i class="far fa-list-alt"></i>
                  <br></br>
                <small>Shopping list</small>
                </button>
              </Link>

              <Link to='/welcome' className='col-4 col-lg' onClick={()=>select(5)}>
                <button className='full menuItem'>
                <i class="fas fa-house-user"></i>
                <br></br>
                <small>Households</small>
                </button>
              </Link>                    
            </div>

            <div className='row' id='footer-stock'>

            </div>
        </footer>     
        
        
  );
}

export default Menu;
