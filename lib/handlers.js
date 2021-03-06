/*these
 * are the request handlers
 */

//dependencies
const helpers = require('./helpers')
const _data = require('./data');

//define the handlers

const handlers = {}

//new obj for users
handlers.users = function(data, callback) {

  const acceptableMethods = ['post', 'get', 'put', 'delete']
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405)
  }
}
//containers for handlers sub methods
handlers._users = {}

//users post
//required field fname lname phone password tosagreement
//optional data:none
handlers._users.post = function(data, callback) {

  //check if all required field are there
  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
  const tosagreement = typeof(data.payload.tosagreement) == 'boolean' && data.payload.tosagreement == true ? true : false

  if (firstName && lastName && phone && password && tosagreement) {
    //make sure the user doesnt already exist

    _data.read('users', phone, function(err, data) {
      if (err) {
        //users is not there so add him up
        //hash the passowrd
        const hashedPassword = helpers.hash(password)
        if (hashedPassword) {
          const userObject = {
            'firstName': firstName,
            'lastName': lastName,
            'phone': phone,
            'hashedPassword': hashedPassword,
            'tosagreement': true
          };

          //store the user
          _data.create('users', phone, userObject, function(err) {

            if (!err) {
              callback(200)
            } else {
              console.log(err)
              callback(500, {
                'error': 'could not create new user'
              });
            }
          })

        } else {
          callback(500, {
            'error': 'could not hash users password'
          });
        }

      } else {
        //user already exist
        callback(400, {
          'error': 'user with phone number already exists'
        })
      }

    })

  } else {
    callback(400, {
      'Error': 'Missing required fields'
    })
  }

}

//users get
//required data:phone
//optional data:none
//@TODO ONLY LET AUTHENTCATED USER ACCESS THEIR OBJECT,THEN LET THEM ACCESS OTHERS DATA
handlers._users.get = function(data, callback) {
  //CHECK IF NUMBER PROVIDED IS VALID
  const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false
  if (phone) {

    //look up for phone number
    _data.read('users', phone, function(err, data) {
      if (!err && data) {
        //remove hash password from user object

        delete data.hashedPassword
        callback(200, data)

      } else {
        callback(404)
      }
    })

  } else {
    callback(400, {
      'error': 'enter valid phone number'
    })
  }
}

//users put

//required data =phone
//optional data everything else,however atleast on should be there
//@TODO only let an AUTHENTCATED user update their object
handlers._users.put = function(data, callback) {
  //check for required field

  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
  //errror if phone is ITAfBgNVBAoTGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDERMA8GA1UECxMIbGVh

  if (phone) {
    if (firstName || lastName || password) {

      _data.read('users', phone, function(err, userData) {

        if (!err && userData) {
          //update the fields neccessary

          if (firstName) {
            userData.firstName = firstName
          }

          if (lastName) {
            userData.lastName = lastName
          }

          if (password) {
            userData.hashedPassword = helpers.hash(password)
          }

          //store it db

          _data.update('users', phone, userData, function(err) {
            if (!err) {
              callback(200)
            } else {
              callback(500, {
                'error': 'could not update the user'
              })
            }
          })
        } else {

          callback(400, {
            'error': "specified user not exist"
          })
        }
      })
    } else {
      callback(400, {
        'Error': 'Missing required field'
      })
    }


  } else {
    callback(400, {
      'Error': 'Missing required field'
    })
  }

}

//users delete

//required phone

//@TODO only let AUTHENTCATED
//clean up data files associated with the user
handlers._users.delete = function(data, callback) {
const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false
if (phone) {
  //look up for phone number
  _data.read('users', phone, function(err, data) {
    if (!err && data) {
      _data.delete('users', phone, function(err) {
        if (!err) {
          callback(200)
        } else {
          callback(500, {
            'error': 'could not delete user'
          })
        }
      })

    } else {
      callback(400, {
        'error': 'could not find user'
      })
    }
  })

} else {
  callback(400, {
    'error': 'enter valid phone number'
  })
}
}








handlers.ping = function(data, callback) {
  //callback a http status code and payload object
  callback(200)
}

handlers.notfound = function(data, callback) {


  callback(404)

}

//export the handlers

module.exports = handlers
