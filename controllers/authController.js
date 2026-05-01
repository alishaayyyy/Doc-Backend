const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, fees } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object dynamically
    const userData = {
      name,
      email,
      password: hashedPassword,
      role
    };

    // Agar doctor hai toh extra fields add karo
    if (role === 'doctor') {
      userData.specialization = specialization;
      userData.fees = fees;
    }

    user = new User(userData);
    await user.save();

    // Create Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send response (password field exclude kar di hai security ke liye)
    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user and include password field for comparison
    const user = await User.findOne({ email }).select('+password'); 
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Login pe poora user object bhejein (excluding password)
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        specialization: user.specialization, // Doctor ke liye useful
        fees: user.fees                     // Doctor ke liye useful
      } 
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};