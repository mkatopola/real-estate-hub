// models/client.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
