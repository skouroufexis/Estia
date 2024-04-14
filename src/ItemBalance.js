
// import './main.css';

import  { useState,useEffect } from 'react';
import React from "react";
import './itemBalance.css';

import {
  BrowserRouter as Router,    
  Link,useParams
} from "react-router-dom";

function ItemBalance() {

  let { category,subcategory,item } = useParams();
  
  const [total, getTotal] = useState(0);  
  const [minimum, setMinimum] = useState(0); 
  const [duration, setDuration] = useState(0);  
  const [dateAdded, setDateAdded]=useState('');
  const [transaction,getTransaction]=useState(0);
  const [modalMessage, setModalMessage]=useState('');
  const [notifications, setNotifications]=useState('');
  const [autolist,setAutoList]=useState('');
  const [isFavourites,setFavourites]=useState('');


  let household=localStorage.getItem('household');
  let username=localStorage.getItem('username');
  let email=localStorage.getItem('email');
  
  function fTotal(n){
    if((total+n)>=0){
      getTotal(total+n);
      getTransaction(transaction+n);
    }
  }

 function showModal(n){
    let modal=document.getElementById('modal'); 
       
    let subMenuButtons=document.getElementsByClassName('submenu-button');
    if(n==0){               
      toggleNotifications('off',function(result){
          if(result==true){
            setModalMessage('Notifications are disabled for this item'); 
            toggleModal();            
          }
        });

    }
    if (n==1){
         
      toggleNotifications('on',function(result){
        if(result==true){
          setModalMessage('Notifications are enabled for this item');
          toggleModal();            
        }
      });
      
    }
    if (n==2){

      toggleAutolist('off',function(result){
        if(result==true){
          setModalMessage('Auto add-to-shopping-list is disabled for this item');
          toggleModal();            
        }
      });
      
    }
    if (n==3){
      toggleAutolist('on',function(result){
        if(result==true){
          setModalMessage('Auto add-to-shopping-list is enabled for this item');
          toggleModal();            
        }
      });
    }

    if (n==4){

      toggleFavourites('off',function(result){
        if(result==true){
          setModalMessage('Item removed from favourites');
          toggleModal();            
        }
      });            
    }

    if (n==5){
      toggleFavourites('on',function(result){
        if(result==true){
          setModalMessage('Item added to favourites');
          toggleModal();            
        }
      });   
    }

    function toggleModal(){
      modal.style.display='flex';
      setTimeout(() => {
        modal.style.opacity='1';
        modal.style.transform='translateY(0)';
        disableButtons();  
        setTimeout(() => {
          modal.style.opacity='0';   
          modal.style.transform='translateY(-10px)';  
          enableButtons();             
        }, 1500); 
        setTimeout(() => {
          modal.style.display='none';   
        }, 2000);               
      }, 100);
    }


    function toggleNotifications(n,callback){         
      //send request to toggle notifications for specific item      
      let data=`household=${household}&category=${category}&subcategory=${subcategory}&item=${item}&notifications=${n}&email=${email}&username=${username}`;

      let request=new XMLHttpRequest();                    
        request.open('POST','http://localhost:8080/api/putNotifications');  
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(data);

        request.onload = function (){                    
            if(this.status==200){
              getItemData();
              callback(true);
            }
        }
    }

    function toggleAutolist(l,callback){
      //send request to toggle autolist for specific item      
      let data=`household=${household}&category=${category}&subcategory=${subcategory}&item=${item}&autolist=${l}&total=${total}&minimum=${minimum}&email=${email}&username=${username}`;

      let request=new XMLHttpRequest();                    
        request.open('POST','http://localhost:8080/api/putAutolist');  
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(data);

        request.onload = function (){                    
            if(this.status==200){
              getItemData();
              callback(true);
            }
        }
    }

    function toggleFavourites(f,callback){
      //send request to toggle favourites for specific item      
      let data=`household=${household}&category=${category}&subcategory=${subcategory}&item=${item}&favourites=${f}&email=${email}&username=${username}`;

      let request=new XMLHttpRequest();                    
        request.open('POST','http://localhost:8080/api/putFavourites');  
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(data);

        request.onload = function (){                    
            if(this.status==200){
              getItemData();
              callback(true);
            }
        }
    }


    

 } 


 function disableButtons(){
    
  document.getElementById('submenu-container').style.display='none';
 }

 function enableButtons(){
  document.getElementById('submenu-container').style.display='block';
 }


 function getItemData(){

    //get the stock total for this item
    let household=localStorage.getItem('household');
    let path='http://localhost:8080/api/getBalance?household='+
        household+'&category='+category+'&subcategory='+subcategory+
        '&item='+item+'&email='+email+'&username='+username;
    
    var xhttp = new XMLHttpRequest();    
    xhttp.open("GET", path);
    xhttp.send();

    xhttp.onload = function() {

      let response=JSON.parse(this.responseText);
      let total=parseInt(response.total);
      let minimum=parseInt(response.minimum);
      let duration=response.duration;
      if(duration!='No expiration'){
        duration=parseInt(duration);
      }      
      let notifications=response.notifications;
      let autolist=response.autolist;
      let favourites=response.favourites;
      let dateAdded=response.dateAdded;

        
      setNotifications(notifications);
      setAutoList(autolist);
      setFavourites(favourites);
      setDuration(duration);
      getTotal(total);
      setMinimum(minimum);
      setDateAdded(dateAdded);
    };

 }


  useEffect(() => {
  isLoggedIn(); 
   
    },[]);


  function isLoggedIn(){
      if(localStorage.getItem('username')==null){
        localStorage.clear();
        window.location.href = "/";
      }
      else{      
        getItemData(); 
      }
  }  

  return (        
    <main className='container'>

        <div className='row'>
              <Link to={'/stock-category/'+category+'/'+subcategory} className='col-12'><i class="fas fa-caret-left"></i></Link>              
        </div>
        
        <div className='row top1' id='submenu-container'> 
            <div className='col-12 green'><b> {item} </b><span className='lightgrey'> |stock</span>
              {
                notifications=='on' &&
                <button type='button' className='left2 green submenu-button' title='Notifications are enabled for this item' onClick={()=>{
                  showModal(0)
                  }} >
                <small class="fas fa-bell"></small>
              </button>   
              
              }

              {
                notifications=='off' &&
                <button type='button' className='left1 lightgrey submenu-button' title='Notifications are disabled for this item' onClick={()=>{
                showModal(1)
                 }}>
                 <small class="fas fa-bell-slash"></small>
              </button>   }  

              { autolist=='on' &&
                <button type='button' className='left1 green submenu-button' title='Auto add-to-shopping-list is enabled for this item' onClick={()=>{
                showModal(2)
                }}>
                <small class="fas fa-tasks"></small>
              </button>      }

              { autolist=='off' &&
                <button type='button' className='left1 lightgrey submenu-button' title='Auto add-to-shopping-list is disabled for this item' onClick={()=>{
                showModal(3)
                }}>
                <small class="fas fa-tasks"></small>
              </button>  }

               {  isFavourites=='on' &&
                 <button type='button' className='left1 green submenu-button' title='Click to remove item from favourites' onClick={()=>{
                showModal(4)
                }}><small class="fas fa-star"></small>
              </button>}
              
              { 
                isFavourites=='off' &&
                <button type='button' className='left1 lightgrey submenu-button' title='Click to add item to favourites' onClick={()=>{
                showModal(5)
               }}><small class="fas fa-star"></small>
              </button>   }                  
            </div>
            
              
            
        </div>

        <form method='post' action='http://localhost:8080/api/putBalance' className='row top1' id='form_ItemBalance'>
            <input className='hidden' type='text' name='household' id='household' value={household}></input>  
            <input className='hidden' type='text' name='item' id='item' value={item}></input>
            <input className='hidden' type='text' name='category' id='category' value={category}></input>
            <input className='hidden' type='text' name='subcategory' id='subcategory' value={subcategory}></input>
            <input className='hidden' type='text' name='autolist' id='autolist' value={autolist}></input>  
            <input className='hidden' type='text' name='deleted' id='deleted' value='false'></input>
            <input className='hidden' type='text' name='transaction' id='transaction' value={transaction}></input>
            <input className='hidden' type='text' name='duration' id='duration' value={duration}></input>  
            <input className='hidden' type='text' name='dateAdded' id='dateAdded' value={dateAdded}></input>  
            <input className='hidden' type='text' name='email' id='email' value={email}></input>  
            <input className='hidden' type='text' name='username' id='username' value={username}></input>  

            <label for='total' className='col-12 grey'>Total in stock
                <input className='hidden' type='text' name='total' id='total' value={total}></input>
                <input className='hidden' type='text' name='minimum' id='minimum' value={minimum}></input>
                <div className='col-12 black'> {total}</div>
            </label>      

            <div className='top1'>
                    <button type='button' className='btn  button-secondary2' onClick={()=>{fTotal(-5)}}>-5</button>
                    <button type='button' className='btn  button-secondary2 left1'  onClick={()=>{fTotal(-1)}}>-1</button>                        
                    <button type='button' className='btn  button-secondary left1'  onClick={()=>{fTotal(1)}}>+1</button>
                    <button type='button' className='btn  button-secondary left1'  onClick={()=>{fTotal(5)}}>+5</button>                                                            
            </div>  

            { transaction!=0 &&
            <div className='top2'>                
              <button  className='col-3 col-lg-1  btn btn-primary'><b>Save</b></button>
            </div>   }           
        </form>

        
        <div className='modals  vertical-centre centre' id='modal'>
          <div className='col-12'>
            <b><p>{modalMessage}</p></b>
            
          </div>
        </div>
        
    </main>            
  );
}

export default ItemBalance;
