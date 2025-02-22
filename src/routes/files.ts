import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { FileService } from '../services/fileService';
import { authenticateToken, AuthRequest } from '../middleware/auth';

interface FileUploadRequest extends AuthRequest {
  body: {
    filename: string;
    content: string;
  };
}

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Validation middleware
const validateFile = [
  body('filename').isString().trim().notEmpty(),
  body('content').isString().notEmpty(),
];

// Upload file
router.post('/upload', validateFile, async (req: FileUploadRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { filename, content } = req.body;
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!content) {
      return res.status(400).json({ message: 'File content is required' });
    }

    if (!filename) {
      return res.status(400).json({ message: 'Filename is required' });
    }

    const file = await FileService.uploadFile(req.user.userId, filename, content);

    if (!file) {
      return res.status(500).json({ message: 'Failed to save file' });
    }

    res.status(201).json(file);
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all user files
router.get('/list', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const files = await FileService.getUserFiles(req.user.userId);
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving files' });
  }
});

router.get('/download/:fileId', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const fileId = parseInt(req.params.fileId);
    if (isNaN(fileId)) {
      return res.status(400).json({ message: 'Invalid file ID' });
    }

    const file = await FileService.getFile(req.user.userId, fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);

    // Send the file content
    res.send(file.content);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
});

// Clear all user files
router.delete('/clear', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    await FileService.clearUserFiles(req.user.userId);
    res.json({ message: 'All files cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing files' });
  }
});

router.delete('/:fileId', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const fileId = parseInt(req.params.fileId);
    if (isNaN(fileId)) {
      return res.status(400).json({ message: 'Invalid file ID' });
    }

    const deleted = await FileService.deleteFile(req.user.userId, fileId);
    if (!deleted) {
      return res.status(404).json({ message: 'File not found or unauthorized' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

export default router;