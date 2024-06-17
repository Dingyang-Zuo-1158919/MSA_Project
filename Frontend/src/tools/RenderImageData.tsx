export function renderImageDataToString(imageData: Uint8Array): string {
    if (!imageData || imageData.length === 0) {
        return "No Image Data";
    }
    return `Uint8Array of ${imageData.length} elements`;
}

export function renderImageDataToImage(imageData: Uint8Array): JSX.Element
{
    if (!imageData || imageData.length === 0) {
        return <img src="" alt="no image available" style={{ maxWidth: "100%", maxHeight: "300px" }} />;
    }
    // Convert Uint8Array to base64 string
    const base64String = btoa(String.fromCharCode(...imageData));
    const imageUrl = `data:image/jpeg;base64,${base64String}`;

    return <img src={imageUrl} alt="Scenery" style={{ maxWidth: "100%", maxHeight: "300px" }} />;
};
