
// import './main.css';

import  { useState,useEffect } from 'react';
import React from "react";
import './itemNew.css';

import {
  BrowserRouter as Router,    
  Link,useParams
} from "react-router-dom";


function ItemNew() {

  let { category } = useParams();
  let { subcategory } = useParams();

  const [selected_ItemNew, select_ItemNew] = useState(0);
  const [total_ItemNew, setTotal_ItemNew] = useState(0);
  const [minimum_ItemNew, setMinimum_ItemNew] = useState(0);
  const [duration_ItemNew, setDuration_ItemNew] = useState(0);
  const [notifications, setNotifications] = useState('on');
  const [autoList, setAutolist] = useState('on');
  const [favourites, setFavourites] = useState('off');
  
  let household=localStorage.getItem('household');
  let username=localStorage.getItem('username');
  let email=localStorage.getItem('email');
  function enableNext_ItemNew(e){
      
    if(e.target.value.trim()!=''){
        document.getElementById('button-next_ItemNew').disabled=false;
    }
    else{
        document.getElementById('button-next_ItemNew').disabled=true;
    }
  }

  

  useEffect(() => {
        
    isLoggedIn();
   
    });

    function isLoggedIn(){

        
          if(localStorage.getItem('username')==null||localStorage.getItem('username')=='null'){
              localStorage.clear();
              window.location.href = "/";
          }      
        else{
            let containers= document.getElementsByClassName('form-field-container_ItemNew');
            let l= containers.length;
            let c;
                for (c=0;c<l;c++){
                 containers[c].classList.add('hidden');
                }
            containers[selected_ItemNew].classList.remove('hidden');
            
            if(notifications=='on'){
                document.getElementById('checkbox-notifications').checked=true;
            }
        
            if(autoList=='on'){
                document.getElementById('checkbox-autolist').checked=true;
            }

            disableNext();
        }
      
    }


    
    function disableNext(){

        let fields=document.getElementsByClassName('field_ItemNew');
        if(fields[selected_ItemNew].value==''){
            document.getElementById('button-next_ItemNew').disabled=true;
        }
        else{
            document.getElementById('button-next_ItemNew').disabled=false;
        }

        if(selected_ItemNew==0){
            document.getElementById('button-previous_ItemNew').style.opacity='0.3';
        }
        else{
            document.getElementById('button-previous_ItemNew').style.opacity='1';
        }
        
        
    }

    function next_ItemNew(){
        
        if(selected_ItemNew<6){
            select_ItemNew(selected_ItemNew+1);
            
        }

        if(selected_ItemNew==5){
            document.getElementById('button-done_ItemNew').style.display='block';
            document.getElementById('button-next_ItemNew').style.opacity='0.3';
            
        }
        

    }

    function previous_ItemNew(){
        document.getElementById('button-done_ItemNew').style.display='none';
        document.getElementById('button-next_ItemNew').style.opacity='1';
        if(selected_ItemNew>0){
            select_ItemNew(selected_ItemNew-1);
        }

        
        
    }

    function totalStock(n){
        if((total_ItemNew+n)>=0){
            setTotal_ItemNew(total_ItemNew+n);
            
        }
    }

    function minimumStock(n){
        if((minimum_ItemNew+n)>=0){
            setMinimum_ItemNew(minimum_ItemNew+n);
            
        }
    }

    function duration(n){

        if(n=='No expiration'){
            setDuration_ItemNew(n);
        }

        else{

            if(duration_ItemNew=='No expiration'){
                setDuration_ItemNew(0);
                if((0+n)>=0){
                    setDuration_ItemNew(0+n);
                    
                }
            }

            else{
                if((duration_ItemNew+n)>=0){
                    setDuration_ItemNew(duration_ItemNew+n);                    
                }
            }

        }
        
    }

    function toggleNotifications(){
        if(notifications=='on'){
            setNotifications('off');
        }
        else{
            setNotifications('on');
        }
    }

    function toggleAutolist(){
        if(autoList=='on'){
            setAutolist('off');
        }
        else{
            setAutolist('on');
        }
    }

    function toggleFavourites(){
        if(favourites=='on'){
            setFavourites('off');
        }
        else{
            setFavourites('on');
        }
    }

    function submitForm_ItemNew(){
       
        document.getElementById('form_ItemNew').submit();
        
    }


  return (        
    <main className='container'>

        <div className='row'>
              <Link to={'/stock-category/'+category+'/'+subcategory} className='col-12'><i class="fas fa-caret-left"></i></Link>              
        </div>
        
        <div className='row top1'>
            <div className='col green'><b>New item</b><span className='lightgrey'> |{subcategory}</span></div>
        </div>

        <form method='post' action='http://localhost:8080/api/postItem' className='row top1' id='form_ItemNew' >
            <input type='text' className='hidden' name='household' value={household}></input> 
            <input type='text' className='hidden' name='category' value={category}></input> 
            <input type='text' className='hidden' name='subcategory' value={subcategory}></input> 
            <input type='text' className='hidden' name='deleted' value={'false'}></input> 
            <input type='text' className='hidden' name='email' value={email}></input> 
            <input type='text' className='hidden' name='username' value={username}></input> 

            <div className='col-12 form-field-container_ItemNew'>
                <label className='col-11 grey label_ItemNew'>Name
                    <input type='text' className='col-12 top1 field_ItemNew' id='name' name='item' onKeyUp={(e)=>{enableNext_ItemNew(e)}}></input>                    
                </label>
                
            </div>

            <div className='col-12  form-field-container_ItemNew hidden'>
                <label className='col-11 grey label_ItemNew'>Total in stock
                    <div  className='col-12 field_ItemNew top1'  id='total'><b>{total_ItemNew}</b></div>
                    <input type='text' className='hidden' name='total' value={total_ItemNew}></input> 
                    <div className='top1'>
                        <button type='button' className='btn  button-secondary2' onClick={()=>{totalStock(-5)}}>-5</button>
                        <button type='button' className='btn  button-secondary2 left1'  onClick={()=>{totalStock(-1)}}>-1</button>                        
                        <button type='button' className='btn  button-secondary left1'  onClick={()=>{totalStock(1)}}>+1</button>
                        <button type='button' className='btn  button-secondary left1'  onClick={()=>{totalStock(5)}}>+5</button>
                    </div>
                </label>
                
            </div>

            <div className='col-12  form-field-container_ItemNew hidden'>
                <label className='col-11 grey label_ItemNew'>Minimum quantity allowed (units, packs)
                <div  className='col-12 field_ItemNew top1' id='minimum'><b>{minimum_ItemNew}</b></div>
                <input type='text' className='hidden' name='minimum' value={minimum_ItemNew} ></input>
                <div className='top1'>
                    <button type='button' className='btn  button-secondary2' onClick={()=>{minimumStock(-5)}}>-5</button>
                    <button type='button' className='btn  button-secondary2 left1'  onClick={()=>{minimumStock(-1)}}>-1</button>                        
                    <button type='button' className='btn  button-secondary left1'  onClick={()=>{minimumStock(1)}}>+1</button>
                    <button type='button' className='btn  button-secondary left1'  onClick={()=>{minimumStock(5)}}>+5</button>
                </div>                    
                </label>
                
            </div>

            

            <div className='col-12  form-field-container_ItemNew hidden'>
                <label className='col-11 grey label_ItemNew'>Duration (days)
                <div  className='col-12 field_ItemNew top1' id='duration'><b>{duration_ItemNew}</b></div>
                <input type='text' className='hidden' name='duration' value={duration_ItemNew}></input>
                <div className='top1'>
                    <button type='button' className='btn  button-secondary2' onClick={()=>{duration(-5)}}>-5</button>
                    <button type='button' className='btn  button-secondary2 left1'  onClick={()=>{duration(-1)}}>-1</button>                        
                    <button type='button' className='btn  button-secondary left1'  onClick={()=>{duration(1)}}>+1</button>
                    <button type='button' className='btn  button-secondary left1'  onClick={()=>{duration(5)}}>+5</button>
                    <button type='button' className='btn  button-secondary left1'  onClick={()=>{duration('No expiration')}}><i class="fas fa-infinity"></i></button>
                </div>  
                </label>
                
            </div>

            <div className='col-12  form-field-container_ItemNew hidden'>
                <label className='col-11 grey label_ItemNew'>Notifications 
                     <input type='text' className='hidden' name='notifications' value={notifications}></input>
                    <div  className='col-12 field_ItemNew top1' id='notifications'><b>{notifications}</b></div>                
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id='checkbox-notifications' onChange={()=>{toggleNotifications()}} />                        
                    </div>
                </label>                
            </div>

            <div className='col-12  form-field-container_ItemNew hidden'>
                <label className='col-11 grey label_ItemNew'>Auto add to shopping-list
                <input type='text' className='hidden' name='autolist' value={autoList}></input>
                    <div  className='col-12 field_ItemNew top1' id='autolist'><b>{autoList}</b></div>                
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id='checkbox-autolist'  onChange={()=>{toggleAutolist()}} />                        
                    </div>
                </label>                
            </div>

            <div className='col-12  form-field-container_ItemNew hidden'>
                <label className='col-11 grey label_ItemNew'>Add to favourites
                <input type='text' className='hidden' name='favourites' value={favourites}></input>
                    <div  className='col-12 field_ItemNew top1' id='favourites'><b>{favourites}</b></div>                
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id='checkbox-favourites'  onChange={()=>{toggleFavourites()}} />                        
                    </div>
                </label>                
            </div>

        </form>

        <div className='row top1'>
            <button id='button-previous_ItemNew' className='col-1 ' onClick={()=>{previous_ItemNew()}}><i class="fas fa-angle-left "></i></button>
            <button id='button-next_ItemNew' className='col-1 left2' onClick={()=>{next_ItemNew()}}><i class="fas fa-angle-right"></i></button>
            <button className='col-3 col-lg-1 left2  btn btn-primary' id='button-done_ItemNew' onClick={()=>{submitForm_ItemNew()}}><b>Done</b></button>
        </div> 
        
        
    </main>            
  );
}

export default ItemNew;
