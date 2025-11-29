import multer from "multer";
import path from "path";
import fs from "fs";

import os from "os";

// Use system temp directory (works on Vercel /tmp and local)
const tempDir = os.tmpdir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

export const upload = multer({ storage });
