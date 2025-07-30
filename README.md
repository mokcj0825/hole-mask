# Hole Mask

A React component for creating mask overlays with customizable holes. Perfect for creating focus areas, tutorials, or highlighting specific content on your web pages. Supports multiple shapes (rectangles, squares, circles) with CSS-like behavior and proper click event handling.

## Installation

```bash
npm install @mokcj0825/hole-mask
```

## Usage

```tsx
import { MaskLayer, Position } from '@mokcj0825/hole-mask';

function App() {
  const holePosition: Position = {
    x: '50%',
    y: '50%',
    size: '200px 150px', // width height for rectangles
    anchor: 'ANCHOR_MIDDLE',
    shape: 'SHAPE_RECTANGLE'
  };

  return (
    <div 
      style={{ position: 'relative', width: '100vw', height: '100vh' }}
      onClick={() => console.log('Unmasked area clicked!')}
    >
      <div>Some content to mask</div>
      
      <MaskLayer
        holePosition={holePosition}
        backgroundColor="rgba(0, 0, 0, 0.5)"
        onOverlayClick={() => console.log('Overlay clicked!')}
        maskIndex={1000}
      />
    </div>
  );
}
```

## Features

### ✅ **Multiple Shape Support**
- **Rectangles**: `size: "200px 150px"` (width height format)
- **Squares**: `size: "200px"` (single dimension)
- **Circles**: `size: "200px"` (single dimension, creates perfect circular holes)

### ✅ **CSS-like Behavior**
- **Rectangles**: Single value `"200px"` becomes `"200px 200px"` (square rectangle)
- **Squares/Circles**: Multiple values `"200px 100px"` uses only `"200px"` (ignores second value)

### ✅ **Smart Click Handling**
- **Overlay clicks**: Triggered when clicking on masked areas
- **Unmasked clicks**: Triggered when clicking in the transparent hole area
- **Proper event propagation**: No interference between overlay and unmasked clicks

### ✅ **Flexible Positioning**
- **5 anchor points**: MIDDLE, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT
- **Mixed units**: Support for both `px` and `%` values
- **Responsive**: Works with any container size

## API Reference

### MaskLayer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `holePosition` | `Position` | **required** | The position, size, and shape of the hole |
| `backgroundColor` | `string` | `'rgba(0, 0, 0, 0.1)'` | Background color of the mask overlay |
| `onOverlayClick` | `() => void` | `undefined` | Callback function when overlay is clicked |
| `maskIndex` | `number` | `1000` | CSS z-index for the mask layer |

### Position Interface

```tsx
interface Position {
  x: PositionValue;        // X coordinate (e.g., "50%", "100px")
  y: PositionValue;        // Y coordinate (e.g., "50%", "100px")
  size: PositionValue;     // Size of the hole (shape-specific format)
  anchor: AnchorType;      // Anchor point for positioning
  shape: ShapeType;        // Shape type (RECTANGLE, SQUARE, CIRCLE)
}
```

### PositionValue Type

A string in the format `"numberpx"` or `"number%"` (e.g., `"100px"`, `"50%"`).

### ShapeType

- `'SHAPE_RECTANGLE'` - Rectangular hole (supports width/height format)
- `'SHAPE_SQUARE'` - Square hole (single dimension)
- `'SHAPE_CIRCLE'` - Circular hole (single dimension, perfect circles)

### AnchorType

- `'ANCHOR_MIDDLE'` - Center the hole at the specified position
- `'ANCHOR_TOP_LEFT'` - Position the top-left corner at the specified position
- `'ANCHOR_TOP_RIGHT'` - Position the top-right corner at the specified position
- `'ANCHOR_BOTTOM_LEFT'` - Position the bottom-left corner at the specified position
- `'ANCHOR_BOTTOM_RIGHT'` - Position the bottom-right corner at the specified position

## Examples

### Rectangle Mask

```tsx
const rectanglePosition: Position = {
  x: '50%',
  y: '50%',
  size: '200px 150px', // width height format
  anchor: 'ANCHOR_MIDDLE',
  shape: 'SHAPE_RECTANGLE'
};

<MaskLayer holePosition={rectanglePosition} />
```

### Square Mask (CSS-like behavior)

```tsx
const squarePosition: Position = {
  x: '50%',
  y: '50%',
  size: '200px', // Single value creates square
  anchor: 'ANCHOR_MIDDLE',
  shape: 'SHAPE_SQUARE'
};

<MaskLayer holePosition={squarePosition} />
```

### Circle Mask (Perfect circular holes)

```tsx
const circlePosition: Position = {
  x: '50%',
  y: '50%',
  size: '200px', // Diameter of the circle
  anchor: 'ANCHOR_MIDDLE',
  shape: 'SHAPE_CIRCLE'
};

<MaskLayer holePosition={circlePosition} />
```

### With Click Handlers

```tsx
function App() {
  const [overlayClicks, setOverlayClicks] = useState(0);
  const [unmaskedClicks, setUnmaskedClicks] = useState(0);

  return (
    <div 
      style={{ position: 'relative', width: '100vw', height: '100vh' }}
      onClick={() => setUnmaskedClicks(prev => prev + 1)}
    >
      <MaskLayer
        holePosition={position}
        onOverlayClick={() => setOverlayClicks(prev => prev + 1)}
      />
      
      <div>Overlay clicks: {overlayClicks}</div>
      <div>Unmasked clicks: {unmaskedClicks}</div>
    </div>
  );
}
```

### Custom Styling

```tsx
<MaskLayer
  holePosition={position}
  backgroundColor="rgba(255, 0, 0, 0.3)"
  maskIndex={9999}
/>
```

## Shape-Specific Behavior

### Rectangle (`SHAPE_RECTANGLE`)
- **Format**: `"widthpx heightpx"` or `"width% height%"`
- **CSS-like**: `"200px"` becomes `"200px 200px"` (square rectangle)
- **Example**: `"200px 150px"` creates 200×150 rectangle

### Square (`SHAPE_SQUARE`)
- **Format**: `"numberpx"` or `"number%"`
- **CSS-like**: `"200px 100px"` uses only `"200px"` (ignores second value)
- **Example**: `"200px"` creates 200×200 square

### Circle (`SHAPE_CIRCLE`)
- **Format**: `"numberpx"` or `"number%"`
- **CSS-like**: `"200px 100px"` uses only `"200px"` (ignores second value)
- **Example**: `"200px"` creates 200px diameter circle
- **Technology**: Uses CSS masking for perfect circular holes

## Requirements

- React 16.8.0 or higher
- React DOM 16.8.0 or higher
- Modern browsers with CSS mask support

## Browser Support

- ✅ Chrome/Edge (with WebKit prefix support)
- ✅ Firefox
- ⚠️ Safari (limited mask support)

## License

MIT
