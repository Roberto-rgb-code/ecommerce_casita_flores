# Galería de Imágenes - Documentación

## Resumen
Se ha implementado un sistema completo de galería de imágenes usando `react-image-gallery`, una de las librerías más populares para React. El sistema incluye componentes responsivos que se adaptan automáticamente a dispositivos móviles y desktop.

## Componentes Implementados

### 1. ImageGallery.tsx
Componente básico que implementa `react-image-gallery` con funcionalidades estándar.

**Características:**
- Navegación con flechas
- Miniaturas
- Botón de pantalla completa
- Indicadores de puntos
- Lazy loading
- Manejo de errores de imagen

### 2. EnhancedImageGallery.tsx
Versión mejorada con funcionalidades adicionales y mejor control.

**Características:**
- Todas las características del componente básico
- Callbacks personalizados para eventos
- Navegación personalizada con iconos SVG
- Indicador de imagen actual
- Mejor manejo de estados

### 3. MobileImageGallery.tsx
Galería optimizada específicamente para dispositivos móviles.

**Características:**
- Navegación por gestos táctiles (swipe)
- Miniaturas horizontales con scroll
- Indicadores de puntos
- Áreas táctiles para navegación
- Optimizada para touch

### 4. ResponsiveImageGallery.tsx
Componente inteligente que detecta automáticamente el tipo de dispositivo y usa la galería apropiada.

**Características:**
- Detección automática de dispositivos móviles
- Cambio dinámico entre galerías
- Optimización automática de rendimiento
- Fallback durante la hidratación

### 5. useImageGallery.ts
Hook personalizado para manejar la lógica de la galería.

**Funcionalidades:**
- Estado de la galería
- Navegación programática
- Manejo de eventos
- Conversión de imágenes
- Callbacks personalizados

## Uso

### Implementación Básica
```tsx
import ResponsiveImageGallery from './components/ResponsiveImageGallery';

function ProductDetail({ product }) {
  const productImages = [product.image, ...(product.additional_images || [])].filter(Boolean);

  return (
    <ResponsiveImageGallery 
      images={productImages}
      productName={product.title}
      className="w-full h-full"
      showThumbnails={true}
      showFullscreenButton={true}
      showBullets={true}
      showNav={true}
      autoPlay={false}
    />
  );
}
```

### Implementación Avanzada
```tsx
import { useImageGallery } from './hooks/useImageGallery';

function CustomGallery({ images, productName }) {
  const {
    galleryImages,
    currentIndex,
    goToNext,
    goToPrevious,
    goToSlide,
  } = useImageGallery({ images, productName });

  return (
    <div>
      {/* Tu implementación personalizada */}
    </div>
  );
}
```

## Configuración

### Props Disponibles

#### ResponsiveImageGallery
- `images: string[]` - Array de URLs de imágenes
- `productName?: string` - Nombre del producto para alt text
- `className?: string` - Clases CSS adicionales
- `showThumbnails?: boolean` - Mostrar miniaturas (default: true)
- `showFullscreenButton?: boolean` - Mostrar botón pantalla completa (default: true)
- `showBullets?: boolean` - Mostrar indicadores de puntos (default: true)
- `showNav?: boolean` - Mostrar navegación (default: true)
- `autoPlay?: boolean` - Reproducción automática (default: false)
- `slideInterval?: number` - Intervalo de auto-play en ms (default: 3000)

#### MobileImageGallery
- `images: string[]` - Array de URLs de imágenes
- `productName?: string` - Nombre del producto
- `className?: string` - Clases CSS adicionales

## Estilos CSS

### Archivo: ImageGallery.css
Contiene estilos personalizados para:
- Navegación con iconos personalizados
- Miniaturas con hover effects
- Indicadores de puntos
- Botón de pantalla completa
- Responsive design
- Animaciones suaves

### Variables CSS Utilizadas
- `--brand` - Color principal de la marca
- `--ink` - Color de texto principal
- `--muted` - Color de texto secundario

## Características Técnicas

### Rendimiento
- Lazy loading de imágenes
- Hidratación optimizada
- Detección inteligente de dispositivos
- Carga diferida de componentes

### Accesibilidad
- Navegación por teclado
- Alt text descriptivo
- ARIA labels
- Focus management

### Responsive Design
- Breakpoint móvil: 768px
- Navegación táctil en móviles
- Galería completa en desktop
- Adaptación automática

## Dependencias

### Principales
- `react-image-gallery: ^1.4.0` - Librería principal
- `@types/react-image-gallery: ^1.2.4` - Tipos TypeScript

### CSS
- `react-image-gallery/styles/css/image-gallery.css` - Estilos base
- `./ImageGallery.css` - Estilos personalizados

## Fallbacks y Manejo de Errores

### Imágenes
- Fallback automático a `/flores_hero1.jpeg` en caso de error
- Indicador de "Sin imagen" cuando no hay imágenes
- Loading state durante la hidratación

### Dispositivos
- Detección por User Agent y viewport
- Fallback a galería básica en caso de error
- Optimización automática según dispositivo

## Mejores Prácticas

### Optimización de Imágenes
1. Usar imágenes optimizadas (WebP, AVIF)
2. Tamaños apropiados para cada breakpoint
3. Lazy loading habilitado
4. Compresión adecuada

### UX/UI
1. Transiciones suaves (450ms)
2. Feedback visual en interacciones
3. Indicadores claros de estado
4. Navegación intuitiva

### Performance
1. Carga diferida de componentes
2. Memoización de cálculos pesados
3. Cleanup de event listeners
4. Optimización de re-renders

## Troubleshooting

### Problemas Comunes

1. **Imágenes no cargan**
   - Verificar URLs de imágenes
   - Comprobar fallback image
   - Revisar CORS si aplica

2. **Galería no responde en móvil**
   - Verificar detección de dispositivo
   - Comprobar event listeners
   - Revisar CSS touch-action

3. **Estilos no se aplican**
   - Verificar importación de CSS
   - Comprobar especificidad de selectores
   - Revisar variables CSS

### Debug
```tsx
// Habilitar logs de debug
console.log('Gallery images:', images);
console.log('Current index:', currentIndex);
console.log('Is mobile:', isMobile);
```

## Futuras Mejoras

### Funcionalidades Adicionales
- Zoom con pinch en móviles
- Galería en modo carrusel
- Integración con lightbox externo
- Soporte para videos
- Análiticas de interacción

### Optimizaciones
- Virtual scrolling para muchas imágenes
- Preload de imágenes adyacentes
- Cache inteligente
- Compresión automática

## Conclusión

El sistema de galería de imágenes está completamente implementado y funcional. Utiliza `react-image-gallery`, una librería robusta y popular, con componentes responsivos que se adaptan automáticamente a diferentes dispositivos. La implementación incluye manejo de errores, optimizaciones de rendimiento y una excelente experiencia de usuario tanto en móviles como en desktop.
