import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Multer to store files in Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'events', // Folder in Cloudinary
    format: async () => 'png', // or 'jpeg', 'jpg'
    public_id: (req, file) => file.originalname.split('.')[0], // Name based on file
  },
});

const upload = multer({ storage });

export default upload;