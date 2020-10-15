const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    isDone: {type: Boolean, default: false},
    priority: {type: Number, required: true, max: 5, min: 1},
    archivedAt: {type: Date, default: null},
    dueDate: { type: Date, required: true},
    owner: {type: Types.ObjectId, ref: 'User'}
});

module.exports = model('Task', schema);