// models/property.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['rent', 'sale'], required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  status: { type: String, enum: ['available', 'sold', 'rented'], default: 'available' },
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
