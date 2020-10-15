const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    confirmedAt: {type: Date},
    isVerified: { type: Boolean, default: false},
});

module.exports = model('User', schema);