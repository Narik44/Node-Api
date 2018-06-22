//dependencies
const http = require('http')
const url = require('url')
const StringDecoder=require('string_decoder').StringDecoder
//the server sshould respons to all requests with string


const server = http.createServer(function(req, res) {


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
   let buffer =''
   req.on('data',function(data){
     buffer+=decoder.write(data)
   })


//end event will always get call if there is no payload
   req.on('end',function(){
     buffer+=decoder.end()

     //send the response

     res.end("hello world\n")


     //log the request payload

     console.log('request id received in ',buffer)
   })

})

//start the server, and have it listen on a port

server.listen(3000, function() {
  console.log('liostenin oon port 3000')
})
