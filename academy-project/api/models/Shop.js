/**
 * Shop.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },

        location: {
            type: 'string',

        },

        cars: {
            collection: 'car',
            via: 'ownerShop'
        },
        balance: {
            collection: 'balance',
            via: 'shopOwner'
        },
        
        logoUrl:{
            type: 'string',
            defaultsTo: "http://northmiamiautorepair.com/wp-content/uploads/2014/05/Car-Repair-north-miami.png"
        }

    }
};

