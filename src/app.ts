import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { initDatabase } from './config/database';
import authRouter from './routes/auth';
import filesRouter from './routes/files';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize database
initDatabase().catch(console.error);

// Serve static files
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/files', filesRouter);

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;