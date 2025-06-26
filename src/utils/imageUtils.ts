
export const downloadImageAsFile = async (imageUrl: string, filename: string): Promise<File> => {
  try {
    console.log('Downloading image from URL:', imageUrl);
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    console.log('Downloaded blob size:', blob.size, 'bytes');
    
    // Determine file extension from blob type or default to png
    const mimeType = blob.type || 'image/png';
    const extension = mimeType.split('/')[1] || 'png';
    const finalFilename = filename.endsWith(`.${extension}`) ? filename : `${filename}.${extension}`;
    
    const file = new File([blob], finalFilename, { type: mimeType });
    console.log('Created file:', file.name, file.size, 'bytes', file.type);
    
    return file;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download AI-generated image. Please try again.');
  }
};

export const generateAIImageFilename = (prompt: string, style: string): string => {
  // Clean and truncate prompt for filename
  const cleanPrompt = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(' ')
    .slice(0, 4)
    .join('-');
  
  const timestamp = Date.now().toString().slice(-6);
  return `ai-${style}-${cleanPrompt}-${timestamp}`;
};
