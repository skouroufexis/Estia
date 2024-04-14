
// import './main.css';

import  { useState,useEffect } from 'react';
import React from "react";
import './Stock.css';

import {
  BrowserRouter as Router,    
  Link
} from "react-router-dom";




// importing images
import g1 from './images/stock/groceries/1.png';
import g2 from './images/stock/groceries/2.png';
import g3 from './images/stock/groceries/3.png';
import g4 from './images/stock/groceries/4.png';
import g5 from './images/stock/groceries/5.png';
import g6 from './images/stock/groceries/6.png';
import g7 from './images/stock/groceries/7.png';
import g8 from './images/stock/groceries/8.png';
import g9 from './images/stock/groceries/9.png';
import g10 from './images/stock/groceries/10.png';
import g11 from './images/stock/groceries/11.png';
import g12 from './images/stock/groceries/12.png';

import h1 from './images/stock/household/1.png';
import h2 from './images/stock/household/2.png';
import h3 from './images/stock/household/3.png';
import h4 from './images/stock/household/4.png';
import h5 from './images/stock/household/5.png';
import h6 from './images/stock/household/6.png';

let groceriesImages=[g1,g2,g3,g4,g5,g6,g7,g8,g9,g10,g11,g12];
let householdImages=[h1,h2,h3,h4,h5,h6];








// import household from './images/stock/household.png'




function Stock() {

  const [selected_Stock, select_Stock] = useState(0);  
  const [commodity, setCommodity] = useState('Groceries');  
  const [listDisplayed_Stock, setList_Stock] = useState(0);



  

  let groceriesList=[{name:"Fruit - Vegetables"},   
  {name:"Meat - Fish"},      
  {name:"Bakery"},                                                                                 
  {name:"Milk - Dairy"},
  {name:"Salumi"},                                                                                            
  {name:"Dry Food"},                                                                                            
  {name:"Beverages"},
  {name:"Salt - Spices"},
  {name:"Glucose"},
  {name:"Coffee - Tea"},      
  {name:"Snacks"},
  {name:"Other"},
  ];

  groceriesList.sort();

  let householdList=[{name:"Cleaning"},
                     {name:"Hygiene"},
                     {name:"Plastics"},
                     {name:"Paper"},
                     {name:"Cosmetics"},
                     {name:"Other"},
                    ];

  householdList.sort();
  

  const [groceries, getGroceriesList] = useState(groceriesList);

  const [household, getHouseholdList] = useState(householdList);                                          
  
  
    
  useEffect(() => {
    isLoggedIn();
    
    });

  function isLoggedIn(){
        if(localStorage.getItem('username')==null||localStorage.getItem('username')=='null'){
            localStorage.clear();
            window.location.href = "/";
        } 
        else{
          let commodityType=document.getElementsByClassName('commodityType');
        let l=commodityType.length;
      let c;
      for(c=0;c<l;c++){
        commodityType[c].style.color='black';
      }
        commodityType[selected_Stock].style.color='lightseagreen';
        }            
  }  


  function changeStock(n){

    if(n==0){
      select_Stock(0);
      setCommodity('Groceries');      
      setList_Stock(0);  
      scrollUp(-1000);
    }
    else{
      select_Stock(1);
      setCommodity('Household');      
      setList_Stock(1);
      scrollUp(-1000);
      
    }

  }  
  function showItems_Stock (){

    let itemsList=[];
    let source;
    let imageSource;
    if(listDisplayed_Stock==0){
      source=groceries;
      imageSource=groceriesImages;
    }
    else{
      source=household;
      imageSource=householdImages;
    }
    
    let l=source.length;
    let c;

    for(c=0;c<l;c++){
      
      itemsList.push(
        <div className='row  vertical-centre  record-Stock' key={c}>  

           <div className='col-3 col-lg-1 centre margin-v-auto'>
              <img  src={imageSource[c]} className='img-Stock'></img>
            </div>          
           <div className='col-8   left  margin-v-auto '>                 
              <Link to={'/stock-category/'+selected_Stock+'/'+source[c].name}><button className='grey  left'><b>| {source[c].name} </b></button>  </Link>
           </div>            
        </div>
      );

    }
    
    
    return(
      <div>
        {itemsList}
      </div>
    );
    
  }  


  function scrollUp(n){

    if(n==0){
      let height=window.innerHeight;
      height=height*(-0.30);
      let container=document.getElementById('record-container-Stock');    
      container.scrollBy(0,height);
      
    }

    else{
      
      let container=document.getElementById('record-container-Stock');    
      container.scrollBy(0,n);
    }
    
    

   
  }

  function scrollDown(n){
    if(n==0){
      let height=window.innerHeight;
      height=height*0.30;
      let container=document.getElementById('record-container-Stock');    
      container.scrollBy(0,height);
    }

    else{
      
      let container=document.getElementById('record-container-Stock');    
      container.scrollBy(0,n);
    }
    
  }

  return (        
    <main className='container'>
        <div className='row left'>
            <h5 className='col'>Stock</h5>
        </div>

        <div className='row'>    
                <div className='col  left'>
                  <button className='right2 commodityType navigateCategory' onClick={()=>changeStock(0)} >      
                    <i class="fas fa-apple-alt"></i>
                  </button>
                  
                  <button className='commodityType navigateCategory' onClick={()=>changeStock(1)} >
                    <i class="fas fa-soap"></i>
                  </button>
                </div>
        </div>

        <div className='row top2'>
              <p className='col green'> <b>{commodity}</b></p> 
        </div> 

        <div className='row'>
          <div className='col-6' id='record-container-Stock'>
            {showItems_Stock()}
          </div>

          <div className='col vertical-centre'>
          
              <div className='row justify-centre'>
                <button className='col-12  btn green' onClick={()=>scrollUp(0)}><i class="navigateCategory col fas fa-caret-up"></i></button>
                <button className='col-12  btn lightergreen' onClick={()=>scrollDown(0)}><i class="navigateCategory fas fa-caret-down"></i></button>                
              </div>

          </div> 
        </div>

        

    </main>            
  );
}

export default Stock;
