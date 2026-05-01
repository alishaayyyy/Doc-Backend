const User = require('../models/User');

// 1. Update availability (Only for Doctors)
exports.updateAvailability = async (req, res) => {
    try {
        const { availability } = req.body; 

        // Sirf doctor hi apni availability update kar sakte hain
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ msg: 'Access denied. Only doctors can update availability.' });
        }

        const doctor = await User.findByIdAndUpdate(
            req.user.id, 
            { availability }, 
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });
        
        res.json({ msg: 'Availability updated successfully', availability: doctor.availability });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// 2. Get all doctors (For Patients to browse)
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.json(doctors);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// 3. Get single doctor by ID
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await User.findById(req.params.id).select('-password');
        
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ msg: 'Doctor not found' });
        }
        
        res.json(doctor);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};