const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  slot: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'cancelled', 'completed'] }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);