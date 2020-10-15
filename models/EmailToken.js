const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    _userId: { type: Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

module.exports = model('EmailToken', schema);