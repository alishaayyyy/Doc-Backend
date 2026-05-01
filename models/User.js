const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], default: 'patient' },
  // Doctor specific fields (Only filled if role is doctor)
  specialization: { type: String },
  experience: { type: Number },
  fees: { type: Number },
  bio: { type: String },
  availability: [{ day: String, slots: [String] }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);