module.exports = {

    spendByBalance: function (buyerBalanceNumber, sellerBalanceNumber, amount) {

        Balance.findOne({ balanceNumber: buyerBalanceNumber }).exec(function (err, buyer) {
            if (err) {
                throw err;
            }
            else {
                sails.log.info("Balance found");
                sails.log.info("Blance: ", buyer);
                if (Number(buyer.amount) > amount) {
                    var newAmount = Number(buyer.amount) - amount;
                    Balance.update({ balanceNumber: buyerBalanceNumber }, { amount: newAmount }).exec(function (err, buyerAmount) {
                        if (err) {
                            throw err;
                        }
                        else {
                            sails.log.info("Balance updated");
                            Balance.findOne({ balanceNumber: sellerBalanceNumber }).exec(function (err, seller) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    sails.log.info("Seller balance found");
                                    sails.log.info("Seller balance:" , seller);
                                    newAmount = Number(seller.amount) + amount;
                                    Balance.update({ balanceNumber: sellerBalanceNumber }, { amount: newAmount }).exec(function (err, sellerAmount) {
                                        if (err) {
                                            throw err;
                                        }
                                        else {
                                            sails.log.info("Seller balance updated");
                                            return true;
                                        }
                                    })
                                }

                            })
                        }
                    })
                }
                else {
                    sails.log.info("Money Not Found 404")
                }
            }
        })

    },

    spendByUser: function (buyerId, sellerId, buyerEntity, sellerEntity, amount) {
        //buyerEntity i sellerEntity je za odredjivanje identiteta kupca i prodavaca 
        //-> moze da bude "shop" ili "user"
        sails.log.info("Spending begins");
        var sellerBalanceNumber, buyerBalanceNumber;
        if (buyerEntity === "user") {

            Balance.findOne({ userOwner: buyerId }).exec(function (err, userBalance) {
                if (err) {
                    throw err;
                } else {
                    sails.log.info("SpendByUser passed 1");
                    buyerBalanceNumber = userBalance.balanceNumber;
                    sellerBalanceNumber = BalanceService.findSellerBalanceNumber(sellerId, sellerEntity);
                    BalanceService.spendByBalance(buyerBalanceNumber, sellerBalanceNumber, amount);
                }
            })

        }
        else if (buyerEntity === "shop") {
            sails.log.info("Buyer entity is shop");
            Balance.findOne({ shopOwner: buyerId }).exec(function (err, shopBalance) {
                if (err) {
                    sails.log.info("throwing error");
                    throw err;
                }
                else {
                    sails.log.info("SpendByUser passed 2");
                    buyerBalanceNumber = shopBalance.balanceNumber;
                    sails.log.info("BalanceService.findSellerBalanceNumber(sellerId, sellerEntity)", BalanceService.findSellerBalanceNumber(sellerId, sellerEntity));
                    sellerBalanceNumber = BalanceService.findSellerBalanceNumber(sellerId, sellerEntity);
                    sails.log.info("buyer balance: ", buyerBalanceNumber);
                    //sails.log.info("sellerBalanceNumber : ", sellerBalanceNumber);
                    BalanceService.spendByBalance(buyerBalanceNumber, sellerBalanceNumber, amount);
                }
            })

        }
        else {
            return { error: "Buyer Entity must be user or shop!!" };
        }

        
    },
    
    findSellerBalanceNumber: function(sellerId, sellerEntity) {
            sails.log.info("finding ...");
            sails.log("seller entity", sellerEntity);   

            if (sellerEntity === "user") {

                sails.log.info("finding ...");

                Balance.findOne({ userOwner: sellerId }).exec(function (err, userBalance) {
                    if (err) {
                        throw err;
                    }
                    else {
                        sails.log.info(" returning seller balance number:", userBalance.balanceNumber);
                        sails.log.info("Seller balance amount: ", userBalance.amount);
                        return userBalance;
                    }
                })


            }
            else if (sellerEntity === "shop") {


                Balance.findOne({ shopOwner: sellerId }).exec(function (err, shopBalance) {
                    if (err) {
                        throw err;
                    }
                    else {
                        //sails.log.info("Seller balance: ", userBalance);

                        return shopBalance.balanceNumber;
                    }
                })


            }
            else {
                return { error: "Sellers Entity must be user or shop!!" };
            }
        }

};