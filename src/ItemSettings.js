
// import './main.css';

import  { useState,useEffect } from 'react';
import React from "react";
import './itemSettings.css';

import {
  BrowserRouter as Router,    
  Link,useParams
} from "react-router-dom";

function ItemSettings() {

  let { category,subcategory,item } = useParams();
    
  const [newItemName, setNewItemName] = useState('');  
  const [index,setIndex]=useState(1);
  const [minimum,setMinimum]=useState(0);
  const [total,setTotal]=useState(0);
  const [duration,setDuration]=useState(0);
  const [notifications,setNotifications]=useState('');
  const [autolist,setAutolist]=useState('');
  const [favourites,setFavourites]=useState('');
  

  
  let household=localStorage.getItem('household');
  let username=localStorage.getItem('username');
  let email=localStorage.getItem('email');
  let deleted='false';
  
  function setNewItemNamef(){
      let input=document.getElementById('item');
      setNewItemName(input.value.trim());
      
  }  
 
  function setIndexf(n){
      
      if ((index+n)<=6 && (index+n)>0){
        setIndex(index+n)
      }
  }


  function setMinimumf(n){
    if((minimum+n)>=0){
      setMinimum(minimum+n);
    }
  }

  function setDurationf(n){
    if(n=='No expiration'){
      setDuration(n);
    }
    else{
      if(duration=='No expiration'){
        if(n>0){
          setDuration(n);
        }
        
      }
      else{
        if((duration+n)>=0){
          setDuration(duration+n);
        }
      }
    }
    
  }

  function submitForm(){
    
    let data=`household=${household}&category=${category}&subcategory=${subcategory}&item=${item}&newitem=${newItemName}&total=${total}&minimum=${minimum}&duration=${duration}&deleted=${deleted}&notifications=${notifications}&autolist=${autolist}&favourites=${favourites}&email=${email}&username=${username}`;
    let request=new XMLHttpRequest();                    
        request.open('POST','http://localhost:8080/api/putItem');  
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(data);

        request.onload = function (){                    
            if(this.status==200){
              let origin='stock';
              let message='Item settings successfully modified';
              let path='http://localhost:3000/error/'+origin+'/'+message
              window.location.replace(path);
              
            }
        }

  }


  function setNotificationsf(){
    if(notifications=='on'){
      setNotifications('off')
    }
    else{
      setNotifications('on');
    }
  }

  function setAutolistf(){
    if(autolist=='on'){
      setAutolist('off')
    }
    else{
      setAutolist('on');
    }
  }

  function setFavouritesf(){
    if(favourites=='on'){
      setFavourites('off')
    }
    else{
      setFavourites('on');
    }
  }

  


  useEffect(() => {    
    isLoggedIn();  
  },[]);


  function isLoggedIn(){

            
      if(localStorage.getItem('username')==null||localStorage.getItem('username')=='null'){
          localStorage.clear();
          window.location.href = "/";
      }      
    
    else{
      let household=localStorage.getItem('household');    
      setNewItemName(item);
      
      //get item information
      let path='http://localhost:8080/api/getSingleItem?household='+
                household+'&category='+category+
                '&subcategory='+subcategory+'&item='+item+'&email='+email+'&username='+username;;
      var xhttp = new XMLHttpRequest();
      
      xhttp.open("GET", path);
      xhttp.send();
  
      xhttp.onload = function() {
        if(this.status==200){
          let response=JSON.parse(this.responseText);
              let fields=response[0].split(',');
              
          //populate constant with saved values
          setMinimum(parseInt(fields[2]));
          setTotal(parseInt(fields[1]));
          
          if(fields[3]=='No expiration'){
            setDuration(fields[3]);
          }
          else{
            setDuration(parseInt(fields[3]));
          }
          setNewItemName(fields[0]);        
          setNotifications(fields[5]);          
          setAutolist(fields[6]);
          setFavourites(fields[7]);
        }
        
      };
    }
  
}

  return (        
    <main className='container'>
        
        <div className='row'>
              <Link to={'/stock-category/'+category+'/'+subcategory} className='col-12'><i class="fas fa-caret-left"></i></Link>              
        </div>
        
        <div className='row top1'> 
            <div className='col-12 green'><b> {item} </b><span className='lightgrey'> |settings</span>           
            </div>            
        </div>
         
        <form className='row' id='form_ItemSettings'>
            {index==1 &&
            <label className='col-12 top1 grey'>Item Name
                <input className='col-12' name='item' id='item' value={newItemName}  onChange={()=>{
                    setNewItemNamef();    
                }}></input>
            </label>  }

               {index==2 && <label className='col-12 top1 grey '>Minimum quantity allowed
                    <div  className='col-12 top1 ' id='minimum'><b>{minimum}</b></div>
                    <input type='text' className='hidden' name='minimum' value={minimum} ></input>
                    <div className='top1'>
                        <button type='button' className='btn  button-secondary2' onClick={()=>{setMinimumf(-5)}}>-5</button>
                        <button type='button' className='btn  button-secondary2 left1'  onClick={()=>{setMinimumf(-1)}}>-1</button>                        
                        <button type='button' className='btn  button-secondary left1'  onClick={()=>{setMinimumf(1)}}>+1</button>
                        <button type='button' className='btn  button-secondary left1'  onClick={()=>{setMinimumf(5)}}>+5</button>
                    </div>    
                </label>}


                {
                  index==3 &&
                  <label className='col-12 top1 grey'>Duration (days)
                  <div  className='col-12 field_ItemNew top1' id='duration'><b>{duration}</b></div>
                  <input type='text' className='hidden' name='duration' value={duration}></input>
                  <div className='top1'>
                      <button type='button' className='btn  button-secondary2' onClick={()=>{setDurationf(-5)}}>-5</button>
                      <button type='button' className='btn  button-secondary2 left1'  onClick={()=>{setDurationf(-1)}}>-1</button>                        
                      <button type='button' className='btn  button-secondary left1'  onClick={()=>{setDurationf(1)}}>+1</button>
                      <button type='button' className='btn  button-secondary left1'  onClick={()=>{setDurationf(5)}}>+5</button>
                      <button type='button' className='btn  button-secondary left1'  onClick={()=>{setDurationf('No expiration')}}><i class="fas fa-infinity"></i></button>
                  </div>  
                  </label>
                }

                {(index==4 && notifications=='on') &&
                  <label className='col-12 grey top1'>Notifications  {notifications}
                     <input type='text' className='hidden' name='notifications' value={notifications}></input>
                    <div  className='col-12 top1' id='notifications'><b>{notifications}</b></div>                
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id='checkbox-notifications' checked onChange={()=>{setNotificationsf()}} />                        
                    </div>
                </label>  
                }

                {(index==4 && notifications=='off') &&
                  <label className='col-12 grey top1'>Notifications  {notifications}
                     <input type='text' className='hidden' name='notifications' value={notifications}></input>
                    <div  className='col-12 top1' id='notifications'><b>{notifications}</b></div>                
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id='checkbox-notifications'  onChange={()=>{setNotificationsf()}} />                        
                    </div>
                </label>  
                }   

                {(index==5 && autolist=='on') &&
                
                  <label className='col-11 grey top1'>Auto add to shopping-list
                  <input type='text' className='hidden' name='autolist' value={autolist}></input>
                      <div  className='col-12 top1' id='autolist'><b>{autolist}</b></div>                
                      <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" id='checkbox-autolist' checked  onChange={()=>{setAutolistf()}} />                        
                      </div>
                  </label> 
                
                }

                {(index==5 && autolist=='off') &&
                
                <label className='col-11 grey top1'>Auto add to shopping-list
                <input type='text' className='hidden' name='autolist' value={autolist}></input>
                    <div  className='col-12 top1' id='autolist'><b>{autolist}</b></div>                
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id='checkbox-autolist'   onChange={()=>{setAutolistf()}} />                        
                    </div>
                </label> 
              
                }

                {
                  (index==6 && favourites=='on') &&
                  <label className='col-11 grey top1'>Add to favourites
                  <input type='text' className='hidden' name='favourites' value={favourites}></input>
                      <div  className='col-12 top1' id='favourites'><b>{favourites}</b></div>                
                      <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" id='checkbox-favourites' checked onChange={()=>{setFavouritesf()}} />                        
                      </div>
                  </label>  
                }

                {
                  (index==6 && favourites=='off') &&
                  <label className='col-11 grey top1'>Add to favourites
                  <input type='text' className='hidden' name='favourites' value={favourites}></input>
                      <div  className='col-12 top1' id='favourites'><b>{favourites}</b></div>                
                      <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" id='checkbox-favourites'  onChange={()=>{setFavouritesf()}} />                        
                      </div>
                  </label>  
                }


                {   (newItemName==item) &&
                    <button className='left col-1 top1 green fas fa-undo-alt invisible' type='button'></button>
                }
                {   (newItemName!=item && index==1) &&
                    <button className='left col-1 top1 green fas fa-undo-alt' type='button' onClick={()=>{
                        setNewItemName(item)
                        document.getElementById('item').value=item;
                        }}></button>
                }

        </form>

        <div className='row top1'>
            { index>1 && <button className='col-1' onClick={()=>setIndexf(-1)}><i class="fas fa-angle-left"></i></button>}
            { index==1 && <button className='col-1 invisible'></button>}
            { (newItemName!='' && index<6) &&  <button className='col-1 left2' onClick={()=>setIndexf(1)}><i class="fas fa-angle-right"></i></button>}            
        </div>

        <div className='row top2'>
            <button className='col-6 col-lg-2 btn btn-primary' onClick={()=>{
              submitForm();
            }}>Save</button>
        </div>

    </main>            
  );
}

export default ItemSettings;
