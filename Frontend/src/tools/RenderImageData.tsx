export function renderImageDataToString(imageData: Blob | null): string {
    if (!imageData || imageData.size === 0) {
        return "No Image Data";
    }
    return `Uint8Array of ${imageData.size} bytes`;
}

export function renderImageDataToImageUrl(imageData: Blob | null): string
{
    if (!imageData || imageData.size === 0) {
        return "";
    }

    const reader = new FileReader();
    reader.readAsDataURL(imageData);
    let imageUrl = "";
    reader.onload = () => {
        if (typeof reader.result === 'string'){
            imageUrl = reader.result;
        }
    };

    return imageUrl;
};
