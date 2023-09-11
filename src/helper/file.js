export function getFileExtension(filename) {
    const parts = filename.split('.');
    console.log(parts)
    if (parts.length > 1) {
        return parts.pop(); // Get the last element of the array
    } else {
        return ""; // No extension found
    }
}