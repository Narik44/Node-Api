//dependencies
const http = require('http')
const https=require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')
const fs= require('fs');




//Instantiating http server

const httpServer = http.createServer(function(req, res) {

  unifiedServer(req,res)

})


//start the http server, and have it listen on a port

httpServer.listen(config.httpPort, function() {
  console.log(`listening on port ${config.httpPort} in ${config.envName} mode`)

})


//Instantiating https server

const httpsServerOptions={
  'key':fs.readFileSync('./https/key.pem'),
  'cert':fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsServerOptions,function(req, res) {


  unifiedServer(req,res)

})


//start the http server, and have it listen on a port

httpsServer.listen(config.httpsPort, function() {
  console.log(`listening on port ${config.httpsPort} in ${config.envName} mode`)

})
//all server logic for both http and https

const unifiedServer=function(req,res){


    //get the request url and parse it

    const parsedUrl = url.parse(req.url, true) //true as second arg tell url to parse for query object as well
    console.log(parsedUrl)


    //get the req path

    const path = parsedUrl.pathname
    console.log(path)
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')
    console.log(trimmedPath)


    //get the http method

    const method = req.method.toLowerCase()
    console.log("method received is " + method)

    //get the headers as an object

    const headers = req.headers
    console.log("headers received are ", headers)

    //get the query params as object

    const queryStringObject = parsedUrl.query
    console.log('query received is', queryStringObject)

    //get the payload if any
    //payload coming to http server usually come in streams
    //so we need to colllect the streams as it comes in
    //untill it tells it's finished
    //so we will have only partial payload untill we get everything
    const decoder = new StringDecoder('utf-8')
    let buffer = ''
    req.on('data', function(data) {
      buffer += decoder.write(data)
    })


    //end event will always get call if there is no payload
    req.on('end', function() {
      buffer += decoder.end()

      //choose the handler this request should go to,if no one is found use not found handler


      const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notfound;
      //construct the data object to send to handler
      const data = {
        'trimmedPath': trimmedPath,
        'queryStringObject': queryStringObject,
        'headers': headers,
        'method': method,
        'payload': buffer
      };

      //route the request to handler chossen
      chosenHandler(data, function(statusCode, payload) {
        //use the status code callled by handler
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200


        //use the payload called by handler


        payload = typeof(payload) == 'object' ? payload : {}


        //convert Payload to string

        const payloadString = JSON.stringify(payload)

        //return the response
        res.setHeader('Content-Type', 'application/json')
        res.writeHead(statusCode)
        res.end(payloadString)



        //log the request payload

        console.log('returning this ', statusCode, payloadString)
      })




    })

  }



//define the handlers

var handlers = {}


handlers.ping=function(data,callback){
  //callback a http status code and payload object
  callback(200)
}

handlers.notfound = function(data, callback) {


  callback(404)


}
//define a request router

var router = {
  ping: handlers.ping
}
