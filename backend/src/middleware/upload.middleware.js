import multer from 'multer';
import path from 'path';

const storage =multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(null,true);
    }else {
        cb("Solo las imagenes estan permitidas", false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
    },
    fileFilter: fileFilter
})
export default upload;