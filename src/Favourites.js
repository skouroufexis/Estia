
import './favourites.css';
import  { useState,useEffect } from 'react';

import React from "react";

import {BrowserRouter as Router,Link,useParams} from "react-router-dom";


function Favourites() {

  const [all_Favourites, getAll_Favourites] = useState('');
  const [selectedItem,selectItem]=useState('');
  const [selectedCategory,selectCategory]=useState('');
  const [selectedSubcategory,selectSubcategory]=useState('');
  
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
      getFavourites();
    }
}


  //read items from file
  function getFavourites(){
    
    let items=[];
    var xhttp = new XMLHttpRequest();
    
    let household=localStorage.getItem('household');
    let username=localStorage.getItem('username');
    let email=localStorage.getItem('email');

    let path='http://localhost:8080/api/getFavourites?household='+household+'&username='+username+'&email='+email;
    xhttp.open("GET",path );
    xhttp.send();
    xhttp.onload = function(){
      if(this.status!=200){
        console.log(this.responseText);
      }
      else{
        let response=JSON.parse(this.responseText);
        console.log(response);
        getAll_Favourites(response);        
      }
    }
  }

  function getCategory(category){
    if(category=='groceries'){
        return 0;
    }
    else{
        return 1;
    }
  }

  function getSubcategory(category,subcategory){                
        if(category=='0'){
        if(subcategory=='1'){
            return 'Fruit - Vegetables';
        }
        else if (subcategory=='2'){
            return 'Meat - Fish';
        }
        else if (subcategory=='3'){
            return 'Bakery';
        }
        else if (subcategory=='4'){
            return 'Milk - Dairy';
        }
        else if (subcategory=='5'){
            return 'Salumi';
        }
        else if (subcategory=='6'){
            return 'Dry Food';
        }
        else if (subcategory=='7'){
            return 'Beverages';
        }
        else if (subcategory=='8'){
            return 'Salt - Spices';
        }
        else if (subcategory=='9'){
            return 'Glucose';
        } 
        else if (subcategory=='10'){
            return 'Coffee - Tea';
        }
        else if (subcategory=='11'){
            return 'Snacks';
        }
        else if (subcategory=='12'){
            return 'Other';
        }
  
     }
  
    //household
    else{
      if(subcategory=='1'){
        return 'Cleaning';
      }
      else if (subcategory=='2'){
        return 'Hugiene';
      }
      else if (subcategory=='3'){
        return 'Plastics';
      }
      else if (subcategory=='4'){
        return 'Paper';
      }
      else if (subcategory=='5'){
        return 'Cosmetics';
      }
      else if (subcategory=='6'){
        return 'Other';
      }
      
    }
    
  }

  //gets items from file and creates list of favourites         
  function getItems(all_Favourites){
    if(all_Favourites!='')
    {  
      let itemsList=[];
      let l=all_Favourites.length;      
      let c;
      for(c=0;c<l;c++){            
        let  favourites= all_Favourites[c].split(',')
          let item=favourites[0];
          let category=getCategory(favourites[1]);          
          let subcategory = getSubcategory(category, favourites[2]);   
             
          //populate list array to displayed
          itemsList.push( 
            <div className='row top1 record maincontent' key={c}>         
               <div className='col'><Link  to={'/item-balance/'+category+'/'+subcategory+'/'+item} ><p className='vertical-centre'><span className='left2'>{item}</span></p></Link></div>

                  

              <div className='col background-white '>
                  {/* <Link  to={'/item-balance/'+category+'/'+subcategory+'/'+item} ><button className='col centre btn button-secondary'>+/-</button></Link> */}
                  <Link  to={'/item-settings/'+category+'/'+subcategory+'/'+item}><button className='col-lg-3 centre btn button-secondary'><i class="fas fa-cog"></i></button></Link>
                  <Link ><button className='col-lg-3 left2 centre btn button-secondary' onClick={()=>{openConfirm(item,category,subcategory);}} ><i class="fas fa-trash-alt"></i></button></Link>
              </div>
          </div>
          );          
      }
      

      return(
        <div>
          <div className='row top2 headers'>
              <h5 className='col left maincontent'>Item</h5>              
              
          </div >  
          {itemsList}
        </div>
      );
    }else{
      return(
          <div className='row top1'>         
              <p className='col margin-v-auto  left lightgrey'>No favourites found</p>              
          </div>
      )
    }    
}

function openConfirm(item,category,subcategory){
    selectItem(item);
    selectCategory(category);
    selectSubcategory(subcategory);
    let modal=document.getElementsByClassName('modals2');
    modal=modal[0];

    modal.style.display='block';
    setTimeout(() => {
      modal.style.transform='translateY(0)';
      modal.style.opacity='1';

      let maincontent=document.getElementsByClassName('maincontent');
      let m;
      for(m of maincontent){
        m.style.opacity='0.2';          
      }        
    }, 100);
  }

  function closeModal(){
    let maincontent=document.getElementsByClassName('maincontent');
    let modal=document.getElementsByClassName('modals2');
    modal=modal[0];

    modal.style.transform='translateY(-10px)';
    modal.style.opacity='0';

    let m;
      for(m of maincontent){
        m.style.opacity='1';          
      }        

    setTimeout(() => {       
      modal.style.display='none';        
    }, 100);
  }

  function confirmDelete(response){
      
    closeModal();
    // //handle response
    let item=selectedItem;
    let category=selectedCategory;
    let subcategory=selectedSubcategory;
    if(response==true){        
        
      // send request to delete item
      var xhttp = new XMLHttpRequest();
        
      xhttp.open("POST", "http://localhost:8080/api/deleteItem");
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      let data=`household=${household}&category=${category}&subcategory=${subcategory}&item=${item}&username=${username}&email=${email}`;
      
      xhttp.send(data);
      xhttp.onload = function() {
        if(this.status==200){          
          let origin='stock';
          let message='Item successfully deleted';
          let path='http://localhost:3000/error/'+origin+'/'+message;
          window.location.replace(path);
        }
        
      };
    }
    
  }


      
      

  return (
    
      
      <main className='container'>

        <div className='modals2'>
            <div className='row top2 modals-content'>
                <div className='col-12 centre top2'><b><p>Are you sure you want to delete this item?</p></b></div>
                <div className='col-12 centre'> <button className='col-2 btn button-secondary' onClick={()=>{confirmDelete(true)}}>Yes</button> <button className='col-2  btn button-secondary2' onClick={()=>{confirmDelete(false)}}>Cancel</button> </div>        
            </div>
        </div>  


          <div className='row left maincontent'>
              <h5 className='col'>Favourite Items</h5>
          </div>

          
          <div id='main-container_Favourites' className='maincontent'>
            {getItems(all_Favourites)}            
          </div>

          { all_Favourites!='' &&
            <div className='row maincontent'>
              <div className='col lightgrey'><small className='left1'>scroll down to see more items</small></div>
            </div>
          }
      </main>    
  );
}

export default Favourites;
