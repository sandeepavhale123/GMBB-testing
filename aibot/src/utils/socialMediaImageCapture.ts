import * as htmlToImage from 'html-to-image';

interface CaptureOptions {
  size?: number;
  format?: 'png' | 'jpeg';
  quality?: number;
  backgroundColor?: string;
  pixelRatio?: number;
}

/**
 * Load an image from a data URL
 */
const loadImage = (dataUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
};

/**
 * Wait for all images within an element to load
 */
const waitForImagesToLoad = async (element: HTMLElement): Promise<void> => {
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      img.addEventListener('load', () => resolve());
      img.addEventListener('error', () => resolve()); // Resolve even on error to not block
      setTimeout(() => resolve(), 5000); // Timeout after 5 seconds
    });
  });
  await Promise.all(promises);
};

/**
 * Capture a DOM element as a square image with centered content
 * @param element - The DOM element to capture
 * @param options - Capture options (size, format, quality, backgroundColor, pixelRatio)
 * @returns A Blob containing the captured image
 */
export const captureSquareImage = async (
  element: HTMLElement,
  options: CaptureOptions = {}
): Promise<Blob> => {
  const { 
    size = 600, 
    format = 'png', 
    quality = 1.0,
    backgroundColor = '#ffffff',
    pixelRatio = 2
  } = options;

  // Wait for all images to load
  await waitForImagesToLoad(element);

  try {
    // Wait for any pending renders
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture the element at its natural size
    const dataUrl = await htmlToImage.toPng(element, {
      pixelRatio,
      cacheBust: true,
      skipFonts: true, // Skip web font embedding to avoid CORS SecurityError
      fontEmbedCSS: '', // Empty CSS to prevent font embedding issues
    });

    // Load the captured image
    const img = await loadImage(dataUrl);

    // Create canvas with target size
    const canvas = document.createElement('canvas');
    canvas.width = size * pixelRatio;
    canvas.height = size * pixelRatio;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // Fill with background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scaling to fit image in square (contain mode)
    const scale = Math.min(
      canvas.width / img.width,
      canvas.height / img.height
    );

    // Calculate centered position
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const dx = (canvas.width - drawWidth) / 2;
    const dy = (canvas.height - drawHeight) / 2;

    // Draw the image centered
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

    // Convert to Blob
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        mimeType,
        quality
      );
    });

    return blob;
  } catch (error) {
    throw error;
  }
};

/**
 * Download a Blob as a file
 * @param blob - The Blob to download
 * @param fileName - The name of the file to download
 */
export const downloadImageBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
