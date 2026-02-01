import dotenv from 'dotenv';
import app from './src/app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'file';

// Connect to MongoDB only if using mongodb storage
if (STORAGE_TYPE === 'mongodb') {
  const { default: connectDB } = await import('./src/config/database.js');
  await connectDB();
}

// Import storage factory (which initializes the chosen storage type)
await import('./src/config/storageFactory.js');

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log(`   Storage: ${STORAGE_TYPE.toUpperCase()}`);
  console.log(`   API: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});
