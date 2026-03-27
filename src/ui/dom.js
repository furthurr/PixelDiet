export function getAppElements() {
  return {
    fileInput: document.querySelector('#file-input'),
    dropzone: document.querySelector('#dropzone'),
    filePill: document.querySelector('#file-pill'),
    fileName: document.querySelector('#file-name'),
    clearFileButton: document.querySelector('#clear-file'),
    formatSelect: document.querySelector('#format-select'),
    qualityRange: document.querySelector('#quality-range'),
    qualityValue: document.querySelector('#quality-value'),
    qualityHint: document.querySelector('#quality-hint'),
    downloadButton: document.querySelector('#download-button'),
    originalSize: document.querySelector('#original-size'),
    optimizedSize: document.querySelector('#optimized-size'),
    savedSize: document.querySelector('#saved-size'),
    savedPercent: document.querySelector('#saved-percent'),
    compareStage: document.querySelector('#compare-stage'),
    compareOverlay: document.querySelector('#compare-overlay'),
    compareSlider: document.querySelector('#compare-slider'),
    previewOriginal: document.querySelector('#preview-original'),
    previewOptimized: document.querySelector('#preview-optimized'),
    compressionRadios: document.querySelectorAll('input[name="compression-mode"]'),
  };
}

export function updateCompareMask(overlayElement, value) {
  overlayElement.style.width = `${value}%`;
}

export function updateMetrics(elements, metrics) {
  elements.originalSize.textContent = metrics.originalSizeLabel;
  elements.optimizedSize.textContent = metrics.optimizedSizeLabel;
  elements.savedSize.textContent = metrics.savedSizeLabel;
  elements.savedPercent.textContent = metrics.reductionPercentLabel;
}

export function resetMetrics(elements) {
  elements.originalSize.textContent = '-';
  elements.optimizedSize.textContent = '-';
  elements.savedSize.textContent = '-';
  elements.savedPercent.textContent = '-';
}

export function setLoadedState(elements, isLoaded) {
  elements.compareStage.dataset.loaded = String(isLoaded);
  elements.downloadButton.disabled = !isLoaded;
  elements.filePill.hidden = !isLoaded;
}

export function updateQualityLabel(elements, quality, compressionMode, outputMimeType) {
  elements.qualityValue.textContent = `${quality}%`;

  if (compressionMode === 'lossless') {
    elements.qualityHint.textContent =
      'Modo orientado a maxima fidelidad. El ahorro puede ser menor.';
    return;
  }

  if (outputMimeType === 'image/png') {
    elements.qualityHint.textContent =
      'PNG usa cuantizacion de color: menos calidad permite un archivo mas liviano.';
    return;
  }

  if (quality >= 90) {
    elements.qualityHint.textContent = 'Calidad alta con compresion suave.';
    return;
  }

  if (quality >= 70) {
    elements.qualityHint.textContent = 'Balanceado para WebP con buena reduccion visual.';
    return;
  }

  elements.qualityHint.textContent = 'Compresion agresiva para bajar peso rapidamente.';
}
