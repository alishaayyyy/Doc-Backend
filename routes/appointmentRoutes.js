const express = require('express');
const router = express.Router();
const {
    bookAppointment,
    getMyAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    cancelAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');

// IMPORTANT: Auth middleware zaroor import karein taake req.user access ho sake
const authMiddleware = require('../middleware/authMiddleware'); 

// Routes
router.post('/book', authMiddleware, bookAppointment);
router.get('/my-appointments', authMiddleware, getMyAppointments);

// Yeh wo route hai jo frontend call kar raha hai
router.get('/doctor-appointments', authMiddleware, getDoctorAppointments); 

router.put('/update-status/:id', authMiddleware, updateAppointmentStatus);

// Changed to PATCH to match the frontend api.patch() request
router.patch('/cancel/:id', authMiddleware, cancelAppointment);

router.delete('/:id', authMiddleware, deleteAppointment);

module.exports = router;