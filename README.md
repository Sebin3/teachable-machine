# Teachable Machine - Plataforma de Reconocimiento IA

Una aplicación web profesional que integra modelos de machine learning para reconocimiento de audio, detección de objetos y análisis de posturas corporales en tiempo real.

## 🚀 Características Principales

- **Reconocimiento de Audio**: Clasificación de sonidos y voces en tiempo real
- **Detección de Objetos**: Identificación y clasificación de objetos mediante cámara
- **Reconocimiento de Posturas**: Análisis de posturas corporales y movimientos
- **Interfaz Moderna**: Diseño responsivo con gradientes y animaciones
- **Tiempo Real**: Procesamiento inmediato con retroalimentación visual

## 📁 Estructura del Proyecto

```
teachable-machine/
├── index.html              # Página principal con estructura HTML
├── css/
│   └── styles.css          # Estilos CSS con diseño moderno
├── js/
│   ├── main.js            # Funcionalidad global y navegación
│   ├── audio-model.js     # Módulo de reconocimiento de audio
│   ├── object-model.js    # Módulo de detección de objetos
│   └── pose-model.js      # Módulo de reconocimiento de posturas
└── README.md              # Documentación del proyecto
```

## 🎯 Funcionalidades por Módulo

### 1. **Audio Classification (`audio-model.js`)**

**Propósito**: Reconoce y clasifica sonidos/voces usando modelos de Teachable Machine.

**Funcionalidades principales**:
- `startListening()`: Inicia la captura y análisis de audio
- `stopListening()`: Detiene el reconocimiento de audio
- `createModel()`: Carga el modelo de Teachable Machine para audio
- `setupCanvas()`: Configura visualización de ondas de audio

**Estados del botón**:
- `ready`: Listo para iniciar grabación
- `loading`: Cargando modelo de audio
- `active`: Escuchando y analizando audio
- `error`: Error en el proceso

**Elementos UI**:
- Botón de micrófono para iniciar/detener
- Canvas para visualización de audio
- Contenedor de predicciones con confianza

### 2. **Object Detection (`object-model.js`)**

**Propósito**: Detecta y clasifica objetos en tiempo real usando la cámara.

**Funcionalidades principales**:
- `startDetection()`: Activa la cámara e inicia detección
- `stopDetection()`: Detiene la cámara y análisis
- `predict()`: Realiza predicciones en cada frame
- `startDetectionLoop()`: Loop continuo de detección

**Modelo integrado**: 
- URL: `https://teachablemachine.withgoogle.com/models/yhk-ebUk5/`
- Modelo de imagen entrenado personalizado

**Estados del botón**:
- `ready`: Listo para activar cámara
- `loading`: Cargando modelo/iniciando cámara
- `active`: Detectando objetos en tiempo real
- `error`: Error de cámara o modelo

**Elementos UI**:
- Video feed de la cámara
- Canvas overlay para detecciones
- Lista de objetos detectados con confianza

### 3. **Pose Recognition (`pose-model.js`)**

**Propósito**: Analiza posturas corporales y movimientos en tiempo real.

**Funcionalidades principales**:
- `startRecognition()`: Inicia análisis de posturas
- `stopRecognition()`: Detiene el análisis
- `predict()`: Analiza posturas en cada frame
- `startRecognitionLoop()`: Loop continuo de reconocimiento

**Estados del botón**:
- `ready`: Listo para iniciar análisis
- `loading`: Cargando modelo de posturas
- `active`: Analizando posturas en tiempo real
- `error`: Error en el proceso

**Elementos UI**:
- Video feed para captura de movimientos
- Canvas para overlay de puntos de postura
- Predicciones de posturas detectadas

### 4. **Main App (`main.js`)**

**Propósito**: Coordina la aplicación global y maneja interacciones comunes.

**Funcionalidades principales**:
- `updateButtonState()`: Actualiza estados visuales de botones
- `displayPredictions()`: Muestra predicciones en formato uniforme
- `showNotification()`: Sistema de notificaciones
- `handleError()`: Manejo centralizado de errores
- `setupNavigation()`: Navegación suave entre secciones
- `checkBrowserSupport()`: Verifica compatibilidad del navegador

**Estados de botones manejados**:
- `ready`: Verde - Listo para usar
- `loading`: Azul - Cargando/procesando
- `active`: Naranja - Funcionando activamente
- `processing`: Púrpura - Procesando datos
- `error`: Rojo - Error ocurrido

## 🎨 Componentes de UI

### **Header**
- Logo con ícono de cerebro
- Navegación con enlaces a cada sección
- Diseño fijo con efecto blur

### **Secciones**
Cada sección (Audio, Objetos, Posturas) tiene:
- **Header de sección**: Ícono, título y descripción
- **Panel de controles**: Botón principal e indicador de estado
- **Panel de resultados**: Área de visualización y predicciones

### **Sistema de Notificaciones**
- Notificaciones toast en esquina superior derecha
- Tipos: `success`, `error`, `info`, `warning`
- Auto-dismiss después de 5 segundos

### **Estados Visuales**
- **Indicadores de estado**: Puntos de colores que cambian según el estado
- **Animaciones de carga**: Spinners y efectos de transición
- **Retroalimentación visual**: Cambios de color y iconos

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **HTML5**: Estructura semántica moderna
- **CSS3**: Gradientes, animaciones, diseño responsivo
- **JavaScript ES6+**: Módulos, async/await, clases

### **Librerías de IA**
- **TensorFlow.js**: Framework base para ML
- **Teachable Machine Image**: Detección de objetos
- **Teachable Machine Pose**: Reconocimiento de posturas
- **Speech Commands**: Reconocimiento de audio

### **Recursos Externos**
- **Font Awesome 6.4.0**: Iconografía
- **Google Fonts (Inter)**: Tipografía moderna
- **CDN**: Carga optimizada de librerías

## 📱 Diseño Responsivo

### **Breakpoints**
- **Desktop**: > 1024px - Layout completo
- **Tablet**: 768px - 1024px - Adaptación de columnas
- **Mobile**: < 768px - Layout vertical

### **Características Responsivas**
- Grid flexible que se adapta al tamaño de pantalla
- Botones y controles optimizados para touch
- Texto y espaciado escalable
- Navegación colapsible en móviles

## 🔧 Configuración y Uso

### **Requisitos del Navegador**
- Soporte para WebRTC (cámara/micrófono)
- JavaScript habilitado
- Navegadores modernos (Chrome, Firefox, Safari, Edge)

### **Permisos Necesarios**
- **Cámara**: Para detección de objetos y posturas
- **Micrófono**: Para reconocimiento de audio

### **Uso Básico**
1. Abrir `index.html` en un navegador
2. Permitir acceso a cámara/micrófono cuando se solicite
3. Navegar entre secciones usando el menú superior
4. Hacer clic en los botones para activar cada funcionalidad

## 🎯 Flujo de Trabajo

### **Inicialización**
1. Se carga la aplicación principal (`main.js`)
2. Se inicializan los tres módulos (audio, object, pose)
3. Se configuran event listeners y canvas
4. Se verifica compatibilidad del navegador

### **Uso de Funcionalidades**
1. **Usuario hace clic** en botón de una sección
2. **Estado cambia** a "loading" con feedback visual
3. **Se carga el modelo** de Teachable Machine correspondiente
4. **Se solicitan permisos** de cámara/micrófono si es necesario
5. **Estado cambia** a "active" y comienza el procesamiento
6. **Se muestran predicciones** en tiempo real
7. **Usuario puede detener** haciendo clic nuevamente

## 🚨 Manejo de Errores

### **Tipos de Errores Manejados**
- **Permisos denegados**: Cámara/micrófono no autorizados
- **Modelo no encontrado**: URL del modelo inaccesible
- **Hardware no compatible**: Dispositivos sin cámara/micrófono
- **Errores de red**: Problemas de conectividad

### **Retroalimentación de Errores**
- Cambio de estado del botón a "error" (rojo)
- Notificación toast con mensaje descriptivo
- Log en consola para debugging
- Restauración automática al estado "ready"

## 📈 Rendimiento

### **Optimizaciones Implementadas**
- **Lazy loading**: Modelos se cargan solo cuando se necesitan
- **requestAnimationFrame**: Loops de detección optimizados
- **Canvas reutilizable**: Evita recreación de elementos
- **Event delegation**: Manejo eficiente de eventos

### **Consideraciones de Rendimiento**
- Los modelos de IA pueden ser pesados (varios MB)
- El procesamiento en tiempo real consume CPU/GPU
- La resolución de video afecta el rendimiento
- Múltiples secciones activas simultáneamente pueden causar lag

## 🔮 Extensibilidad

### **Agregar Nuevos Modelos**
1. Cambiar la URL del modelo en el módulo correspondiente
2. Ajustar `maxPredictions` si es necesario
3. Personalizar la visualización de predicciones

### **Nuevas Funcionalidades**
- Crear nuevo módulo siguiendo el patrón existente
- Agregar sección en HTML con la estructura estándar
- Integrar con el sistema de navegación y notificaciones

### **Personalización de UI**
- Modificar variables CSS para cambiar colores/fuentes
- Ajustar animaciones y transiciones
- Personalizar iconos y textos

---

## 📝 Notas de Desarrollo

Este proyecto fue desarrollado como una plataforma profesional para demostrar las capacidades de Teachable Machine de Google, integrando múltiples tipos de reconocimiento de IA en una interfaz unificada y moderna.