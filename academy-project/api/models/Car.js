/**
 * Car.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      
      brand: {
          type : 'string',
          required: true
      },
      manufacturer: {
          type: 'string',
          required: true
      },
      color: {
          type: 'string',
          required: true
      },
      /*seatNumber: {
          type: 'number',
          min: 2,
          integer: true,
          required: true
      },
      engineVolume:{
          type: 'integer',
          required: true
      },*/
      transmission:{
          type: 'string', 
          enum: ['Auto', 'Manual'],
          required: true
      },
      
      owner:{
          model: 'user'
      }
      
      

  }
};
