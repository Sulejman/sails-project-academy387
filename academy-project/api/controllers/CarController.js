/**
 * CarController
 *
 * @description :: Server-side logic for managing cars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
    createCarWithOwner: function(req, res){
        sails.log.info(req.body);
        Car.create(req.params.all()).exec(function(err, data) {
            if(err){
                sails.log.error(err);
                res.json(err);
            }
            else{
                res.json(data);
            }
        });
        res.json(req.body);
        
    },
    
    getCarsFromUser: function (req, res) {
        Car.find({where: {owner: req.body.owner}}, function (err, data) {
           if(err){
                sails.log.error(err);
                res.json(err);
            }
            else{
                sails.log.info(data);
                res.json(data);
            } 
        })
    }
	
};

