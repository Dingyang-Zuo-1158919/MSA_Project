import compressImage from 'browser-image-compression';

// Maximum image file size allowed in MB
const MAX_FILE_SIZE_MB = 1;

export async function CompressImage(file: any) {
    // Check if the file size exceeds the maximum allowed size for compression
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        // Options for image compression
        const options = {
            maxSizeMB: MAX_FILE_SIZE_MB,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };
        try {
            // Compress the image using browser-image-compression library
            const compressedFile = await compressImage(file, options);
            // Return the compressed File object
            return compressedFile;
        } catch (error: any) {
            // Throw an error if image compression fails
            throw new Error('Image compression failed:' + error.message);
        }
    } else {
        // Return the original file if its size does not exceed the maximum allowed size
        return file;
    }
}