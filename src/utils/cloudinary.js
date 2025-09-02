import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Return "https" URLs by setting secure: true
cloudinary.config({
    secure: true,
    cloud_name: "db6jhwpe3",
    api_key: "987228778523333",
    api_secret: "neClhzJsNWKcYfxIT_mDjgKHYPY",
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload the file on cloudinary

        const resonse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary", resonse.url);
        fs.unlinkSync(localFilePath)
        return resonse;
    } catch (error) {
        console.error("Cloudinary Upload Failed:", error.message);
        fs.unlinkSync(localFilePath);
    }
};

export { uploadOnCloudinary };
