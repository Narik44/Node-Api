/* helpers
*for various tasks
*/
//dependencies

const crypto =require('crypto');
const config =require('../config');
//container for helpers
const helpers={}


//Create a SHA256 hash
helpers.hash=function(str){
  if(typeof(str)=='string'&&str.length>0){
    const hash=crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
    return hash
  }
  else{
    return false
  }
}

//parse a json string to obj function
helpers.parseJsonToObject=function(str){

  try{
    const obj=JSON.parse(str)
     return obj
  }catch(e){
    return {}
  }

}


//export the helpers
module.exports=helpers
