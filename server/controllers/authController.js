import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import validator from 'validator';


// 🔐 SIGNUP
export const signupUser = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file); // useful if you add image later

    const { name, email, password } = req.body;

    // ❗ Check missing fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    // ❗ Email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email",
      });
    }

    // ❗ Password validation
    if (password.length > 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // ❗ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ Create user
    const user = new User({ name, email, password });
    await user.save();

    // 🔐 Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ❌ Remove password
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      token,
      user: userData
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ❗ Check missing fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ❗ Validate email format
   
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email",
      });
    }

    // ❗ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ❗ Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 🔐 Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ❌ Remove password from response
    const userData = user.toObject();
    delete userData.password;

    res.json({
      success: true,
      token,
      user: userData
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};