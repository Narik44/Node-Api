//create and export configuration variables

//container for all environments

const environments={}


//stage(default )environment

environments.stage={

  'httpPort':3000,
  'httpsPort':3001,
  'envName':'stage',
  'hashingSecret':'thisIsNotASecret'

}


//prod environment

environments.prod={

  'httpPort':5000,
  'httpsPort':5001,
  'envName':'prod',
  'hashingSecret':'thisIsASecret'


}


//determine which one is to be exported

const currentEnv=typeof(process.env.NODE_ENV)=='string'?process.env.NODE_ENV.toLowerCase():''


//CHECK IF currentEnv IS ONE OF THE AVAILABLE environments,if not default to stage

const envToExport=typeof(environments[currentEnv])=='object'?environments[currentEnv]:environments.stage


//export the module

module.exports = envToExport
