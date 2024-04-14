
import './main.css';


import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Header from './Header'
import ErrorMessage from './ErrorMessage';
import Login from './Login';
import SignUp from './SignUp';
import Welcome from './Welcome';
import AddHousehold from './AddHousehold';
import Menu from './Menu';
import Transactions from './Transactions';
import Favourites from './Favourites';
import Notifications from './Notifications';
import Shoppinglist from './Shoppinglist';
import Stock from './Stock';
import StockCategory from './StockCategory';
import ItemNew from './ItemNew';
import ItemBalance from './ItemBalance';
import ItemSettings from './ItemSettings';


import  { useState,useEffect } from 'react';



function Main() {


  return (
    <Router>
        <Header />    
        <main className='container'>   
         
            <Switch>

               <Route exact path="/">
                  <Login />                  
               </Route>

               <Route exact path="/signup">
                  <SignUp />                  
               </Route>

                <Route exact path="/welcome">
                  <Welcome />                  
               </Route>

               <Route  path="/error/:origin/:message">
                  <ErrorMessage />                  
               </Route>

               <Route exact path="/addHousehold">
                  <AddHousehold />                  
               </Route>

                <Route path="/transactions">
                  <Transactions />
                  <Menu />  
               </Route>

               <Route path="/notifications">
                  <Notifications />
                  <Menu />  
               </Route>

               <Route path="/favourites">
                  <Favourites />
                  <Menu />  
               </Route>

               <Route path="/stock">
                  <Stock />
                  <Menu />  
               </Route>

               <Route path="/list">
                  <Shoppinglist />
                  <Menu />  
               </Route>

               <Route path="/stock-category/:category/:subcategory">
                  <StockCategory />
                  <Menu />  
               </Route>


               <Route  path="/new-item/:category/:subcategory">
                  <ItemNew />
                  <Menu />  
               </Route>

               <Route  path="/item-balance/:category/:subcategory/:item">
                  <ItemBalance />
                  <Menu />  
               </Route>

               <Route  path="/item-settings/:category/:subcategory/:item">
                  <ItemSettings />
                  <Menu />  
               </Route>
          
              </Switch>                  
        </main>    
        
      
    </Router>
  );
}

export default Main;
