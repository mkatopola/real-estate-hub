// models/appointment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  property_id: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  agent_id: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  client_id: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  appointment_date: {
    type: Date,
    required: true
  },
  start_time: {
    type: String,
    required: true
  },
  end_time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: {
    type: String
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;