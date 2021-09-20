const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    members: { type: Array},
},
{ timestamps: true});


module.exports = model('Conversation', schema);