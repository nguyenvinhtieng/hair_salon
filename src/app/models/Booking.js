const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Booking = new Schema({
  customer_name: { type: String },
  customer_phone: { type: String },
  barber_id: { type: Number },
  barber_fee: { type: Number },
  services: { type: Array },
  note: { type: String },
  another_fee: { type: Number },
  total: { type: Number },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', Booking);