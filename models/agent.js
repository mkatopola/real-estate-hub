// models/agent.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true }
});

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
