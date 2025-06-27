import path from "path";
import fs from "fs"
import multer from "multer";

// Check if the uploadDir directories are exits or not
const uploadDir = path.join(process.cwd(), "public", "uploads");
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
})

const fileFilter = (req:any, file: Express.Multer.File, cb: any) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if(allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, JPG formats allowed"), false);
}

const upload = multer({storage, fileFilter});

export const uploadMiddleware = upload.single('image');