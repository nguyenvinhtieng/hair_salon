const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Services = new Schema({
    name: { type: String },
    type: { type: String, enum: ['plain', 'product'] },
});

module.exports = mongoose.model('Services', Services);