import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const upload = (folderName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, `../uploads/${folderName}`);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${Date.now()}-${safeName}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF or image files (jpg, jpeg, png) are allowed"));
    }
  };

  return multer({ storage, fileFilter });
};
