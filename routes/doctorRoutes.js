const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { updateAvailability, getAllDoctors, getDoctorById } = require('../controllers/doctorController');

// Public: Get all doctors
router.get('/', getAllDoctors);

// Public: Get single doctor
router.get('/:id', getDoctorById);

// Private: Doctor update availability
router.post('/availability', auth, updateAvailability);

module.exports = router;