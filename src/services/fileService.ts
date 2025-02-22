import { FileModel } from '../models/file';
import { File } from '../types';

export class FileService {
  static async uploadFile(userId: number, filename: string, content: string): Promise<File> {
    try {
      if (!content.trim()) {
        throw new Error('File content cannot be empty');
      }

      const file = await FileModel.create(userId, filename, content);
      if (!file) {
        throw new Error('Failed to create file record');
      }
      return file;
    } catch (error) {
      console.error('FileService uploadFile error:', error);
      throw error;
    }
  }

  static async getUserFiles(userId: number): Promise<File[]> {
    return await FileModel.findByUser(userId);
  }

  static async getFile(userId: number, fileId: number): Promise<File | null> {
    return await FileModel.getFile(userId, fileId);
  }

  static async deleteFile(userId: number, fileId: number): Promise<boolean> {
    return await FileModel.deleteFile(userId, fileId);
  }

  static async clearUserFiles(userId: number): Promise<void> {
    await FileModel.deleteByUser(userId);
  }
}