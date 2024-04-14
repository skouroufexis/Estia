var xhttp = new XMLHttpRequest();    
xhttp.open("GET", "http://localhost:8080/api/getHouseholds");
xhttp.send();
xhttp.onload = function() {  
};

//form-url-encoded
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
let data=`household=${household}&category=${category}&subcategory=${subcategory}&item=${item}&newitem=${newItemName}&minimum=${minimum}&duration=${duration}&deleted=${deleted}&notifications=${notifications}&autolist=${autolist}&favourites=${favourites}`;

//FORM DATA
let body='';
let origin='stock';
let message;

req.on('data', function (chunk) {
  body += chunk;
});
req.on('end',function(){
  body=querystring.decode(body);

  let household=body.household;

  let path='households/'+household+'/'+category+'/'+subcategory+'.txt';

})

res.writeHead(301,{Location: 'http://localhost:3000/error/'+origin+'/'+message});
      
res.end();

//READLINE
const rl = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    terminal: false
  });
  rl.on('line', (line) => {        
    let fields = line.split(',');
  }).on('close',(line)=>{            
  });


//POST REQUEST WITH FORM DATA
let request=new XMLHttpRequest();                
        request.open('POST','postBlog2.php');
    
        let data=new FormData();
        
        data.append('blogDate',date);
        data.append('title',title);
        data.append('body',carbon);
        data.append('cover',cover);
    
        request.send(data);                  

        request.onload = function (){        
            
            alert(this.responseText);

            location.replace('admin-menu2.php');

        };


// append file with line break
newContent[c]+'\r\n'