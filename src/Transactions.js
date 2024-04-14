
import './transactions.css';
import  { useState,useEffect } from 'react';
import {BrowserRouter as Router,Link,useParams} from "react-router-dom";
import React from "react";
let household=localStorage.getItem('household');    
let username=localStorage.getItem('username');
let email=localStorage.getItem('email');



function Transactions() {
  const [all_Transactions, getAll_Transactions] = useState('');
  
  
  useEffect(()=>{
    isLoggedIn();     
  },[]);

  function isLoggedIn(){
    if(localStorage.getItem('username')==null||localStorage.getItem('username')=='null'){
        localStorage.clear();
        window.location.href = "/";
    } 
    else{
      getTransactions();
      getNotifications(); 
    }            
}  

  function getNotifications(){    
      
      let path='http://localhost:8080/api/getNotifications?household='+household+'&email='+email+'&username='+username;
      var xhttp = new XMLHttpRequest();    
      xhttp.open("GET", path);
      xhttp.send();
      xhttp.onload = function() {  
         if(this.status==200){
            console.log('retrieved notifications');
         }
      };   
  }

  function getTransactions(){
    let items=[];
    var xhttp = new XMLHttpRequest();
    
    let path='http://localhost:8080/api/getTransactions?household='+household+'&email='+email+'&username='+username;
    xhttp.open("GET",path );
    xhttp.send();
    xhttp.onload = function(){
      if(this.status!=200){
        console.log(this.responseText);
      }
      else{
        let response=JSON.parse(this.responseText);
        console.log(response);
        getAll_Transactions(response);        
      }
    }
  }

  //gets items from file and creates list of products         
  function getItems(all_Transactions){
    if(all_Transactions!='')
    {  
      let itemsList=[];
      
      let l=all_Transactions.length;
      
      let c;

      for(c=0;c<l;c++){
      
      
        let  transactions= all_Transactions[c].split(',')
          let item=transactions[0];
          let transaction=transactions[1];
          let total=transactions[2];
          let minimum=transactions[3];
          let category=transactions[4];
          let subcategory=transactions[5];
          let deleted=transactions[6];
          
          //convert category & subcategory numerical and literal value respectively (to be used as parameters for the link later on)
          category=getCategory(category);          
          subcategory=getSubcategory(category,subcategory);
        

          //populate list array to displayed

          if(transaction<0){ //items were subtracted from stock total
            if(deleted=='false')
              {  
                itemsList.push( 
                  <Link to={'/item-balance/'+category+'/'+subcategory+'/'+item}>   
                <div className='row top1 border record' key={c}>         
                  <p className='col margin-v-auto left vertical-centre'><small>{item}</small></p>
                  <p className='col margin-v-auto left vertical-centre negative'><small>{transaction}</small></p>
                  <p className='col margin-v-auto left vertical-centre'><small>{total}</small></p>
                  <p className='col margin-v-auto left vertical-centre'><small>{minimum}</small></p>
                  {/* <div className='col background-white  '><Link to={'/item-balance/'+category+'/'+subcategory+'/'+item} ><button className=' btn button-secondary'>+ / -</button></Link></div> */}
              </div>
              </Link>
              );
            }
            else{

              itemsList.push( 
                <div className='row top1  border record' key={c}>         
                  <p className='col left1 margin-v-auto left vertical-centre lightgrey'><small>{item}</small></p>
                  <p className='col margin-v-auto left vertical-centre lightgrey '><small>{transaction}</small></p>
                  <p className='col margin-v-auto left vertical-centre lightgrey'><small>{total}</small></p>
                  <p className='col margin-v-auto left vertical-centre lightgrey'><small>{minimum}</small></p>
                  {/* <div className='col grey background-white'> <small>item deleted</small> </div> */}
              </div>



              );
            }
          }
          else{ //items were added to stock total
            if(deleted=='false')
            {
                itemsList.push(
                  <Link to={'/item-balance/'+category+'/'+subcategory+'/'+item}> 
                  <div className='row top1 border record' key={c}>         
                  <p className='col left1 margin-v-auto left vertical-centre'><small>{item}</small></p>
                  <p className='col margin-v-auto left vertical-centre positive'><small>{transaction}</small></p>
                  <p className='col margin-v-auto left vertical-centre'><small>{total}</small></p>
                  <p className='col margin-v-auto left vertical-centre'><small>{minimum}</small></p>
                  {/* <div className='col background-white  '><Link to={'/item-balance/'+category+'/'+subcategory+'/'+item}><button className=' btn button-secondary'>+ / -</button></Link></div> */}
                </div>
                </Link>
              );
            }
            else{
              itemsList.push(
                <div className='row top1 border record' key={c}>         
                  <p className='col left1 margin-v-auto left vertical-centre lightgrey'><small>{item}</small></p>
                  <p className='col margin-v-auto left vertical-centre  lightgrey'><small>{transaction}</small></p>
                  <p className='col margin-v-auto left vertical-centre lightgrey'><small>{total}</small></p>
                  <p className='col margin-v-auto left vertical-centre lightgrey'><small>{minimum}</small></p>
                  {/* <div className='col grey background-white'> <small>item deleted</small> </div> */}
              </div>
              );
            }
          }
          
      }
      

      return(
        <div>
          <div className='row top2 headers sticky-top'>
              <h6 className='col left'>Item</h6>
              <h6 className='col left'>+ / -</h6>
              <h6 className='col left'>Tot</h6>
              <h6 className='col left'>Min</h6>
              
          </div>
          {itemsList}
        </div>
      );
    }else{
      return(
          <div className='row top1'>         
              <p className='col margin-v-auto  left lightgrey'>No recent transactions found</p>              
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

  return (
    
      
      <main className='container'>
          <div className='row left'>
              <h5 className='col left'>Recent transactions</h5>
          </div>         
          <div id='main-container_Transactions'>
            {getItems(all_Transactions)}            
          </div>

          { all_Transactions!='' &&
            <div className='row'>
              <div className='col lightgrey'><small className='left1'>scroll down to see more transactions</small></div>
            </div>
          }
      </main>    
  );
}

export default Transactions;
