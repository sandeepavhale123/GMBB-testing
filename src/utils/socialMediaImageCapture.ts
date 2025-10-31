import * as htmlToImage from 'html-to-image';

interface CaptureOptions {
  size?: number;
  format?: 'png' | 'jpeg';
  quality?: number;
}

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
 * Capture a DOM element as an image exactly as it appears on screen
 * @param element - The DOM element to capture
 * @param options - Capture options (size, format, quality)
 * @returns A Blob containing the captured image
 */
export const captureSquareImage = async (
  element: HTMLElement,
  options: CaptureOptions = {}
): Promise<Blob> => {
  const { size = 1080, format = 'png', quality = 1.0 } = options;

  // Wait for all images to load
  await waitForImagesToLoad(element);

  try {
    // Get current dimensions to calculate proper scaled height
    const rect = element.getBoundingClientRect();
    const scale = size / rect.width;
    const scaledHeight = Math.round(rect.height * scale);

    // Wait for any pending renders
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture the element as-is with scaled dimensions
    const dataUrl = await htmlToImage.toPng(element, {
      width: size,
      height: scaledHeight,
      pixelRatio: 2,
      cacheBust: true,
    });

    // Convert data URL to Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

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
