import compressImage from 'browser-image-compression';

const MAX_FILE_SIZE_MB = 1;
export async function CompressImage(file: any) {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        const options = {
            maxSizeMB: MAX_FILE_SIZE_MB,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };
        try {
            const compressedFile = await compressImage(file, options);
            return compressedFile;
        } catch (error: any) {
            throw new Error('Image compression failed:' + error.message);
        }
    } else {
        return file;
    }
}