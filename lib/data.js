/*
* library for storing and editing data
*/


//dependencies

const fs=require('fs');
const path =require('path')
const helpers=require('./helpers')


//container for the module
const lib={}

//base directory of the data folder
lib.baseDir=path.join(__dirname,'../.data/')
//write data to a file

lib.create=function(dir,file,data,callback){

  //open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
    if(!err&&fileDescriptor){
      //conver theh data to string so that we can write ti string
      const convertedData=JSON.stringify(data);
      //write to file and close it
      fs.writeFile(fileDescriptor,convertedData,function(err){
        if(!err){

          fs.close(fileDescriptor,function(err){
            if(!err){
              callback(false)
            }
            else{
              callback('error closing file')
            }
          })

        }else{
          callback('error writing to new file')

        }
      })
    }else{


      callback('could not create new file,it may already exist')
    }
  })


}

//read data from a file
lib.read=function(dir,file,callback){

  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
    if(!err && data){
      const parsedData=helpers.parseJsonToObject(data)
      callback(false,parsedData)
    }
    callback(err,data)
  })
}

//update the file with new data
lib.update=function(dir,file,data,callback){

  //open the file
     fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
       if(!err&&fileDescriptor){
         //convert the data to string
         var convertedData=JSON.stringify(data)

         //truncate the data
         fs.truncate(fileDescriptor,function(err){
           if(!err){
             //write to file and close it
             fs.writeFile(fileDescriptor,convertedData,function(err){
               if(!err){
                 fs.close(fileDescriptor,function(err){
                   if(!err){
                     callback(false)
                   }
                   else{
                     callback('error closing the file')
                   }
                 })
               }
           else{
             callback('errir writhing to filw')
           }
           })

           }else{
             callback('error truncating failed')
           }
         })

       }else{
         callback("could not open file to update it")
       }
     })
}

//delete a file

lib.delete=function(dir,file,callback){
  //unlinking the filr

fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
  if(!err){
    callback(false)
  }else{
    callback('unable to deltet the file')
  }
})
}






//export the file


module.exports=lib
