# PixelDiet

PixelDiet es una SPA estatica para comprimir y convertir imagenes directamente en el navegador. Todo el procesamiento ocurre del lado del cliente, por lo que los archivos no se suben a servidores externos.

## Demo

- GitHub Pages: `https://furthurr.github.io/PixelDiet/`

## Stack

- Vite + JavaScript vanilla
- HTML5 Canvas API
- CSS moderno con enfoque mobile-first
- `upng-js` para compresion real de PNG con cuantizacion de color

## Funciones iniciales

- Drag and drop o selector de archivos
- Previsualizacion antes vs despues
- Exportacion local en WebP, JPEG o PNG
- Ajuste de calidad y modo `lossy`/`lossless`
- Metricas de tamano y porcentaje de reduccion

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

Este proyecto ya incluye workflow para desplegar `dist/` en GitHub Pages.

- El repositorio esperado es `PixelDiet`
- `vite.config.js` usa `base: /PixelDiet/` durante GitHub Actions
- Si cambias el nombre del repo, actualiza `repoName` en `vite.config.js`

## Autor

- Pedro GV - [@furthurr](https://github.com/furthurr)

## Siguientes iteraciones sugeridas

- Mover compresion pesada a Web Worker
- Integrar AVIF mediante libreria/WASM
- Soportar multiples archivos y cola de exportacion
