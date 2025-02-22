import { sql } from '../config/database';
import { File } from '../types';

export class FileModel {
  static async create(userId: number, filename: string, content: string): Promise<File> {
    const result = await sql`
      INSERT INTO files (user_id, filename, content)
      VALUES (${userId}, ${filename}, ${content})
      RETURNING *
    `;
    return result.rows[0] as File;
  }

  static async findByUser(userId: number): Promise<File[]> {
    const result = await sql`
      SELECT * FROM files 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return result.rows as File[];
  }

  static async getFile(userId: number, fileId: number): Promise<File | null> {
    const result = await sql`
      SELECT * FROM files 
      WHERE id = ${fileId} AND user_id = ${userId}
    `;
    return (result.rows[0] as File) || null;
  }

  static async deleteByUser(userId: number): Promise<void> {
    await sql`
      DELETE FROM files 
      WHERE user_id = ${userId}
    `;
  }

  static async deleteFile(userId: number, fileId: number): Promise<boolean> {
    const result = await sql`
      DELETE FROM files 
      WHERE id = ${fileId} AND user_id = ${userId}
      RETURNING id
    `;
    return result.rowCount > 0;
  }
}