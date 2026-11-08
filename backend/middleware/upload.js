import multer from 'multer';
import path from 'path';

// VERCEL FIX: Use memoryStorage instead of diskStorage.
// Vercel's file system is read-only, so files must be held in memory.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  }
  cb(new Error('Only PDFs and Word docs are allowed!'));
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
});

export default upload;