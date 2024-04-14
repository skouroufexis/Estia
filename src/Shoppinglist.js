
import './shoppinglist.css';
import  { useState,useEffect } from 'react';
import {BrowserRouter as Router,Link,useParams} from "react-router-dom";
import React from "react";


function Shoppinglist() {
  const [all_Shoppinglist, getAll_Shoppinglist] = useState('');
  const[modalTitle,setModalTitle]=useState('');
  const[total,setTotal]=useState(0);
  const [seletedItem,setSelectedItem]=useState('');
  const [itemToRemove,setItemToRemove]=useState({});
  const [itemsBought,setItemsBought]=useState([]);
  let household=localStorage.getItem('household');
  let username=localStorage.getItem('username');
  let email=localStorage.getItem('email');  
  
  useEffect(()=>{

    isLoggedIn();
    
    // getNotifications();          
  },[all_Shoppinglist.length]);

  function isLoggedIn(){

           
      if(localStorage.getItem('username')==null||localStorage.getItem('username')=='null'){
          localStorage.clear();
          window.location.href = "/";
      } 
      else{
        getShoppinglist(function(result,data){
          if(result==true){
            getAll_Shoppinglist(data);
            console.log(data);
            if(all_Shoppinglist!=''){
              let c; 
              
              let items=[];
              for(c=0;c<all_Shoppinglist.length;c++){
                items.push({itemTotal:0,item:'',category:'',subcategory:''});            
              }
    
              setItemsBought(items);
              
            }
          }
          else{
            console.log(data);
          }
        });
      }            
}  

  

  function getShoppinglist(callback){
    
    var xhttp = new XMLHttpRequest();
    
    let path='http://localhost:8080/api/getShoppinglist?household='+household+'&email='+email+'&username='+username;
    xhttp.open("GET",path );
    xhttp.send();
    xhttp.onload = function(){
      if(this.status!=200){
        console.log(this.responseText);
        callback(false,this.responseText);
      }
      else{
        let response=JSON.parse(this.responseText);
        console.log(response);
        callback(true,response)
          
        
      }
    }
  }

  //gets items from file and creates list of products         
  function getItems(all_Shoppinglist){
    if(all_Shoppinglist!='')
    {  

      let itemsList=[];      
      let l=all_Shoppinglist.length;      
      let c;
      for(c=0;c<l;c++){
        let counter=c;
      
        let  shoppinglist= all_Shoppinglist[c].split(',')
          let item=shoppinglist[0];          
          let category=shoppinglist[1];
          let subcategory=shoppinglist[2];
          
          
          //convert category & subcategory numerical and literal value respectively (to be used as parameters for the link later on)
          category=getCategory(category);          
          subcategory=getSubcategory(category,subcategory);
        
          //populate list array to displayed                               
                itemsList.push(
                
                  <div className='row top1 record' key={c}>         
                    <div className='col-6    margin-v-auto left vertical-centre'><small>{item}</small></div>                                                      
                    <div className='col   background-white left'>
                      <button className='col col-lg-8 btn    button-secondary' onClick={()=>{shop(counter,item,category,subcategory);}}><i class="fas fa-cart-arrow-down"></i></button>
                     {itemsBought!='' && <button className='col  green btn'><b><small>{itemsBought[counter].itemTotal}</small> </b></button>}                      
                    </div>
                    <div className='col  background-white centre'>
                      <button className='col-12  btn button-secondary2' onClick={()=>{remove(item,category,subcategory);}}><i class="fas fa-minus-circle"></i></button>
                    </div>

                  </div>

              );

      }
      

      return(
        <div>
          <div className='row top2 headers sticky-top'>
              <h6 className='col left'>Item</h6>              
              <h6 className='col left'></h6>
          </div>
          {itemsList}
        </div>
      );
    }else{
      return(
          <div className='row top1'>         
              <p className='col margin-v-auto  left lightgrey'>Your shopping list is empty</p>              
          </div>
      )
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

function shop(counter,item,category,subcategory){

  //the calculator will know which record from itemsBought to change
  setSelectedItem(counter);

  setTotal(itemsBought[counter].itemTotal);
  itemsBought[counter].item=item;
  itemsBought[counter].category=category;
  itemsBought[counter].subcategory=subcategory;
  
  
  let modal=document.getElementsByClassName('modals2');
  modal=modal[0];

      modal.style.display='block';
      setTimeout(() => {
        modal.style.transform='translateY(0)';
        modal.style.opacity='1';
        setModalTitle(item);  
        let maincontent=document.getElementsByClassName('maincontent');
        let m;
        for(m of maincontent){
          m.style.opacity='0.2';          
        }        
      }, 100);
}

function remove(item,category,subcategory){
  
  setItemToRemove({item:item,category:category,subcategory:subcategory});

  let modal=document.getElementsByClassName('modals2');
  modal=modal[1];

      modal.style.display='block';
      setTimeout(() => {
        modal.style.transform='translateY(0)';
        modal.style.opacity='1';
        setModalTitle(item);  
        let maincontent=document.getElementsByClassName('maincontent');
        let m;
        for(m of maincontent){
          m.style.opacity='0.2';          
        }        
      }, 100);
}

function closeModal(n){  
  let maincontent=document.getElementsByClassName('maincontent');
  let modal=document.getElementsByClassName('modals2');
  modal=modal[n];

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

function confirmShop(){
  //number inside closeModal() function denotes which modal will be closed    
  closeModal(0);
  
}

function confirmRemove(response){
  //number inside closeModal() function denotes which modal will be closed
  closeModal(1);
  
  //user confirms that they will remove item from shopping list
  if(response==true){
    
    let item=itemToRemove.item;
    let category=itemToRemove.category;
    let subcategory=itemToRemove.subcategory;
    
    //remove item from shopping list

     //send request for updating the stock
  //POST REQUEST WITH FORM DATA
  let request=new XMLHttpRequest();                
  request.open('POST','http://localhost:8080/api/deleteShoppingList');

  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  let data=`household=${household}&item=${item}&category=${category}&subcategory=${subcategory}&email=${email}&username=${username}`;
  request.send(data);                  

  request.onload = function (){        
      
      if(this.status==200){
        console.log(this.responseText);
        
        getShoppinglist(function(result,data){
          if(result==true){
            getAll_Shoppinglist(data);
            console.log(data);
            if(all_Shoppinglist!=''){
              let c; 
              
              let items=[];
              for(c=0;c<all_Shoppinglist.length;c++){
                items.push({itemTotal:0,item:'',category:'',subcategory:''});            
              }
    
              setItemsBought(items);
              
            }
          }
          else{
            console.log(data);
          }
        });


      }
      
  };  



  }

  else{
    setItemToRemove({});
  }
  

}

function fTotal(n){
  if((total+n)>=0){
    setTotal(total+n);        

    itemsBought[seletedItem].itemTotal=itemsBought[seletedItem].itemTotal+n;
    

    // getTransaction(transaction+n);
  }
}

function checkout(){
  //send request for updating the stock
  //POST REQUEST WITH FORM DATA
  let request=new XMLHttpRequest();                
  request.open('POST','http://localhost:8080/api/putStock');

  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  let data=`itemsBought=${JSON.stringify(itemsBought)}&household=${household}&email=${email}&username=${username}`;
  
  request.send(data);                  

  request.onload = function (){        
      
      if(this.status==200){
        let response=JSON.parse(this.responseText);        
        window.location.replace(response.path);
      }
      
  };

  
}

  return (
    
      
      <main className='container'>


        {/* MODAL */}
        <div className='modals2'>
          <div className='row top2 modals-content'>
              <div className='col-12 centre top2'><b><p> {modalTitle} </p></b></div>

              <div className='col-12  centre'>
                    <div className='col-12 green'> <b>{total}</b></div>
                    <div className='top1'>
                      <button type='button' className='btn  button-secondary2' onClick={()=>{fTotal(-5)}} >-5</button>
                      <button type='button' className='btn  button-secondary2 left1' onClick={()=>{fTotal(-1)}} >-1</button>                        
                      <button type='button' className='btn  button-secondary left1' onClick={()=>{fTotal(1)}} >+1</button>
                      <button type='button' className='btn  button-secondary left1' onClick={()=>{fTotal(5)}} >+5</button>  
                    </div>                                                          
              </div>  

              <div className='col-12 top2 centre'> 
                <button className='btn btn-primary' onClick={()=>{confirmShop()}}>OK</button>                 
              </div>            
                       
          </div>

        </div> 

        <div className='modals2'>
          <div className='row top2 modals-content'>
              <div className='col-12 centre top2'><b><p> Removing this item will also disable it from being automatically added to the shopping list </p></b></div>
              <div className='col-12 top2 centre'> 
                <button className='top1 col-10 col-lg-1 btn btn-primary' onClick={()=>{confirmRemove(true)}}>OK</button>
                <button className='top1 col-10 col-lg-1 btn btn-primary2' onClick={()=>{confirmRemove(false)}}>Cancel</button>                 
              </div>            
                       
          </div>
        </div> 


          <div className='row left maincontent'>
              <h5 className='col left'>Shopping List</h5>
          </div>         
          <div className='maincontent' id='main-container_Shoppinglist'>
            {getItems(all_Shoppinglist)}            
          </div>

          { all_Shoppinglist!='' &&
            <div className='row maincontent'>
              <div className='col lightgrey'><small className='left1'>scroll down to see more items</small></div>
            </div>
          }

          { all_Shoppinglist!='' &&  
            <div className='row top2 maincontent'>
                {/* <div className='col-6 border right'></div> */}
                <div className='col top2 right'>
                  <button className='col-12 col-lg-6  btn btn-primary' onClick={()=>{
                    checkout();
                  }}><b>Done</b></button>
                </div>
            </div>
          } 
      </main>    
  );
}

export default Shoppinglist;
