const http = require('http');

require("url");

const data = require('./data');

let getBody = (req,res,next) => {
    let dataCollect = [];

    req.on('data', dataChunk => {
        dataCollect.push(dataChunk);
    })

    req.on('end', () => {
        req.body = Buffer.concat(dataCollect).toString();
        console.log(req.body);
        if (req.headers["content-type"]==="application/json") {
            req.body = JSON.parse(req.body);

        }

        next(req,res);
    })
}

 let get =(req,res) => {
    
    
    
    if (req.url == "/data") {
        res.writeHead(200, {'content-type': 'application/json'});
        res.write(JSON.stringify(req.data));
        
        res.end();
    } else {
            res.statusCode = 400;
            res.write('no response');
            res.end();
    }
   
}

let post = (req, res) => {
    if (req.url == "/data") {
        req.data.push(req.body);
        
        res.writeHead(200, {"content-type": "application/json"});
        res.write(JSON.stringify(req.data));
        res.end();
      
    } else {
        res.statusCode = 400;
        res.write(`CANNOT POST ${req.url}`);
        res.end();
    }
  }

  let put  = (req, res) => {

    const url = req.url.split('?')[0];
    
    if (url == '/data'){
        const id = req.query.searchParams.get('id');
        console.log(id);
        res.writeHead(200, {'content-type': 'application/json'});
        req.data[id] = req.body;
        
        res.write(JSON.stringify(req.data[id]));
        res.end();
        

    } else {

        
    
            res.statusCode = 400;
            res.write(`CANNOT PUT ${req.url}`);
            res.end();
    

    }
}

let del = (req, res) => {

    const url = req.url.split('?')[0];

    if (url == '/data') {
        const id = req.query.searchParams.get('id');
        console.log(id);
        res.writeHead(200, {'content-type': 'application/json'});
        req.data.splice(id,1);
    
        res.write(JSON.stringify(req.data));
        res.end();
      
    } else {
      
        res.statusCode = 400;
        res.write(`CANNOT DELETE ${req.url}`);
        res.end();
    }
  }

const server = http.createServer((req,res) => {
    
    req.data = data;
    
    
    req.query = new URL(req.url, `http://${req.headers.host}`);
    console.log(req.query);

    
    if (req.method == "GET") {
        get(req,res);

    } else if (req.method == "POST") {
        getBody(req,res,post);

    } else if (req.method == "PUT") {
        getBody(req,res,put);

    } else if (req.method =="DELETE") {
        getBody(req,res, del);

    } else {
        res.statusCode = 400;
        res.write("no response");
        res.end();
    }



})



server.listen(3000);