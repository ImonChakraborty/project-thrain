import { sql } from '../config/database';
import { User, UserCredentials } from '../types';

export class UserModel {
  static async create(credentials: UserCredentials): Promise<User> {
    const result = await sql`
      INSERT INTO users (username, password)
      VALUES (${credentials.username}, ${credentials.password})
      RETURNING id, username, created_at
    `;
    return result.rows[0] as User;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const result = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;
    return result.rows[0] as User || null;
  }

  static async findById(id: number): Promise<User | null> {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    return result.rows[0] as User || null;
  }
}