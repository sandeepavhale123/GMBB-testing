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
 * Capture a DOM element as a square image suitable for social media
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

  // Save original styles
  const originalStyles = {
    width: element.style.width,
    height: element.style.height,
    minHeight: element.style.minHeight,
    maxHeight: element.style.maxHeight,
    display: element.style.display,
    flexDirection: element.style.flexDirection,
    justifyContent: element.style.justifyContent,
  };

  try {
    // Apply square dimensions temporarily
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.minHeight = `${size}px`;
    element.style.maxHeight = `${size}px`;
    element.style.display = 'flex';
    element.style.flexDirection = 'column';
    element.style.justifyContent = 'space-between';

    // Wait a bit for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture the element
    const dataUrl = await htmlToImage.toPng(element, {
      width: size,
      height: size,
      pixelRatio: 2,
      cacheBust: true,
      style: {
        transform: 'none',
      },
    });

    // Convert data URL to Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Restore original styles
    Object.assign(element.style, originalStyles);

    return blob;
  } catch (error) {
    // Restore original styles even on error
    Object.assign(element.style, originalStyles);
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
