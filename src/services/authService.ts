import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';
import { UserCredentials, AuthResponse } from '../types';

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET;

  static async login(credentials: UserCredentials): Promise<AuthResponse> {
    try {
      console.log('Login attempt for user:', credentials.username);
      console.log('JWT_SECRET exists:', !!this.JWT_SECRET); // Debug log

      if (!this.JWT_SECRET) {
        console.error('JWT_SECRET is missing in environment');
        throw new Error('JWT_SECRET is not configured');
      }

      const user = await UserModel.findByUsername(credentials.username);
      console.log('User lookup result:', !!user); // Debug log

      if (!user) {
        console.log('User not found:', credentials.username);
        throw new Error('User not found');
      }

      console.log('User found, verifying password');
      const isValidPassword = await bcrypt.compare(credentials.password, user.password);
      console.log('Password verification result:', isValidPassword); // Debug log

      if (!isValidPassword) {
        console.log('Invalid password for user:', credentials.username);
        throw new Error('Invalid password');
      }

      console.log('Password verified, generating token');
      const token = jwt.sign({ userId: user.id }, this.JWT_SECRET, {
        expiresIn: '24h'
      });

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          created_at: user.created_at
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}