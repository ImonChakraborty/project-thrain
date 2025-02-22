import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/authService';

interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

const router = Router();

router.post('/login', [
  body('username').isString().trim(),
  body('password').isString()
], async (req: LoginRequest, res: Response) => {
  try {
    console.log('Login request received');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    console.log('Attempting login for user:', username);

    const result = await AuthService.login({ username, password });
    console.log('Login successful for user:', username);

    res.status(200).json(result);
  } catch (error) {
    console.error('Login route error:', error);

    if (error instanceof Error) {
      if (error.message === 'User not found' || error.message === 'Invalid password') {
        return res.status(401).json({ message: 'Invalid credentials' });
      } else if (error.message === 'JWT_SECRET is not configured') {
        return res.status(500).json({ message: 'Server configuration error' });
      }
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;