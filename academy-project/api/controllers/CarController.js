/**
 * CarController
 *
 * @description :: Server-side logic for managing cars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    createCarWithOwner: function (req, res) {
        sails.log.info(req.body);
        var results = Car.create(req.params.all()).exec(function (err, data) {
            sails.log("Callback");
            if (err) {
                sails.log.error(err);
                res.json(err);
            }
            else {
                res.json(data);
            }
        });
        sails.log(results);
        res.json(req.body);

    },

    getCarsFromUser: function (req, res) {
        Car.find({ where: { owner: req.body.owner } }, function (err, data) {
            if (err) {
                sails.log.error(err);
                res.json(err);
            }
            else {
                sails.log.info(data);
                res.json(data);
            }
        })
    },

    buyCar: function (req, res) {
        //XOR funkcija unutar if ispod -> samo jedan parametar prolazi 

        Car.findOne({ id: req.param('car_id') }).exec(function (err, car) {
            if (err) { throw err }
            else {
                var carOwner, carOwnerEntity;
                if (car.ownerUser) {
                    carOwner = car.ownerUser;
                    carOwnerEntity = "user";
                    sails.log.info("User is owner");
                }
                else {
                    carOwner = car.ownerShop;
                    carOwnerEntity = "shop";
                    sails.log.info("Shop is owner");
                }

                if ((req.param('user_id') && !req.param('shop_id')) || (!req.param('user_id') && req.param('shop_id'))) {
                    if (req.param('user_id')) {
                        if (BalanceService.spendByUser(req.param('user_id'), carOwner, "user", carOwnerEntity, car.sellingPrice)) {
                            Car.update({ id: Number(req.param('car_id')) }, { ownerShop: null, ownerUser: req.param('user_id') }).exec(function (err, data) {
                                if (err) {
                                    res.json(err);
                                }
                                else {
                                    res.json(data);
                                }
                            })
                        }
                        else{
                            res.json({errorMessage: "Transaction couldn't pass!"});
                        }
                    }
                    else if (req.param('shop_id')) {
                        sails.log.info("shop is buyer.");
                        if (BalanceService.spendByUser(req.param('shop_id'), carOwner, "shop", carOwnerEntity, car.sellingPrice)) {
                            Car.update({ id: Number(req.param('car_id')) }, { ownerShop: req.param('shop_id'), ownerUser: null }).exec(function (err, data) {
                                if (err) {
                                    res.json(err);
                                }
                                else {
                                    res.json(data);
                                }
                            })
                        }
                        else{
                            res.json({errorMessage: "Transaction couldn't pass!"});
                        }
                    }
                }
                else {
                    res.json({ errorMessage: 'Something is not right.' });
                }
            }
        })


    },

    rentCar: function (req, res) {
        Car.findOne({ id: Number(req.param("car_id")) }).exec(function (err, car) {
            if (err)
                res.json(err);
            else {
                sails.log.info("Owned by shop: ", car.ownerShop);
                sails.log.info("Rented: ", car.rented);
                sails.log.info("car: ", car);
                if (car.ownerShop != null && car.rented == null) {
                    Car.update({ id: Number(req.param('car_id')) }, { rented: req.param("user_id") }).exec(function (err, data) {
                        if (err) {
                            res.json(err);
                        }
                        else {
                            res.json(data);
                        }
                    });
                }
                else {
                    res.json({ "errorMessage": "Car rented or not owned by shop!!!" });
                }
            }
        })
    },

    returnCar: function (req, res) {
        Car.findOne({ id: Number(req.param("car_id")) }).exec(function (err, car) {
            if (err) {
                res.json(err);
            }
            else {
                if (car.rented != null) {
                    Car.update({ id: Number(req.param("car_id")) }, { rented: null }).exec(function (err, data) {
                        if (err) {
                            res.json(err);
                        }
                        else {
                            res.json(data);
                        }
                    })
                }
                else {
                    res.json({ "errorMessage": "Car is not rented!!!" });
                }
            }
        })
    }

};

