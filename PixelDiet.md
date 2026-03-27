# Documento de Especificación de Proyecto: PixelDiet

## 1. Descripción General del Proyecto
**Nombre del Proyecto:** PixelDiet
**Objetivo:** Desarrollar una aplicación web rápida, segura y orientada a la privacidad para la compresión y conversión de imágenes. 
**Enfoque Principal:** Todo el procesamiento debe realizarse estrictamente del lado del cliente (Client-Side). Las imágenes nunca deben subirse a un servidor externo.

## 2. Arquitectura y Stack Tecnológico
* **Tipo de Aplicación:** Single Page Application (SPA) / Sitio Estático.
* **Hosting Objetivo:** GitHub Pages.
* **Procesamiento de Imágenes:** HTML5 `<canvas>` API y JavaScript nativo (o librerías JS especializadas en WebAssembly para formatos modernos).
* **Frontend:** HTML5, CSS3 y JavaScript (Vanilla o un framework ligero, a definir por el desarrollador).
* **Arquitectura de Código:** Principios de Clean Architecture, separando la lógica de procesamiento de imágenes (casos de uso) de la interfaz de usuario.

## 3. Características Principales (Core Features)
* **Carga de Archivos:** Interfaz de "Drag & Drop" (arrastrar y soltar) y botón tradicional para seleccionar archivos.
* **Procesamiento Local:** Lectura de archivos mediante la API `FileReader` y manipulación en el navegador.
* **Controles de Compresión:**
    * Selector de tipo de compresión: **Lossy** (con pérdida) vs **Lossless** (sin pérdida).
    * Slider (control deslizante) para ajustar el nivel de calidad/compresión.
* **Formatos Soportados:**
    * *Lectura:* JPG, PNG, WebP, etc.
    * *Exportación:* Enfoque en formatos modernos y eficientes como **AVIF**, **WebP** y **JPEG XL**, además de los estándares (JPG/PNG).
* **Previsualización en Tiempo Real:**
    * Comparador visual "Antes vs Después" (estilo slider superpuesto).
    * Estimación del tamaño del archivo final en tiempo real antes de descargar.
    * Cálculo del porcentaje de reducción (peso "ahorrado").
* **Descarga:** Botón para guardar la imagen optimizada localmente.

## 4. Requerimientos No Funcionales
* **Privacidad:** Cero transferencias de red para los archivos de los usuarios.
* **Rendimiento:** La UI no debe bloquearse durante el procesamiento pesado (considerar el uso de Web Workers para la compresión).
* **Diseño:** Interfaz minimalista, intuitiva y "Mobile First" (totalmente responsiva).

## 5. Instrucciones para la IA (Punto de Partida)
Actúa como un desarrollador web Senior. Con base en este documento, por favor:
1. Propón la estructura de carpetas y archivos inicial para el proyecto.
2. Escribe el código HTML/CSS básico para la interfaz principal (zona de drag & drop y panel de controles).
3. Escribe la lógica inicial en JavaScript para manejar la subida del archivo, pintarlo en un Canvas y exportarlo a WebP con un nivel de calidad ajustable.