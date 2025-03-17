import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
// Setja upp geymslurými fyrir myndir
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (_req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
// Leyfa einungis jpg og png myndir
const fileFilter = (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only JPG and PNG image files are allowed'));
    }
};
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB hámarksstærð
    fileFilter
});
// Middleware sem útfærir villumeðhöndlun fyrir multer upphleðsluna
export const imageUpload = (req, res, next) => {
    const uploadSingle = upload.single('image');
    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: `Image upload error: ${err.message}`
            });
        }
        else if (err) {
            return res.status(400).json({
                error: err.message
            });
        }
        next();
    });
};
export default imageUpload;
//# sourceMappingURL=imageUpload.js.map