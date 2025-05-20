import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Proxy route for external requests
router.post('/proxy', async (req, res) => {
  const { url, method = 'POST', body, headers = {} } = req.body;
  
  try {
    const response = await axios({
      method,
      url,
      data: body,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      message: 'Proxy request failed', 
      error: error.response?.data || error.message 
    });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  
  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await User.create({ 
        name, 
        email, 
        phone, 
        password_hash: hashedPassword,
        role: 'user'
      });

      // Generate token and return response
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      };

      res.status(201).json({ token, user: userData });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        message: error.message || 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}); // removed extra catch block

// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     // Find user by email
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Return user data without sensitive info
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(500).json({ message: 'JWT configuration error' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});


export default router;
