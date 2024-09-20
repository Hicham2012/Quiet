function convertWebPToBase64FromURL(imagePath, callback) {
// Use fetch to get the image as a blob
fetch(imagePath)
    .then(response => response.blob())  // Convert the image response to a Blob
    .then(blob => {
    const reader = new FileReader();
    
    // Once the FileReader has loaded, get the Base64 string
    reader.onloadend = function() {
        callback(reader.result); // Base64-encoded image
    };

    // Read the blob as a Data URL (Base64)
    reader.readAsDataURL(blob);
    })
    .catch(error => {
    console.error("Error fetching image:", error);
    });
}

export default convertWebPToBase64FromURL;