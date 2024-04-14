
var fs = require('fs');
const readline = require('readline');
var http = require('http');
const querystring = require('querystring');
const { Redirect } = require('react-router');


const notificationMessage='Stock below minimum';


function determineCategory(string){
  if (string=='0'){
    return 'groceries';
  }
  else{
    return 'household';
  }  
}

function getSubcategory(category,subcategory){
  if(category=='groceries'){
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
const port = process.env.PORT || 8080; 
http.createServer(function (req, res) {
  

  res.setHeader('Access-Control-Allow-Origin','*');
  
  //GET requests
  if(req.url=='/api/getHouseholds'){    
    //this is actually a post request (previously it was get)
    let body='';
    
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      let 	params =new URLSearchParams(body);
      let email=params.get('email');
      let password=params.get('password');
      let username=params.get('username');

      // body=querystring.decode(body);
      // let email= body.email.trim();      
      // let password= body.password.trim();
      // let username=body.username;

    const folderPath = './src/households/'+username+email;
    let folders= fs.readdirSync(folderPath);   
    let foldersLength =folders.length;
    folders=JSON.stringify({folders:folders,length:foldersLength});
    
    res.writeHead(200);
    res.end(folders);
    }); 
  }
  
  if(req.url.includes('api/putHousehold')){
    let params=req.url.split('?');
        params=params[1];

        params =new URLSearchParams(params);
        let household=params.get('household');
        let oldName=params.get('oldName');
        let newName=params.get('newName');
        let username=params.get('username');
        let email=params.get('email');

    // let household =querystring.parse(params);
    //     let oldName=household.oldName;
    //     let newName=household.newName;
    //     let username=household.username;
    //     let email=household.email;

        
        let oldPath='./src/households/'+username+email+'/'+oldName;
        let newPath='./src/households/'+username+email+'/'+newName;

        fs.rename(oldPath, newPath, function(err) {
          if (err) {
            console.log(err)
          } else {
            res.writeHead(200);
            console.log("Successfully renamed the directory.")
            res.end();
          }
        })
  }

  if(req.url.includes('api/deleteHousehold')){
    let params=req.url.split('?');
        params=params[1];

        params =new URLSearchParams(params);
        let household=params.get('household');
        let name=params.get('name');
        let username=params.get('username');
        let email=params.get('email');

    // let household =querystring.parse(params);
    //     let name=household.name;
    //     let username=household.username;
    //     let email=household.email;

        
        let path='./src/households/'+username+email+'/'+name;
        
        var rimraf = require("rimraf");
        
        
        rimraf.sync(path);

        res.writeHead(200);
        console.log("Successfully deleted the household.")
        res.end();
      
  }

  if(req.url.includes('/api/getTransactions')){
    let params=req.url.split('?');
        params=params[1];

        params=new URLSearchParams(params);
        let household=params.get('household');
        let username=params.get('username');
        let email=params.get('email');
        console.log('EMAIL'+email+username);
        
    // let household =querystring.parse(params);        
    // household=household.household;  
    // let username=household.username;
    // let email=household.email;
     
        

    let transactions=[];  
        //read transactions file for selected household
        let filepath='./src/households/'+username+email+'/'+household+'/transactions.txt';

        const rl = readline.createInterface({
          input: fs.createReadStream(filepath),
          output: process.stdout,
          terminal: false
        });
      
        rl.on('line', (line) => {
          
          transactions.push(line);
          
        }).on('close',(line)=>{
          transactions=transactions.reverse();          
          res.end(JSON.stringify(transactions));
        });
  }

  if(req.url.includes('/api/getFavourites')){
    let params=req.url.split('?');
        params=params[1];

        params =new URLSearchParams(params);
        let household=params.get('household');
        let email=params.get('email');
        let username=params.get('username');
    // let household =querystring.parse(params);
    //     household=household.household;  
    //     let email= household.email;  
    //     let username=household.username;
    

    let favourites=[];  
        //read favourites file for selected household
        let filepath='./src/households/'+username+email+'/'+household+'/favourites.txt';

        const rl = readline.createInterface({
          input: fs.createReadStream(filepath),
          output: process.stdout,
          terminal: false
        });
      
        rl.on('line', (line) => {          
          console.log(line);
          favourites.push(line);          
        }).on('close',(line)=>{
          favourites=favourites.sort();          
          res.end(JSON.stringify(favourites));
        });
  }
  if(req.url.includes('/api/getNotifications')){
    let params=req.url.split('?');
        params=params[1];

      params =new URLSearchParams(params);
      console.log('paramsSSS'+params);
      let household=params.get('household');
      let username=params.get('username');
      let email=params.get('email');
      

    // let household =querystring.parse(params);
    //     household=household.household;  
    //     let username=household.username;
    //     let email=household.email;

    // delete old notifications file & recreate it with no contents
    deleteNotificationsFile(username,email,household);
    getNotifications(username,email,household,function(result){

      
      //return notifications to front-end
      if(result==true){
        setTimeout(() => {
          let items=[];
          let path = './src/households/'+username+email+'/'+household+'/notifications.txt';
        console.log(path)
        const rl = readline.createInterface({
          input: fs.createReadStream(path),
          output: process.stdout,
          terminal: false
        });
        rl.on('line', (line) => {                        
          console.log(line);
          items.push(line);
        }).on('close',(line)=>{         
          // items=items.sort();
          items=items.reverse();                    
          res.writeHead(200);
          res.end(JSON.stringify(items))
        });
        }, 100);
        
      }
    });   
  }

  if(req.url.includes('/api/getItems')){
    let params=req.url.split('?');
        params=params[1];
        
        params =new URLSearchParams(params);
        let username=params.get('username');
        let email=params.get('email');
        let household=params.get('household');
        let category=determineCategory(params.get('category'));
        let subcategory=params.get('subcategory');
      
        // params =querystring.parse(params);
        // let username=params.username;
        // let email=params.email;
        // let household=params.household;  
        // let category=determineCategory(params.category);
        // let subcategory=params.subcategory;        
        let items=[];  
        //read items file for selected household
        let filepath='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';
        const rl = readline.createInterface({
          input: fs.createReadStream(filepath),
          output: process.stdout,
          terminal: false
        });
      
        rl.on('line', (line) => {
          
          items.push(line);
         
        }).on('close',(line)=>{          
            console.log(items);
            res.writeHead(200);
            res.end(JSON.stringify(items));
        });
  }

  if(req.url.includes('/api/getSingleItem')){
    let params=req.url.split('?');
        params=params[1];
        params =new URLSearchParams(params);
        let username=params.get('username');
        let email=params.get('email');
        let household=params.get('household');
        let category=determineCategory(params.get('category'));
        let subcategory=getSubcategory(category,params.get('subcategory'));
        let item=params.get('item');

        // params =querystring.parse(params);
        // let username=params.username;
        // let email=params.email;
        // let household=params.household;          
        // let category=determineCategory(params.category);                            
        // let subcategory=getSubcategory(category,params.subcategory);                              
        // let item=params.item;
        let itemFields=[];  
        //read items file for selected household
        let path='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';

        const rl = readline.createInterface({
          input: fs.createReadStream(path),
          output: process.stdout,
          terminal: false
        });
      
        rl.on('line', (line) => {          
          let fields = line.split(',');          
          if(fields[0]==item){
            itemFields.push(line);
          }
                   
        }).on('close',(line)=>{          
            console.log(itemFields);
            res.writeHead(200);
            res.end(JSON.stringify(itemFields));
        });
  }

  if(req.url.includes('/api/getBalance')){    
    //get the current total in stock of a specific item

    let params=req.url.split('?');
        params=params[1];

        params =new URLSearchParams(params);
        let household=params.get('household');
        let username=params.get('username');
        let email=params.get('email');
        let category=determineCategory(params.get('category'));
        let subcategory=getSubcategory(category,params.get('subcategory'));
        let item=params.get('item');

        // params =querystring.parse(params);
        // let household=params.household;  
        // let username=params.username;
        // let email=params.email;
        // let category=determineCategory (params.category);
                
        // let subcategory=getSubcategory(category,params.subcategory);            
        // let item=params.item;

      let total;  
      let minimum;
      let notifications;
      let duration;
      let dateAdded;
      let autolist;
      let favourites;
      let path='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';           
       const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
    
      rl.on('line', (line) => {    
        
        //read the item from each line
        fields = line.split(',');
        if(fields[0]==item){
        total= fields[1];    
        minimum=fields[2];  
        duration=fields[3];        
        notifications=fields[5];
        autolist=fields[6];
        favourites=fields[7];
        dateAdded=fields[8]
        }
       
      }).on('close',(line)=>{                                
        res.writeHead(200);

        res.end(JSON.stringify({total:total,
                                minimum:minimum,
                                duration:duration,
                                notifications:notifications,
                                autolist:autolist,
                                favourites:favourites,   
                                dateAdded:dateAdded 
                              }));
      });
  }


  if(req.url.includes('/api/getShoppinglist')){
    let params=req.url.split('?');
        params=params[1];

        params =new URLSearchParams(params);
        let household=params.get('household');
        let username=params.get('username');
        let email=params.get('email');

    // let household =querystring.parse(params);
    //     household=household.household;  
    //     let username=household.username;
    //     let email=household.email;
    let shoppinglist=[];  
        //read transactions file for selected household
        let filepath='./src/households/'+username+email+'/'+household+'/shoppinglist.txt';

        const rl = readline.createInterface({
          input: fs.createReadStream(filepath),
          output: process.stdout,
          terminal: false
        });
      
        rl.on('line', (line) => {
          
          shoppinglist.push(line);
          
        }).on('close',(line)=>{
          shoppinglist=shoppinglist.sort();          
          res.end(JSON.stringify(shoppinglist));
        });
  }



  //POST requests
  if(req.url=='/api/postUser'){
    let body='';
    
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      
      let 	params =new URLSearchParams(body);
      let household=params.get('household');
      let username=params.get('username');
      let email=params.get('email');
      let password=params.get('password');

      // body=querystring.decode(body);
      // let username= body.username.trim();
      // let email= body.email.trim();
      // let password= body.password.trim();
      let fields;
      let userFound=[];
      let path='./src/users.txt';  
      let user=email+','+password+','+username;

      //check if user exists by checking the emails in the uxers.txt file
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });

      rl.on('line', (line) => {
        
      fields=line.split(',');
      if(fields[0]==email){
        userFound.push('true');
        
      }  
       
      }).on('close',(line)=>{        
        if(userFound[0]=='true'){
          console.log('user exists');
          res.writeHead(400);      
          res.end(JSON.stringify({message:'This email already exists'}));
        }
        else{

          fs.appendFileSync(path,user+'\r\n' , function (err) {
              if (err) throw err;
              console.log('new user added');                            
          }); 

          //create folder for user
          fs.mkdirSync('./src/households/'+username+email);

          res.writeHead(200);      
          res.end(JSON.stringify({message:'Account successfully created'}));
        }
      });

    }); 
  }

  if(req.url=='/api/postLogin'){
    let body='';
    
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      
      let 	params =new URLSearchParams(body);
      let email=params.get('email');
      let password=params.get('password');
      // body=querystring.decode(body);
      // let email= body.email.trim();      
      // let password= body.password.trim();
      let fields;
      let userFound=[];
      let path='./src/users.txt';  
      let user=email+','+password;

      //check if user exists by checking the emails in the uxers.txt file
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });

      rl.on('line', (line) => {
        
      fields=line.split(',');
      if(fields[0]==email && fields[1]==password){
        userFound.push(fields[0]);
        userFound.push(fields[1]);        
        userFound.push(fields[2]);
      }  
       
      }).on('close',(line)=>{        
        if(userFound[0]!=email){          
          res.writeHead(400);      
          res.end(JSON.stringify({message:'Wrong Credentials'}));
        }
        else{
          res.writeHead(200);      
          res.end(JSON.stringify({email:userFound[0],password:userFound[1],username:userFound[2]}));
        }
      });

    }); 
  }

  if(req.url=='/api/putUser'){
    let body='';
    
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      
      let 	params =new URLSearchParams(body);
      
      let email=params.get('email');
      let oldPassword=params.get('oldPassword');
      let newPassword=params.get('newPassword');
      let oldUsername=params.get('oldUsername');
      let newUsername=params.get('newUsername');
      
      console.log
      let fields;
      let newFile=[];
      let path='./src/users.txt';  
      
      //locate the user in the users.txt file
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });

      rl.on('line', (line) => {
        
      fields=line.split(',');
      if(fields[0]==email){ //user found
        line=email+','+newPassword+','+newUsername;  
        //push the line with the new data into the array into the array w
        newFile.push(line);
        
      }
      else{
        newFile.push(line);
      }  
       
      }).on('close',(line)=>{           
        //rewrite the file 
        let f;
        for(f of newFile){
          fs.writeFileSync(path,f+'\r\n' , function (err) {
              if (err) throw err;
              console.log('File updated!');             
          });  
        } 
        
        
        //change user folder name
        
        let oldPath='./src/households/'+oldUsername+email;
        let newPath='./src/households/'+newUsername+email;
        
        fs.rename(oldPath, newPath, function(err) {
          if (err) {
            console.log(err);
            res.writeHead(200);
            console.log(err)
            res.end('Error saving changes:' + err);
          } else {
            console.log("Changes successfully saved");
            res.writeHead(200);            
            res.end('Changes successfully saved');
          }
        })           

      });

    }); 
  }

  
  if(req.url=='/api/postHousehold'){
    let body='';
    let origin='welcome'
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      
      let 	params =new URLSearchParams(body);
      let householdName=params.get('householdName');
      let username=params.get('username');
      let email=params.get('email');
      let password=params.get('password');


      // body=querystring.decode(body);
      // let householdName= body.householdName.trim();
      // let username=body.username.trim();
      // let email=body.email.trim();
      // let password=body.password.trim();
      
      
        //name exists
        if (fs.existsSync('./src/households/'+username+email+'/'+householdName)) {
          message='Household already exists';
        }
        else{

          const folderPath = './src/households/'+username+email;
          let folders= fs.readdirSync(folderPath);   
        
    
          if(folders.length<3){

            //create new household folder
            fs.mkdirSync('./src/households/'+username+email+'/'+householdName);

            
            //create txt files for new household folder
              //first create subfolders for new household
              fs.mkdirSync('./src/households/'+username+email+'/'+householdName+'/groceries');
              fs.mkdirSync('./src/households/'+username+email+'/'+householdName+'/household');
            
              // then create txt files for each subfolder
              let c;

              for(c=1;c<13;c++){
                
                let fileName=c+'.txt';
                fs.appendFile('./src/households/'+username+email+'/'+householdName+'/groceries/'+fileName, '', function (err) {
                  if (err) throw err;
                  console.log('Saved!');
                });
              }


              for(c=1;c<7;c++){
                
                let fileName=c+'.txt';
                fs.appendFile('./src/households/'+username+email+'/'+householdName+'/household/'+fileName, '', function (err) {
                  if (err) throw err;
                  console.log('Saved!');
                });
              }


              fs.appendFile('./src/households/'+username+email+'/'+householdName+'/favourites.txt', '', function (err) {
                if (err) throw err;
                console.log('Saved!');
              });

              fs.appendFile('./src/households/'+username+email+'/'+householdName+'/notifications.txt', '', function (err) {
                if (err) throw err;
                console.log('Saved!');
              });

              fs.appendFile('./src/households/'+username+email+'/'+householdName+'/shoppinglist.txt', '', function (err) {
                if (err) throw err;
                console.log('Saved!');
              });

              fs.appendFile('./src/households/'+username+email+'/'+householdName+'/transactions.txt', '', function (err) {
                if (err) throw err;
                console.log('Saved!');
              }); 
              
              fs.appendFile('./src/households/'+username+email+'/'+householdName+'/expiries.txt', '', function (err) {
                if (err) throw err;
                console.log('Saved!');
              }); 
            message='New household successfully added';
          }
          else{
            message='Maximum number of households reached';
          }          
        }
      res.writeHead(301,{Location: 'http://localhost:3000/error/'+origin+'/'+message});      
      res.end();
    }); 
  }

  if(req.url=='/api/postItem'){
    
    let body='';
    let origin='stock';
    let message;

    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end',function(){
      let 	params =new URLSearchParams(body);
      let household=params.get('household');
      let category=params.get('category');
      let username=params.get('username');
      let email=params.get('email');

      // body=querystring.decode(body);

      // let household=body.household;
      // let category=body.category;  
      // let username=body.username;
      // let email=body.email;

          if(category==0){
            category='groceries';
          }
          else if(category==1){
            category='household';
          }

      //determine folder number of subcategory
      let subcategory=params.get('subcategory');           
      subcategory =getSubcategory(category,subcategory);
          
      let item= params.get('item');
      let total=params.get('total');
      let minimum=params.get('minimum');
      let duration=params.get('duration');
      let deleted=params.get('deleted');
      let notifications=params.get('notifications');
      let autolist=params.get('autolist');
      let favourites=params.get('favourites');
      let dateAdded=new Date();

      let string=item+','+total+','+minimum+','+duration+','+deleted+','+notifications+','+autolist+','+favourites+','+dateAdded+','+false;          
      let path='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';

      //check if entry does not already exist
        
      checkDuplicates(username,email,household,item,function(exists){
        console.log("Exists: "+exists);
        insertItem(exists,total,minimum,autolist);           
      });
      
      
      

      function insertItem(exists,total,minimum,autolist){
        
        if(exists==true){
          message='Item already exists';          
          res.writeHead(301,{Location: 'http://localhost:3000/error/'+origin+'/'+message});          
          res.end();
        }
        else{
          
          fs.appendFile(path,string+'\r\n', function (err) {
              if (err) throw err;
              console.log('New item added: items.txt');


              //update transactions.txt            
              updateTransactions(username,email,household,item,total,total,minimum,category,subcategory,deleted);

              //update favourites.txt
              if(favourites=='on'){
                postFavouritesFile(username,email,household,category,subcategory,item);                                            
              }              
              getNotifications(username,email,household,function(result){
                console.log(result)
              });                        
              message='New item successfully added';  
              
              if(total<minimum && autolist=='on'){
                console.log('adding to shoppinglist');
                // household,category,subcategory,item
                postShoppinglist(username,email,household,category,subcategory,item);
              }
              console.log(duration);
              postExpiriesFile(username,email,household,item,total,duration,dateAdded);

              res.writeHead(301,{Location:'http://localhost:3000/error/'+origin+'/'+message});
              res.end();
            }); 


          
        }
      }               
    })
  }

  if(req.url=='/api/postShoppinglist'){
    let body='';
    let origin='index'
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      let 	params =new URLSearchParams(body);
      let username=params.get('username');
      let email=params.get('email');
      let household=params.get('household');
      let category=params.get('category');
      let subcategory=params.get('subcategory');
      let item=params.get('item');

      // body=querystring.decode(body);
      // let username=body.username;
      // let email=body.email;
      // let household= body.household;
      // let category=body.category;
      // let subcategory=body.subcategory;
      // let item=body.item;
      
      putItemsFile(username,email,household,category,subcategory,item,true);
      postShoppinglist(username,email,household,category,subcategory,item);
            
      res.end();
    }); 
  }

  //PUT REQUESTS
  if(req.url=='/api/putBalance'){
    let body='';
    let origin='stock';
    let message;

    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end',function(){
      let 	params =new URLSearchParams(body);
      let username=params.get('username');
      let email=params.get('email');
      let household=params.get('household');
      let item=params.get('item');
      let total=parseInt(params.get('total'));
      let transaction=parseInt(params.get('transaction'));
      let minimum=parseInt(params.get('minimum'));
      let duration=params.get('duration');
      let dateAdded=params.get('dateAdded');
      let deleted=params.get('deleted');
      let autolist=params.get('autolist');
      let category=determineCategory(params.get('category'));
      let subcategory=getSubcategory(category,params.get('subcategory'));
      // body=querystring.decode(body);
      // let username=body.username;
      // let email=body.email;
      // let household=body.household;
      // let item=body.item;
      // let total=parseInt(body.total);
      // let transaction=parseInt(body.transaction);
      // let minimum=parseInt(body.minimum);
      // let duration=body.duration;
      // let dateAdded=body.dateAdded;
      // let deleted=body.deleted;
      // let autolist=body.autolist;
      // let category=determineCategory(body.category);
      // let subcategory=getSubcategory(category,body.subcategory);            
      
      let path='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';

      let items=[];
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });    
      rl.on('line', (line) => {        
        fields = line.split(',');
          
        if(fields[0]==item){      
          let added=fields[9];
          //if added items > minimum, item will be removed from shopping list,
          //so "added" needs to be set to false
          if(total>=minimum){
            added=false;
          }

          if(total<minimum && autolist=='off'){
            added=false;
          }
          line=item+','+total+','+fields[2]+','+fields[3]+','+fields[4]+','+fields[5]+','+fields[6]+','+fields[7]+','+fields[8]+','+added;
          items.push(line);
          console.log('found changed item');          
        }
        else{
          items.push(line);          
        }
       
      }).on('close',(line)=>{
        
        //replace old file with updated one
        fs.unlink(path, function (err) {
            if (err) throw err;
            console.log('Old file deleted!');            
          let c;
          let l =items.length;          
          for(c=0;c<l;c++){
            fs.appendFile(path, items[c]+'\r\n', function (err) {
                if (err) throw err;              
              });
          }
          //update transactions file
          updateTransactions(username,email,household,item,transaction,total,minimum,category,subcategory,deleted);          

          //add new items to the expiries.txt file if items were added
          if(transaction>0){
            let today=new Date();
            postExpiriesFile(username,email,household,item,transaction,duration,today);
          }


          getNotifications(username,email,household,function(result){
            console.log(result)
          });    
          
         //update shopping list
          if(autolist=='on'){            
              if(total<minimum){
                console.log('put shoppinglist');
                putShoppinglist(username,email,household,category,subcategory,item,item,true);
              }
              else{
                putShoppinglist(username,email,household,category,subcategory,item,item,false);
              }
            }  
            else{
                putShoppinglist(username,email,household,category,subcategory,item,item,false);
            }  


          message='Stock quantity successfully modified';
          res.writeHead(301,{Location: 'http://localhost:3000/error/'+origin+'/'+message});        
          res.end();
        });

        
      });    
    })
  }

  if(req.url=='/api/putNotifications'){
    
    let body='';        
    req.on('data', function (chunk) {
      body += chunk;
      
    });
    req.on('end',function(){   
      let 	params =new URLSearchParams(body);
      let household=params.get('household');
      let username=params.get('username');
      let email=params.get('email');
      let item=params.get('item');
      let notifications=params.get('notifications');
      let category=determineCategory(params.get('category'));
      let subcategory=getSubcategory(category,params.get('subcategory'));

      // body=querystring.decode(body);            
      // let household=body.household;
      // let username=body.username;
      // let email=body.email;
      // let item=body.item;
      // let notifications=body.notifications;
      
      // let category=determineCategory(body.category);
      // let subcategory=getSubcategory(category,body.subcategory);
      
      let path='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';
      

      //put contents of old file into array
      let newFile=[];
      let fields;
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
    
      rl.on('line', (line) => {
        
        fields = line.split(',');
        if(fields[0]==item){ //item found
          line=fields[0]+','+fields[1]+','+fields[2]+','+
          fields[3]+','+fields[4]+','+notifications+','+
          fields[6]+','+fields[7]+','+fields[8]+','+fields[9];

          newFile.push(line);
        }
        else{
          newFile.push(line);
        }
       
      }).on('close',(line)=>{        
         //delete old file  
          fs.unlink(path, function (err) {
          if (err) throw err;
            console.log('File deleted!');

            //rewrite file
            let f;
            for(f of newFile){
              fs.appendFileSync(path,f+'\r\n' , function (err) {
                  if (err) throw err;
                  console.log('File updated!');

                getNotifications(username,email,household,function(result){
                  console.log(result)
                });     
              });  
            }     
            
            res.writeHead(200);
            res.end();
          });  
        
      });
    });
  }

  if(req.url=='/api/putAutolist'){
    
    let body='';        
    req.on('data', function (chunk) {
      body += chunk;
      
    });
    req.on('end',function(){    
      let 	params =new URLSearchParams(body);
      let household=params.get('household');
      let item=params.get('item');
      let autolist=params.get('autolist');
      let username=params.get('username');
      let email=params.get('email');
      let category = determineCategory(params.get('category'));
      let subcategory=getSubcategory(category,params.get('subcategory'));
      let total=parseInt(params.get('total'));
      let minimum=parseInt(params.get('minimum'));
     
      // body=querystring.decode(body);            
      // let household=body.household;
      
      // let item=body.item;
      // let autolist=body.autolist;
      // let username=body.username;
      // let email=body.email;
      // let category=determineCategory(body.category);
      // let subcategory=getSubcategory(category,body.subcategory);
      // let total=parseInt(body.total);
      // let minimum=parseInt(body.minimum);

      let path='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';
      

      //put contents of old file into array
      let newFile=[];
      let fields;
      let added;
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
    
      rl.on('line', (line) => {
        if(autolist=='on'){
          added=true
        }
        else{
          added=false;
        }
        fields = line.split(',');
        if(fields[0]==item){ //item found
          line=fields[0]+','+fields[1]+','+fields[2]+','+
          fields[3]+','+fields[4]+','+fields[5]+','+
          autolist+','+fields[7]+','+fields[8]+','+added;

          newFile.push(line);
        }
        else{
          newFile.push(line);
        }
       
      }).on('close',(line)=>{        
         //delete old file  
          fs.unlink(path, function (err) {
          if (err) throw err;
            console.log('File deleted!');

            //rewrite file
            let f;
            for(f of newFile){
              fs.appendFile(path,f+'\r\n' , function (err) {
                  if (err) throw err;
                  console.log('File updated!');
              });  
            }     
            
            if(autolist=='on'){            
              if(total<minimum){
                console.log('put shoppinglist');
                putShoppinglist(username,email,household,category,subcategory,item,item,true);
              }
              else{
                putShoppinglist(username,email,household,category,subcategory,item,item,false);
              }
            }  
            else{
                putShoppinglist(username,email,household,category,subcategory,item,item,false);
            }      

            res.writeHead(200);
            res.end();
          });  
        
      });
    });
  }


  if(req.url=='/api/putFavourites'){
    
    let body='';        
    req.on('data', function (chunk) {
      body += chunk;
      
    });
    req.on('end',function(){   
      let 	params =new URLSearchParams(body);
      let household=params.get('household');
      let item=params.get('item');
      let favourites=params.get('favourites');
      let username=params.get('username');
      let email=params.get('email');
      let category=determineCategory(params.get('category'));
      let subcategory=getSubcategory(category,params.get('subcategory'));
     
      // body=querystring.decode(body);            
      // let household=body.household;
      
      // let item=body.item;
      // let favourites=body.favourites;
      // let username=body.username;
      // let email=body.email;
      // let category=determineCategory(body.category);
      // let subcategory=getSubcategory(category,body.subcategory);
      
      let path='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';
      

      //put contents of old file into array
      let newFile=[];
      let fields;
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
    
      rl.on('line', (line) => {
        
        fields = line.split(',');
        if(fields[0]==item){ //item found
          line=fields[0]+','+fields[1]+','+fields[2]+','+
          fields[3]+','+fields[4]+','+fields[5]+','+
          fields[6]+','+favourites+','+fields[8]+','+fields[9];

          newFile.push(line);
        }
        else{
          newFile.push(line);
        }
       
      }).on('close',(line)=>{        
         //delete old file  
          fs.unlink(path, function (err) {
          if (err) throw err;
            console.log('File deleted!');

            //rewrite file
            let f;
            for(f of newFile){
              fs.appendFile(path,f+'\r\n' , function (err) {
                  if (err) throw err;
                  console.log('File updated!');
              });  
            }     
            
            putFavouritesFile(username,email,household,category,subcategory,item,item,favourites)
            res.writeHead(200);
            res.end();
          });  
        
      });
    });
  }


  if(req.url=='/api/putItem'){
    
    let body='';        
    req.on('data', function (chunk) {
      body += chunk;
      
    });
    req.on('end',function(){      
      let 	params =new URLSearchParams(body);
      let username=params.get('username');  
      let email=params.get('email');  
      let household=params.get('household');
      let category=determineCategory(params.get('category'));
      let subcategory=getSubcategory(category,params.get('subcategory'));
      let item=params.get('item');      
      let newitem=params.get('newitem');
      let minimum=parseInt(params.get('minimum'));
      let total=parseInt(params.get('total'));
      let duration=params.get('duration');
      let deleted=params.get('deleted');
      let notifications=params.get('notifications');
      let autolist=params.get('autolist');
      let favourites=params.get('favourites');
  
      // body=querystring.decode(body);  
      // let username=body.username;
      // let email=body.email;          
      // let household=body.household;      
      // let category=determineCategory(body.category);
      // let subcategory=getSubcategory(category,body.subcategory);
      // let item=body.item;      
      // let newitem=body.newitem;
      // let minimum=parseInt(body.minimum);
      // let total=parseInt(body.total);
      // let duration=body.duration;
      // let deleted=body.deleted;
      // let notifications=body.notifications;
      // let autolist=body.autolist;
      // let favourites=body.favourites;
             
      let path='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';
      

      //put contents of old file into array
      let newFile=[];
      let fields;
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
    
      rl.on('line', (line) => {
        
        fields = line.split(',');
        if(fields[0]==item){ //item found
          line=newitem+','+fields[1]+','+minimum+','+duration+','+deleted+','+notifications+','+autolist+','+favourites+','+fields[8]+','+fields[9];  
          newFile.push(line);
        }
        else{
          newFile.push(line);
        }
       
      }).on('close',(line)=>{        
          
         //delete old file  
          fs.unlink(path, function (err) {
          
          if (err) throw err;
            console.log('File deleted! Item.txt');
            //rewrite file
            let f;
            for(f of newFile){
              fs.appendFileSync(path,f+'\r\n' , function (err) {
                  if (err) throw err;
                  console.log('File updated!: '+path);                                                                                         
              });                            
            }  
            // update the Transactions.txt file in case the item name or the minimum qty allowed was changed
            editTransactions(username,email,household,item,newitem,minimum,deleted);


            //update the expiries.txt file (in case the duration was altered)

            putFavouritesFile(username,email,household,category,subcategory,item,newitem,favourites);            
            if(autolist=='on'){            
              if(total<minimum){
                console.log('put shoppinglist');
                putShoppinglist(username,email,household,category,subcategory,item,newitem,true);
              }
              else{
                putShoppinglist(username,email,household,category,subcategory,item,newitem,false);
              }
            }  
            else{
                putShoppinglist(username,email,household,category,subcategory,item,newitem,false);
            }    
            
            

            
            getNotifications(username,email,household,function(result){
              console.log(result)
            });     
            res.writeHead(200);
            res.end();   
          });          
      });
    });
  }


  
  if(req.url=='/api/putStock'){
    let message='Stock updated successfully';
    let origin='transactions';     
    let body='';        
    req.on('data', function (chunk) {
      body += chunk; 
    });
    req.on('end',function(){     
      let 	params =new URLSearchParams(body);
      let household=params.get('household');
      let itemsBought=params.get('itemsBought');          
      let username=params.get('username');
      let email=params.get('email'); 
   
      // body=querystring.decode(body);            
      // let itemsBought=body.itemsBought;    
      // let household=body.household;
      // let username=body.username;
      // let email=body.email;      
      itemsBought=JSON.parse(itemsBought);       
      let i;           
      for (i of itemsBought){                  
        if(i.itemTotal!=0){
          updateStock(i,username,email,household);
        }
      }   
    
      res.writeHead(200);
      let path='http://localhost:3000/error/'+origin+'/'+message;
      res.end(JSON.stringify({path:path}));
    });    
  }



  //Delete requests


  if(req.url=='/api/deleteUser'){
    let body='';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end',function(){
      let 	params =new URLSearchParams(body);
      let username=params.get('username');
      let email=params.get('email');      
      let newFile=[];
      let path='./src/users.txt';

      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
    
      rl.on('line', (line) => {
        let fields=line.split(',');
        if(fields[0]!=email){ //exclude user from new file
          newFile.push(line);
        }
        
       
      }).on('close',(line)=>{        
         //rewrite the file          
         let f;
         if(newFile.length!=0){
          for(f of newFile){
            fs.writeFileSync(path,f+'\r\n' , function (err) {
                if (err) throw err;
                console.log('File updated!');             
            });  
          } 
         }
         else{
          fs.writeFileSync(path,'', function (err) {
              if (err) throw err;
              console.log('File updated!');             
          }); 
         }
        
         
         
        //  delete user folder
         
         path='./src/households/'+username+email;
        
         var rimraf = require("rimraf");
         
         
         rimraf.sync(path);

         res.writeHead(200);
         res.end('Account successfully deleted');
      });



                 
    })
  }


  if(req.url=='/api/deleteItem'){
    let body='';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end',function(){

      let 	params =new URLSearchParams(body);
      let username=params.get('username');
      let email=params.get('email');
      let household=params.get('household');            
      let category=determineCategory(params.get('category'));
      let subcategory=getSubcategory(category,params.get('subcategory'));
      let item=params.get('item');   

      // body=querystring.decode(body);
      // let username=body.username;
      // let email=body.email
      // let household=body.household;            
      // let category=determineCategory(body.category);
      // let subcategory=getSubcategory(category,body.subcategory);
      // let item=body.item;      
      let deleted=true;
      let path='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';
      
      //iterate old file and include all records but the one to be deleted in a new array
      let newFile=[];
      let deletedRecord='';
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
      rl.on('line', (line) => {        
        let fields = line.split(',');
        if(fields[0]!=item){
          newFile.push(line);          
        }
        else{          
          // assign the record to be deleted to a variable with which to update the transactions.txt later on
          deletedRecord=line;
          
        }
      }).on('close',(line)=>{      

        //delete old file
        fs.unlink(path, function (err) {
            if (err) throw err;
            console.log('File deleted! (item.txt)');

          //Rewrite the file
          
          if(newFile!=''){ //this means that there were more than one items (more than the one deleted) and so the newFile is not empty
            let f;
            for(f of newFile){
              fs.appendFileSync(path,f+'\r\n', function (err) {
                  if (err) throw err;
                  console.log('Saved!');
                });
            }
          }
          else{
            console.log('empty');
            fs.appendFile(path,'', function (err) {
                if (err) throw err;
                console.log('Saved!aaaa');                              
              });
            
          }
          //edit the transaction file
          deletedRecord=deletedRecord.split(',');
          editTransactions(username,email,household,deletedRecord[0],deletedRecord[0],deletedRecord[2],deleted); 
          deleteFavourites(username,email,household,category,subcategory,item);
          deleteExpiriesFile(username,email,household,item,'');
          getNotifications(username,email,household,function(result){
            console.log(result)
          });     

          deleteShoppinglist(username,email,household,item);
          res.writeHead(200);
          res.end();   
                    
          });
      });
    })
  }

  // removes item from expiries.txt, thus removing it from the notifications  
  if(req.url=='/api/deleteExpiry'){
    let body='';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end',function(){
      let 	params =new URLSearchParams(body);
      let username=params.get('username');
      let email=params.get('email');      
      let household=params.get('household');
      let item=params.get('item');
      let dateAdded=params.get('date');  

      // body=querystring.decode(body);
      // let username=body.username;
      // let email=body.email;      
      // let household=body.household;
      // let item=body.item;
      // let dateAdded=body.date;
      deleteExpiriesFile(username,email,household,item,dateAdded);  
      res.writeHead(200);
      res.end('success. Deleted from expiries.txt');           
    })
  }

  if(req.url=='/api/deleteShoppingList'){
    let body='';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end',function(){

      //DEPRECATED
      // body=querystring.decode(body);
      // let household=body.household;
      // let item=body.item;
      // let category=body.category;
      // let subcategory=body.subcategory;

      body=new URLSearchParams(body);
      let household=body.get('household');
      let username=body.get('username');
      let email=body.get('email');      
      let item=body.get('item');
      let category=body.get('category');
          category=determineCategory(category);
      let subcategory=body.get('subcategory');
          subcategory=getSubcategory(category,subcategory);
          
    
      //delete from shoppinglist
      deleteShoppinglist(username,email,household,item);

      
      //remove autolist from item
      let path='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';
      let newFile=[];
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
      rl.on('line', (line) => {        
        let fields = line.split(',');
        if(fields[0]==item){
          line=fields[0]+','+fields[1]+','+fields[2]+','+fields[3]+','+fields[4]+','+fields[5]+','+'off'+','+
               fields[7]+','+fields[8]+','+false;
          newFile.push(line)
        }
        else{
          newFile.push(line);
        }
      }).on('close',(line)=>{    
        
        //recreate empty file
        fs.writeFile(path, '', function (err) {
            if (err) throw err;
            console.log('Saved!');
          });

        // rewrite file  with updated data
        
        for(f of newFile){
          fs.appendFileSync(path, f+'\r\n', function (err) {
              if (err) throw err;
              console.log('Saved! Items.txt');
            });
        }
        res.writeHead(200);
        res.end('successfully removed item from shopping list');  
                
      });



              
    })
  }


  //adds to favourites.txt
  function postFavouritesFile(username,email,household,category,subcategory,item){
    
    let path='./src/households/'+username+email+'/'+household+'/favourites.txt';
      let str= item+','+category+','+subcategory;
      fs.appendFile(path,str+'\r\n',function (err) {
        if (err) throw err;
        console.log('Saved! Post Favourites.txt');
      });  

  }


  //adds/removes item from favourites when item is modified and eventually changes the item's name if it has been modified
  function putFavouritesFile(username,email,household,category,subcategory,item,newitem,favourites){
    let path='./src/households/'+username+email+'/'+household+'/favourites.txt';
    let newFile=[];

    if(favourites=='off'){
      removeFavourite(item);
    }
    else{

      //check whether file is already a favourite    
      
      let isIncluded=false;
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
      rl.on('line', (line) => {        
        let fields = line.split(',');
        if(fields[0]==item){
          isIncluded=true;
        }
      }).on('close',(line)=>{   
        
        //if item not already included, add it to the favourites.txt
        if(isIncluded==false){          
          postFavouritesFile(username,email,household, category,subcategory,item)
        }
        else{

          //item is included but now has a new name
          if(newitem!=item){
              
              removeFavourite(item); //remove old name from favourites.txt
              //add new name to favourites.txt
              postFavouritesFile(username,email,household,category,subcategory,newitem);
          }
        }
        
      });
    }


    function removeFavourite(item){
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
      rl.on('line', (line) => {        
        let fields = line.split(',');
        if(fields[0]!=item){
          newFile.push(line);
        }
      }).on('close',(line)=>{             
        //delete old file
        fs.unlink(path, function (err) {
            if (err) throw err;
            console.log('File deleted! Favourites.txt');
          //recreate the file
          let f;
          if(newFile!=''){
            for(f of newFile){
              fs.appendFileSync(path, f+'\r\n', function (err) {
                  if (err) throw err;
                  console.log('Saved! Favourites.txt');
                });
            }
          }
          else{
            fs.appendFile(path, '', function (err) {
                if (err) throw err;
                console.log('Saved! Favourites.txt');
              });
          }
        });
      });
    }
  }

  //deletes item from favourites.txt
  function deleteFavourites(username,email,household,category,subcategory,item){
    
    let path='./src/households/'+username+email+'/'+household+'/favourites.txt';
    let newFile=[];

    const rl = readline.createInterface({
      input: fs.createReadStream(path),
      output: process.stdout,
      terminal: false
    });
    rl.on('line', (line) => {        
      let fields = line.split(',');
      if(fields[0]!=item){
        newFile.push(line);
      }
    }).on('close',(line)=>{             
      //delete old file
      fs.unlink(path, function (err) {
          if (err) throw err;
          console.log('File deleted! Favourites.txt');
        //recreate the file
        let f;
        if(newFile!=''){
          for(f of newFile){
            fs.appendFileSync(path, f+'\r\n', function (err) {
                if (err) throw err;
                console.log('Saved! Favourites.txt');
              });
          }
        }
        else{
          fs.appendFile(path, '', function (err) {
              if (err) throw err;
              console.log('Saved! Favourites.txt');
            });
        }
      });
    });
  }

  function editTransactions(username,email,household,item,newitem,minimum,deleted){        
     let path='./src/households/'+username+email+'/'+household+'/transactions.txt';
     let fields;  
     let newFile=[];
     const rl = readline.createInterface({
      input: fs.createReadStream(path),
      output: process.stdout,
      terminal: false
    });
    rl.on('line', (line) => {        
       fields= line.split(',');
       if(fields[0]==item){
        line=newitem+','+fields[1]+','+fields[2]+','+minimum+','+fields[4]+','+fields[5]+','+deleted;
         newFile.push(line);
       }
       else{
         newFile.push(line);         
       }            
    }).on('close', function(line) {
      console.log(newFile)
      fs.unlink(path, function (err) {
          if (err) throw err;
          console.log('File deleted!');
          let f;
          for (f of newFile){
            fs.appendFileSync(path, f+'\r\n');
          }
      });
     });
  }

  function updateTransactions(username,email,household,item,transaction,total,minimum,category,subcategory,deleted){        
    path='./src/households/'+username+email+'/'+household+'/'+'transactions.txt';
     let content=item+','+transaction+','+total+','+minimum+','+category+','+subcategory+','+deleted;              
      console.log(content);
    
    let newContent=[];

    fs.appendFile(path, content+'\r\n', function (err) {
        if (err) throw err;
        console.log('Transactions updated');

      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
      let c=0;
      rl.on('line', (line) => {        
          c++;          
          newContent.push(line);
       
      }).on('close',(line)=>{                
         if(c==11){
          newContent.splice(0,1);          
          let l=newContent.length;          
          fs.unlink(path, function (err) {
              if (err) throw err;
              console.log('File deleted!');

              for(c=0;c<l;c++){
                fs.appendFileSync(path, newContent[c]+'\r\n', function (err) {
                    if (err) throw err;
                    console.log('Transactions updated');
                  });
              }

            });
         }
      });

      });

      
      
  }  

  //function that gathers eventual notifications for each item
  function getNotifications(username,email,household,callback){
    
    deleteNotificationsFile(username,email,household,username,email);
    
    let basepath1='./src/households/'+username+email+'/'+household+'/groceries/';
    let category1='groceries';
    let basepath2='./src/households/'+username+email+'/'+household+'/household/';
    let category2='household';

    getNotificationsGroceries(basepath1,function(result){
      if(result==true){
        getNotificationsHousehold(basepath2,function(result){
          if(result==true){
            checkExpiration(username,email,household);
            callback(true);
          }
        });
      }
    });
    

    //gather notifications for groceries
    function getNotificationsGroceries(basepath,callback){
      let c;    
      for(c=1;c<14;c++){
        
        if(c<13){
          let subcategory=c;
          console.log(c);
          let path=basepath+c+'.txt'; 
          console.log(path);
         //read through each file to see if there are any notifications
          const rl = readline.createInterface({
            input: fs.createReadStream(path),
            output: process.stdout,
            terminal: false
          });
          rl.on('line', (line) => {        
            let fields = line.split(',');
            if(fields[5]=='on'){

              checkStock(fields[1],fields[2],function(response){
                if(response==true){
                  if(fields[9]=='true'){
                    postNotificationsFile(username,email,household,fields[0],notificationMessage,category1,subcategory,fields[6],true);       
                  }
                  else{
                    postNotificationsFile(username,email,household,fields[0],notificationMessage,category1,subcategory,fields[6],false);       
                  }
                       
                }
              });
              
              
            }
          }).on('close',(line)=>{    
            // console.log('retrieved notifications for '+path)                  
          });  
        }
        else{
          callback(true);
        }
      }
    }

    //gather notifications for household items
    function getNotificationsHousehold(basepath,callback){      
      let c;
      for(c=1;c<8;c++){
        if(c<7){          
            console.log(c);
            let subcategory=c;
            let path=basepath+c+'.txt';
            console.log(path)  
            //read through each file to see if there are any notifications
            const rl = readline.createInterface({
              input: fs.createReadStream(path),
              output: process.stdout,
              terminal: false
            });
            rl.on('line', (line) => {        
              let fields = line.split(',');
              if(fields[5]=='on'){
                checkStock(fields[1],fields[2],function(response){
                  if(response==true){
                    if(fields[9]=='true'){
                      postNotificationsFile(username,email,household,fields[0],notificationMessage,category1,subcategory,fields[6],true);       
                    }
                    else{
                      postNotificationsFile(username,email,household,fields[0],notificationMessage,category1,subcategory,fields[6],false);       
                    }
                  }
                })                
                
              }
            }).on('close',(line)=>{     
              // console.log('retrieved notifications for '+path);
            });
        }
        else{
          callback(true);
        }
      } 
    } 

  }

  function deleteNotificationsFile(username,email,household){
    
    let path='./src/households/'+username+email+'/'+household+'/notifications.txt';
    
    fs.writeFile(path, '', function (err) {
        if (err) throw err;
        console.log('Overwritten! notifications.txt');
      });

  }

  function postNotificationsFile(username,email,household,item,message,category,subcategory,autolist,added){
      let path='./src/households/'+username+email+'/'+household+'/notifications.txt';    
      let str;   
      str=item+','+message+','+category+','+subcategory+','+autolist+','+added+'\r\n';
   
    fs.appendFile(path, str, function (err) {
      if (err) throw err;
      console.log('Saved! Notifications.txt');
    });
  }


  function createNotificationsFile(username,email,household){
    let path='./src/households/'+username+email+'/'+household+'/notifications.txt';
    fs.appendFile(path,'', function (err) {
        if (err) throw err;
        console.log('Saved! Notifications.txt');
    });

  }

  function checkDuplicates(username,email,household,item,callback){
    console.log('START HERE');
    let basepath1='./src/households/'+username+email+'/'+household+'/groceries/';    
    let basepath2='./src/households/'+username+email+'/'+household+'/household/';    
        

    scan1(basepath1,item,1);  

    function scan1(basepath,item,c){
      let path = basepath+c+'.txt';
      let exists=false;
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
      rl.on('line', (line) => {        
        let fields = line.split(',');
        if(fields[0]==item){
          exists=true;
        }
        console.log(line);
      }).on('close',(line)=>{    
        console.log(path); 

        if(exists==true){
          console.log(exists);  
          callback(exists);
        }
        else{
          if(c<12){
            c=c+1;
            scan1(basepath1,item,c)
          }
          else{
            scan2(basepath2,item,1);
          }
        }                       
      });

    }
   
    function scan2(basepath,item,c){
      let path = basepath+c+'.txt';
      let exists=false;
      const rl = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
      });
      rl.on('line', (line) => {        
        let fields = line.split(',');
        if(fields[0]==item){
          exists=true;
        }
        console.log(line);
      }).on('close',(line)=>{    
        console.log(path); 

        if(exists==true){
          console.log(exists);  
          callback(exists);
        }
        else{
          if(c<6){
            c=c+1;
            scan2(basepath2,item,c)
          }
          else{
            callback(exists);
          }
        }                       
      });
    }   
  }

  function checkExpiration(username,email,household){
    let today=new Date();   
                  
    let oneDay=(24*60*60*1000); 
    
    let path='./src/households/'+username+email+'/'+household+'/expiries.txt';
    let newFile=[];
    const rl = readline.createInterface({
      input: fs.createReadStream(path),
      output: process.stdout,
      terminal: false
    });
    rl.on('line', (line) => {        
      let fields = line.split(',');
      let duration=fields[2];
      let initialDate=fields[3];
          initialDate=Date.parse(initialDate);
      if(duration!='No expiration'){

        //convert duration into integer
        duration=parseInt(duration);

        let dayDifference=today-initialDate;
        // let dayDifference=today-(new Date(2021, 4, 24));

        //round up day difference to show number of days (not milliseconds)
        dayDifference=dayDifference/oneDay;  
        dayDifference=Math.floor(dayDifference);

        if(dayDifference>duration){
          newFile.push(line);           
        } 
      }
    
    }).on('close',(line)=>{      

      let path2='./src/households/'+username+email+'/'+household+'/notifications.txt';

      //delete old file      
        let f;
        for(f of newFile){
          //create record string for notifications.txt (must be item, message,category,subcategory,autolist,added)
          // item, message,category,subcategory,autolist,added
          let string= f.split(',');
          let item=string[0];
          let qty=string[1];
          let duration=string[2];
          let dateAdded=string[3];

          string=item+','+qty+' expired'+','+''+','+''+','+''+','+dateAdded;
          fs.appendFileSync(path2, string+'\r\n', function (err) {
              if (err) throw err;
              console.log('Saved!');
            });
        }      
    });
           
  }

  function checkStock(total,minimum,callback){
    total=parseInt(total);
    minimum=parseInt(minimum);
    if(total<minimum){    
      console.log('below minimum');
      callback(true);
    }
    else{
      console.log('above minimum')
      callback(false);
    }
  }

  //adds new item to shoppinglist.txt
  function postShoppinglist(username,email,household,category,subcategory,item){
    let path='./src/households/'+username+email+'/'+household+'/shoppinglist.txt';
    let string=item+','+category+','+subcategory;
    
    fs.appendFile(path, string+'\r\n', function (err) {
        if (err) throw err;
        console.log('Saved!-shoppinglist.txt');
      });
  }

  //updates shoppinglist.txt
  function putShoppinglist(username,email,household,category,subcategory,item,newitem,belowstock){
    //check if item is not already on the list
    let exists=false;
    let path='./src/households/'+username+email+'/'+household+'/shoppinglist.txt';
    let newFile=[];

    const rl = readline.createInterface({
      input: fs.createReadStream(path),
      output: process.stdout,
      terminal: false
    });
    rl.on('line', (line) => {        
      let fields = line.split(',');
      if(fields[0]==item){
        exists=true;
        newFile.push(newitem+','+fields[1]+','+fields[2]);
      }
      else{
        newFile.push(line);
      }

      

    }).on('close',(line)=>{     
      //add the new item if it is below stock
      if(exists==false){
        if(belowstock==true){
          postShoppinglist(username,email,household,category,subcategory,newitem);
        }
      }
      else{
        if(belowstock==true){
          //delete old file
          fs.writeFile(path,'', function (err) {
              if (err) throw err;
              console.log('File deleted! shoppinglist.txt');

              //rewrite the file with the updated information  
              let f;
              for(f of newFile){
                let string=f+'\r\n';
                fs.appendFileSync(path, string, function (err) {
                    if (err) throw err;
                    console.log('Saved! shoppinglist.txt');
                  });
              }
            });
        }  
        else{ // item modified and no longer results as being below stock (for example the limit of the minimum allowed qty has been reduced)

          //create empty file
          fs.writeFile(path,'',function (err) {
              if (err) throw err;
              console.log('File deleted! shoppinglist.txt');          
              //rewrite the file with the updated information  
              let f;
              for(f of newFile){
                let fields=f.split(',');
                if(fields[0]!=newitem){
                  let string=f+'\r\n';
                fs.appendFileSync(path, string, function (err) {
                    if (err) throw err;
                    console.log('Saved! shoppinglist.txt');
                  });
                }
                
              }
            });
        }
      }            
    });
  }

  //deletes item from shopping list
  function deleteShoppinglist(username,email,household,item){
    let path='./src/households/'+username+email+'/'+household+'/shoppinglist.txt'
    let newFile=[];

    const rl = readline.createInterface({
      input: fs.createReadStream(path),
      output: process.stdout,
      terminal: false
    });
    rl.on('line', (line) => {        
      let fields = line.split(',');
      if(fields[0]!=item){
        newFile.push(line);
      }
    }).on('close',(line)=>{            
      //delete old file
      fs.unlink(path, function (err) {
          if (err) throw err;
          console.log('File deleted!');

          //recreate empty shoppinglist.txt
          fs.appendFileSync(path,'', function (err) {
            if (err) throw err;
            console.log('Saved! shoppinglist.txt');
          });
          //rewrite file without the deleted item
          let f;
          for(f of newFile){
            fs.appendFileSync(path, f+'\r\n', function (err) {
                if (err) throw err;
                console.log('Saved! shoppinglist.txt');
              });
          }
        });
            
    });
  }


  function putItemsFile(username,email,household,category,subcategory,item,shoppinglist){
    
    let path='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';
    let newFile=[];
    const rl = readline.createInterface({
      input: fs.createReadStream(path),
      output: process.stdout,
      terminal: false
    });
    rl.on('line', (line) => {        
      let fields = line.split(',');
      if(fields[0]==item){
        newFile.push(fields[0]+','+fields[1]+','+fields[2]+','+fields[3]+','+fields[4]+','+fields[5]+','+fields[6]+','+fields[7]+','+fields[8]+','+shoppinglist);
      }
      else{
        newFile.push(line);
      }
    }).on('close',(line)=>{        
      
      //delete  old file
      fs.writeFileSync(path,'', function (err) {
          if (err) throw err;
          console.log('Deleted! Items.txt');                     
        });

    //rewrite the file
    let f;
    for(f of newFile){
      fs.appendFileSync(path, f+'\r\n', function (err) {
          if (err) throw err;
          console.log('Saved! items.txt');
        });
    }   
      
    });
  
  }

  //keeps log of changes in stock quantities to control expiry dates of  items of the 
  //same category (a.e. previously added oranges will expire sooner than the rest of them)
  function postExpiriesFile(username,email,household,item,qty,duration,dateAdded){
    let  path= './src/households/'+username+email+'/'+household+'/expiries.txt';
    console.log(duration);
    let string=item+','+qty+','+duration+','+dateAdded;
    fs.appendFile(path, string+'\r\n', function (err) {
        if (err) throw err;
        console.log('Saved! expiries.txt');
      });
  }


  function deleteExpiriesFile(username,email,household,item,dateAdded){    
    let path='./src/households/'+username+email+'/'+household+'/expiries.txt';

    dateAdded=dateAdded.split('GMT');
    dateAdded=dateAdded[0];
    //iterate old file and include all records but the one to be deleted in a new array
    let newFile=[];      
    const rl = readline.createInterface({
      input: fs.createReadStream(path),
      output: process.stdout,
      terminal: false
    });
    rl.on('line', (line) => {
      let fields = line.split(',');  
      let savedDate=fields[3].split('GMT');
          savedDate=savedDate[0];            
      if(dateAdded!=''){
        //only notification is removed
        if((fields[0]!=item)||(fields[0]==item && savedDate!=dateAdded)){
          newFile.push(line);                             
        }                 
      }
      else{
        //item removed completely from stock
        if(fields[0]!=item){
          newFile.push(line);          
        }      
        console.log(line)  ;
      }            
    }).on('close',(line)=>{      

      //delete old file
      fs.writeFile(path,'', function (err) {
        if (err) throw err;         
        let f;
        //rewrite the file
        for(f of newFile){
          fs.appendFileSync(path, f+'\r\n', function (err) {
              if (err) throw err;
              console.log('Saved! expiries.txt' +f);                  
          });            
        }                    
      });
    });
    
  }


  function updateStock(item,username,email,household){

    let itemName=item.item;
    let itemTotal=item.itemTotal;
        itemTotal=parseInt(itemTotal);

    let category=item.category;
        category=determineCategory(category);
    let subcategory=item.subcategory;
        subcategory=getSubcategory(category,subcategory);    
    let path='./src/households/'+username+email+'/'+household+'/'+category+'/'+subcategory+'.txt';



        
    let today=new Date();  
    console.log('path: '+path);
    let newFile=[];
    const rl = readline.createInterface({
      input: fs.createReadStream(path),
      output: process.stdout,
      terminal: false
    });
    rl.on('line', (line) => {        
      let fields = line.split(',');

      

      if(fields[0]==itemName){

        let added=fields[9];
        let oldTotal = parseInt(fields[1]);
        let newTotal=itemTotal+oldTotal;
        console.log("new total: "+ newTotal);
        let minimum=parseInt(fields[2]);        
        if(newTotal<minimum && fields[6]=='off'){
          added=false;
        }

        line=itemName+','+newTotal+','+fields[2]+','+fields[3]+','+fields[4]+','+fields[5]+','+fields[6]+','+fields[7]+','+fields[8]+','+added;

        newFile.push(line);
      }
      else{
        newFile.push(line);
      }

    }).on('close',(line)=>{    
      
        //rewrite the file

        fs.writeFile(path, '', function (err) {
            if (err) throw err;
            
            let f;

            for(f of newFile){

              fs.appendFileSync(path, f+'\r\n', function (err) {
                  if (err) throw err;
                  console.log('Saved! item.txt');
                });

              field=f.split(',');
              if(field[0]==itemName){
                updateTransactions(username,email,household,itemName,itemTotal,field[1],field[2],category,subcategory,false);
                postExpiriesFile(username,email,household,itemName,itemTotal,field[3],today);
                getNotifications(username,email,household,function(result){
                  console.log(result);
                });


              //update shopping list
                if(field[6]=='on'){ //autolist           
                  if( parseInt(field[1])<parseInt(field[2])){ //total<minimum
                    console.log('put shoppinglist');
                    putShoppinglist(username,email,household,category,subcategory,itemName,itemName,true);
                  }
                  else{
                    putShoppinglist(username,email,household,category,subcategory,itemName,itemName,false);
                  }
                }  
                else{
                    putShoppinglist(username,email,household,category,subcategory,itemName,itemName,false);
                } 


              }  
            }
        });
    });



  }

  

}).listen(port);