const bcrypt          = require('bcryptjs');

class movie_manager {

    constructor(wagner) {
    	this.Movie = wagner.get("Movie");
		this.RankMovie = wagner.get("RankMovie")
    }

	find(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let movie  = await this.Movie.findOne(req);
		        resolve(movie)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	insert(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let movie  = await this.Movie.create(req);
		        resolve(movie)
	      	} catch(error){
	      		reject(error);
	        }
	    })
	}
  
    update(conds, request){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let movie  = await this.Movie.findByIdAndUpdate(
		        	request,
		        	conds
		        );
		        resolve(movie)
	      	} catch(error){
	        	console.log(error);
	        	reject(error);
	        }
	    })
	}

	async findAllPaginate(conds, sort, pageNumber, numberRecord){
	    return new Promise(async (resolve, reject)=>{
            try{

                let pipeLine = [
                    {
                        $match :  conds
                    },
                    {$sort: sort},
                    {
                        $facet : {
                            page: [{$count: "count"}],
                            Movie: [
                                
                                {$skip: pageNumber ? parseInt(numberRecord) * (pageNumber - 1):0 },
                                {$limit: parseInt(numberRecord)},
                            ]
                        }
                    },
                    {
                        $project: {
                            count: {$arrayElemAt: ["$page.count", 0]},
                            listing: "$Movie"
                        }
                    }
                ];
                let movie  = await this.Movie.aggregate(pipeLine);
                resolve({movie:movie[0].listing, page:Math.ceil(movie[0].count / parseInt(numberRecord)), count:movie[0].count})
            } catch(error){
              console.log(error)  
              reject(error);
            }
        }) 
    }

	findRank(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let movie  = await this.RankMovie.findOne(req);
		        resolve(movie)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	insertRank(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let movie  = await this.RankMovie.create(req);
		        resolve(movie)
	      	} catch(error){
	      		reject(error);
	        }
	    })
	}

	async findMovieRank(conds, pageNumber, numberRecord){
	    return new Promise(async (resolve, reject)=>{
            try{
				let limit = numberRecord;
				let skip = ((pageNumber-1)*limit);
				let movie = await this.RankMovie.find(conds).skip(skip).limit(limit).populate('movie_id');
				let count = await this.RankMovie.count({user_id : conds.user_id})
                resolve({movie:movie, page:Math.ceil(count / parseInt(numberRecord)), count:count})
            } catch(error){
              console.log(error)  
              reject(error);
            }
        }) 
    }

	deleteRank(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let movie  = await this.RankMovie.deleteMany(req);
		        resolve(movie)
	      	} catch(error){
	      		reject(error);
	        }
	    })
	}
}

module.exports  = movie_manager;