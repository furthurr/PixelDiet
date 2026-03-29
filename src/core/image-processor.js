import UPNG from 'upng-js';

const MIME_EXTENSION_MAP = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 KB';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  const digits = value >= 100 || index === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[index]}`;
}

export function buildOutputName(fileName, mimeType) {
  const baseName = fileName.replace(/\.[^.]+$/, '');
  const extension = MIME_EXTENSION_MAP[mimeType] ?? 'img';
  return `${baseName}-pixeldiet.${extension}`;
}

export async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));

    reader.readAsDataURL(file);
  });
}

export async function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('No se pudo cargar la imagen seleccionada.'));
    image.src = source;
  });
}

function drawToCanvas(image) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { alpha: true });

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  context.drawImage(image, 0, 0);

  return canvas;
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo exportar la imagen.'));
          return;
        }

        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

function getPngColorCount(quality, compressionMode) {
  if (compressionMode === 'lossless') {
    return 0;
  }

  if (quality >= 95) {
    return 256;
  }

  if (quality >= 85) {
    return 192;
  }

  if (quality >= 70) {
    return 128;
  }

  if (quality >= 50) {
    return 64;
  }

  return 32;
}

function countUniqueColors(imageData) {
  const pixels = imageData.data;
  const seen = new Set();
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    seen.add((r << 24) | (g << 16) | (b << 8) | a);
    if (seen.size > 256) return 257;
  }
  return seen.size;
}

async function exportPngBlob(canvas, quality, compressionMode) {
  const context = canvas.getContext('2d', { alpha: true, willReadFrequently: true });
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const targetColorCount = getPngColorCount(quality, compressionMode);

  if (targetColorCount === 0) {
    const uniqueColors = countUniqueColors(imageData);
    const colorCount = uniqueColors <= 256 ? uniqueColors : 0;
    const encodedPng = UPNG.encode([imageData.data.buffer], canvas.width, canvas.height, colorCount);
    return new Blob([encodedPng], { type: 'image/png' });
  }

  const encodedPng = UPNG.encode([imageData.data.buffer], canvas.width, canvas.height, targetColorCount);
  return new Blob([encodedPng], { type: 'image/png' });
}

export async function processImage({ file, outputMimeType, quality, compressionMode }) {
  const originalUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalUrl);
  const canvas = drawToCanvas(image);
  const normalizedQuality = compressionMode === 'lossless' ? 1 : quality / 100;
  const outputBlob =
    outputMimeType === 'image/png'
      ? await exportPngBlob(canvas, quality, compressionMode)
      : await canvasToBlob(canvas, outputMimeType, normalizedQuality);
  const optimizedUrl = URL.createObjectURL(outputBlob);
  const savedBytes = Math.max(file.size - outputBlob.size, 0);
  const reductionPercent = file.size > 0 ? (savedBytes / file.size) * 100 : 0;

  return {
    originalUrl,
    optimizedUrl,
    outputBlob,
    outputName: buildOutputName(file.name, outputMimeType),
    originalSizeLabel: formatBytes(file.size),
    optimizedSizeLabel: formatBytes(outputBlob.size),
    savedSizeLabel: formatBytes(savedBytes),
    reductionPercentLabel: `${Math.round(reductionPercent)}%`,
  };
}
