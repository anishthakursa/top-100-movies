const bcrypt          = require('bcryptjs');

class user_manager {

    constructor(wagner) {
    	this.Users = wagner.get("User");
    }

	find(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Users.findOne(req);
		        resolve(user)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	insert(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Users.create(req);
		        resolve(user)
	      	} catch(error){
	      		reject(error);
	        }
	    })
	}
  
    update(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Users.update(
		        	req.userObj,
		        	{ where : req.conditons }
		        );
		        resolve(user)
	      	} catch(error){
	        	console.log(error);
	        	reject(error);
	        }
	    })
	}

}

module.exports  = user_manager;