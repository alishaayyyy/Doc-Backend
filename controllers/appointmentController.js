const Appointment = require('../models/Appointment');

// 1. Book Appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, slot } = req.body;

    // Date Validation: Past date check
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    if (selectedDate < today) {
        return res.status(400).json({ msg: "Cannot book for a past date!" });
    }

    // Double Booking Check
    const isBooked = await Appointment.findOne({ doctor: doctorId, date, slot, status: { $ne: 'cancelled' } });
    if (isBooked) {
      return res.status(400).json({ msg: "This slot is already booked!" });
    }

    const newAppointment = new Appointment({
      doctor: doctorId,
      patient: req.user.id,
      date,
      slot,
      status: 'pending' // Default status
    });

    await newAppointment.save();
    res.status(201).json({ msg: "Booking successful!" });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

// 2. Get Patient's appointments
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name specialization'); // Doctor ki info bhi le aao
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 3. Get Doctor's appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'name email'); // Patient ki info
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 4. Update Status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ msg: "Status is required" });

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: "Appointment not found" });

    // Agar already cancelled hai, toh status change na ho
    if (appointment.status === 'cancelled') {
        return res.status(400).json({ msg: "Cannot update a cancelled appointment" });
    }

    appointment.status = status;
    await appointment.save();
    
    res.json({ msg: "Status updated", appointment });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 5. Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: "Appointment not found" });
    
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized action" });
    }

    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ msg: "Appointment cancelled successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 6. Delete Appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: "Appointment not found" });
    
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized action" });
    }

    if (appointment.status !== 'cancelled') {
      return res.status(400).json({ msg: "Only cancelled appointments can be removed" });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ msg: "Appointment record removed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment
};