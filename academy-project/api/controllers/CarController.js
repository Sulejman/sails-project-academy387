/**
 * CarController
 *
 * @description :: Server-side logic for managing cars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
    createCarWithOwner: function(req, res){
        sails.log.info(req.body);
        //sails.log.info(req.body.seatNumber);
        //sails.log.info(req.body.engineVolume);
        //sails.log.info(req.body.owner);

        
        Car.create({
            
            brand: req.body.brand,
            manufacturer: req.body.manufacturer,
            color: req.body.color,
            //seatNumber: parseInt(req.body.seatNumber),
            //engineVolume: Number(req.body.engineVolume),
            transmission: req.body.transmission,
            owner: Number(req.body.owner)
            
        }).exec(function(err, data) {
            if(err){
                sails.log.error(err);
                res.json(err);
            }
            else{
                res.json(data);
            }
        });
        
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

