export function ConvertByteToImageUrl(scenery: any) {
    if (!scenery || !scenery.imageData) {
        return ''; 
    }
    
    // Convert Base64
    const base64ImageData = scenery.imageData;
    const byteCharacters = atob(base64ImageData);

    // Transfer to Uint8Array
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Generate Blob object
    const blob = new Blob([byteArray], { type: 'image/jpeg' }); 

    // Generate URL
    const imageUrl = URL.createObjectURL(blob);

    return imageUrl;
}