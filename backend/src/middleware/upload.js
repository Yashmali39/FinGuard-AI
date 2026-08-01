import multer from "multer";
import ApiError from "../utils/ApiError.js";

// Store uploaded CSV temporarily in RAM instead of saving it to disk
const storage = multer.memoryStorage();

const csvUpload = multer({
    storage,

    // Maximum uploaded file size = 5 MB
    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    // Allow only CSV files
    fileFilter: (req, file, cb) => {
        const isCsv =
            file.mimetype === "text/csv" ||
            file.originalname.toLowerCase().endsWith(".csv");

        if (!isCsv) {
            return cb(
                new ApiError(400, "Only CSV files are allowed")
            );
        }

        cb(null, true);
    },
});

export default csvUpload;