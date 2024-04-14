import  { useState,useEffect } from 'react';
import React from "react";
import {BrowserRouter as Router,Link,useParams} from "react-router-dom";

  
import './Stock.css';

function StockCategory(props) {
    
    
    let { category } = useParams();
    let { subcategory } = useParams();

    const [all_StockCategory, setAll_StockCategory] = useState('');
    const[startIndex, setStartIndex]=useState(0);    
    const [content,setContent]=useState('');
    const [selectedItem,selectItem]=useState('');

    let household=localStorage.getItem('household');
    let username=localStorage.getItem('username');
    let email=localStorage.getItem('email');

    useEffect(() => {
       isLoggedIn();             
     },[]);

     function isLoggedIn(){
      if(localStorage.getItem('username')==null||localStorage.getItem('username')=='null'){
          localStorage.clear();
          window.location.href = "/";
      } 
      else{
         ///determine folder & file path based on url parameter
         subcategory=getSubcategory(category,subcategory);        
         getContent(category,subcategory);   
      }            
  } 


    function getContent(category,subcategory){                
        let household=localStorage.getItem('household');
        var xhttp = new XMLHttpRequest();
        let path='http://localhost:8080/api/getItems/?household='+household+'&category='+category+'&subcategory='+subcategory+'&email='+email+'&username='+username;;
        xhttp.open("GET", path);
        xhttp.send();

        xhttp.onload = function() {       
            if(this.status==200){
                let response=JSON.parse(this.responseText);                
                response=response.sort();                   
                setAll_StockCategory(response);                                 
                showContent();     
 
            }  

            else{
                let response=this.responseText;
                console.log(response);
            }            
        };
    }
    
    function getSubcategory(category,subcategory){                
        if(category==0){
          if(subcategory=='Fruit - Vegetables'){
            return 1;
          }
          else if (subcategory=='Meat - Fish'){
            return 2;
          }
          else if (subcategory=='Bakery'){
            return 3;
          }
          else if (subcategory=='Milk - Dairy'){
            return 4;
          }
          else if (subcategory=='Salumi'){
            return 5;
          }
          else if (subcategory=='Dry Food'){
            return 6;
          }
          else if (subcategory=='Beverages'){
            return 7;
          }
          else if (subcategory=='Salt - Spices'){
            return 8;
          }
          else if (subcategory=='Glucose'){
            return 9;
          } 
          else if (subcategory=='Coffee - Tea'){
            return 10;
          }
          else if (subcategory=='Snacks'){
            return 11;
          }
          else if (subcategory=='Other'){
            return 12;
          }
      
        }
      
        //household
        else{
          if(subcategory=='Cleaning'){
            return 1;
          }
          else if (subcategory=='Hugiene'){
            return 2;
          }
          else if (subcategory=='Plastics'){
            return 3;
          }
          else if (subcategory=='Paper'){
            return 4;
          }
          else if (subcategory=='Cosmetics'){
            return 5;
          }
          else if (subcategory=='Other'){
            return 6;
          }
          
        }
    }

    function showContent(){
      
        let items=[];     

        if(all_StockCategory!=''){       
          
          
          let c; 
          let endIndex;
          let indexDifference=all_StockCategory.length-startIndex;

          if((indexDifference)>=3){
            endIndex=startIndex+3;
          }
          else{
            endIndex=startIndex+indexDifference;
          }
                              
          for(c=startIndex;c<endIndex;c++){            
            let item=all_StockCategory[c];              
                item=item.split(',');
                item=item[0]; //item name                
                items.push(
                  
                        <div className='row  top2' >
                           <div className='col-6'>
                              <Link  to={'/item-balance/'+category+'/'+subcategory+'/'+item}>
                                <div className='record  record_StockCategory vertical-centre'>
                                  {item}
                                </div>
                               </Link> 
                           </div>
                            {/* <Link className='link col-1  left1' to={'/item-balance/'+category+'/'+subcategory+'/'+item} ><button className='left1 centre btn button-secondary'>+/-</button></Link> */}
                            <div className='col-6'>
                              <Link to={'/item-settings/'+category+'/'+subcategory+'/'+item}><button className='centre col-lg-3 btn button-secondary'><i class="fas fa-cog"></i></button></Link>
                              <Link><button className='left2  col-lg-3 centre btn button-secondary' onClick={()=>{openConfirm(item);}}><i class="fas fa-trash-alt"></i></button></Link>
                            </div>
                        </div>                                       
              );
            }            
        }

        else{


          items.push(
            <div className='row top2'>
                <div className='col  centre'><small className='lightgrey'>No items</small> </div>
            </div>
          )

          
          
        }
        return(<div>{items}</div>)
    }


    function scrollButtons(){
      if(all_StockCategory!=''){
        return(
          <div className='row   top1 maincontent' id='navigationContainer_StockCategory'>              
              <button className='btn green' onClick={()=>scrollUp()}><i class="navigateCategory col fas fa-caret-up"></i></button>
              <button className='btn lightergreen' onClick={()=>scrollDown()}><i class="navigateCategory fas fa-caret-down"></i></button>                              
          </div>  
        )
      }
    }

    function scrollUp(){
      
      if((startIndex)>3){
        setStartIndex(startIndex-3);
      }
      else {
        setStartIndex(0);
      }
    }

    function scrollDown(){      
      let indexDifference=all_StockCategory.length-startIndex;
      if((indexDifference)>3){
        setStartIndex(startIndex+3);
      }
    }

    function openConfirm(item){
      selectItem(item);
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
      //handle response
      let item=selectedItem;
      if(response==true){        
        // send request to delete item
        var xhttp = new XMLHttpRequest();
    
        xhttp.open("POST", "http://localhost:8080/api/deleteItem");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        let data=`household=${household}&category=${category}&subcategory=${subcategory}&item=${item}&email=${email}&username=${username}`;
        
        xhttp.send(data);
        xhttp.onload = function() {
          if(this.status==200){
            console.log('aaaaa');
            let origin='stock';
            let message='Item successfully deleted';
            let path='http://localhost:3000/error/'+origin+'/'+message;
            window.location.replace(path);
          }
          
        };
      }
      
    }

    return (        
      <main className='container' id='main'>
          
        <div className='modals2'>

          <div className='row top2 modals-content'>
              <div className='col-12 centre top2'><b><p>Are you sure you want to delete this item?</p></b></div>
              <div className='col-12 centre'> <button className='col-2 btn button-secondary' onClick={()=>{confirmDelete(true)}}>Yes</button> <button className='col-2  btn button-secondary2' onClick={()=>{confirmDelete(false)}}>Cancel</button> </div>            
          </div>

        </div>


        <div className='row maincontent'>
            <Link to='/stock' className='col-12'><i class="fas fa-caret-left"></i></Link>
        </div>

        <div className='row top1 maincontent'>
          <div className='col-6 green vertical-centre'>
              <b>{subcategory} </b>
          </div>

          <div className='col-6 maincontent'>
              <Link to={'/new-item/'+category+'/'+subcategory}><button className='btn btn-primary'><b> + New item</b></button></Link>
              
          </div>

        </div>

        < div className='row top1 maincontent' id='contentContainer_StockCategory'>
        {showContent()}
        </div>

        {scrollButtons()}
          
          
          
      </main>            
    );
  }

  
  
  export default StockCategory;
  