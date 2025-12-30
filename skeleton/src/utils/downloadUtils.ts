/**
 * Utility functions for file downloads
 */

/**
 * Downloads a file from a given URL by creating a temporary anchor element
 * @param fileUrl - The URL of the file to download
 * @param fileName - Optional custom filename for the downloaded file
 */
export const downloadFileFromUrl = (fileUrl: string, fileName?: string): void => {
  try {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = fileUrl;
    
    // Set the download attribute with the filename
    if (fileName) {
      link.download = fileName;
    } else {
      // Extract filename from URL if not provided
      const urlParts = fileUrl.split('/');
      link.download = urlParts[urlParts.length - 1] || 'download';
    }
    
    // Temporarily add to DOM and trigger click
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file');
  }
};