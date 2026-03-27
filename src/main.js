import './style.css';

import { processImage } from './core/image-processor.js';
import {
  getAppElements,
  resetMetrics,
  setLoadedState,
  updateCompareMask,
  updateMetrics,
  updateQualityLabel,
} from './ui/dom.js';

const elements = getAppElements();

const state = {
  file: null,
  result: null,
};

function getCompressionMode() {
  return [...elements.compressionRadios].find((radio) => radio.checked)?.value ?? 'lossy';
}

function revokeUrls() {
  if (state.result?.optimizedUrl) {
    URL.revokeObjectURL(state.result.optimizedUrl);
  }
}

function resetPreview() {
  revokeUrls();
  state.result = null;
  elements.previewOriginal.removeAttribute('src');
  elements.previewOptimized.removeAttribute('src');
  elements.fileName.textContent = 'Sin archivo';
  setLoadedState(elements, false);
  resetMetrics(elements);
}

async function refreshOutput() {
  if (!state.file) {
    resetPreview();
    return;
  }

  elements.downloadButton.disabled = true;
  elements.downloadButton.textContent = 'Procesando...';

  try {
    revokeUrls();

    const result = await processImage({
      file: state.file,
      outputMimeType: elements.formatSelect.value,
      quality: Number(elements.qualityRange.value),
      compressionMode: getCompressionMode(),
    });

    state.result = result;
    elements.fileName.textContent = state.file.name;
    elements.previewOriginal.src = result.originalUrl;
    elements.previewOptimized.src = result.optimizedUrl;
    updateMetrics(elements, result);
    setLoadedState(elements, true);
  } catch (error) {
    console.error(error);
    resetPreview();
    window.alert(error.message);
  } finally {
    elements.downloadButton.textContent = 'Descargar optimizada';
    elements.downloadButton.disabled = !state.result;
  }
}

function handleFileSelection(file) {
  if (!file || !file.type.startsWith('image/')) {
    window.alert('Selecciona una imagen valida para continuar.');
    return;
  }

  state.file = file;
  refreshOutput();
}

function downloadResult() {
  if (!state.result) {
    return;
  }

  const link = document.createElement('a');
  link.href = state.result.optimizedUrl;
  link.download = state.result.outputName;
  link.click();
}

elements.fileInput.addEventListener('change', (event) => {
  const [file] = event.target.files ?? [];
  handleFileSelection(file);
});

['dragenter', 'dragover'].forEach((eventName) => {
  elements.dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropzone.classList.add('is-active');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  elements.dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropzone.classList.remove('is-active');
  });
});

elements.dropzone.addEventListener('drop', (event) => {
  const [file] = event.dataTransfer?.files ?? [];
  handleFileSelection(file);
});

elements.clearFileButton.addEventListener('click', () => {
  state.file = null;
  elements.fileInput.value = '';
  resetPreview();
});

elements.downloadButton.addEventListener('click', downloadResult);

elements.qualityRange.addEventListener('input', () => {
  updateQualityLabel(
    elements,
    Number(elements.qualityRange.value),
    getCompressionMode(),
    elements.formatSelect.value,
  );
  if (state.file) {
    refreshOutput();
  }
});

elements.formatSelect.addEventListener('change', () => {
  updateQualityLabel(
    elements,
    Number(elements.qualityRange.value),
    getCompressionMode(),
    elements.formatSelect.value,
  );
  if (state.file) {
    refreshOutput();
  }
});

elements.compressionRadios.forEach((radio) => {
  radio.addEventListener('change', () => {
    updateQualityLabel(
      elements,
      Number(elements.qualityRange.value),
      getCompressionMode(),
      elements.formatSelect.value,
    );
    if (state.file) {
      refreshOutput();
    }
  });
});

elements.compareSlider.addEventListener('input', (event) => {
  updateCompareMask(elements.compareOverlay, event.target.value);
});

updateCompareMask(elements.compareOverlay, elements.compareSlider.value);
updateQualityLabel(
  elements,
  Number(elements.qualityRange.value),
  getCompressionMode(),
  elements.formatSelect.value,
);
resetPreview();

window.addEventListener('beforeunload', revokeUrls);
