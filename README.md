# Hole Mask

A React component for creating mask overlays with customizable holes. Perfect for creating focus areas, tutorials, or highlighting specific content on your web pages.

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
    size: '200px',
    anchor: 'ANCHOR_MIDDLE'
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
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

## API Reference

### MaskLayer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `holePosition` | `Position` | **required** | The position and size of the hole |
| `backgroundColor` | `string` | `'rgba(0, 0, 0, 0.1)'` | Background color of the mask overlay |
| `onOverlayClick` | `() => void` | `undefined` | Callback function when overlay is clicked |
| `maskIndex` | `number` | `1000` | CSS z-index for the mask layer |

### Position Interface

```tsx
interface Position {
  x: PositionValue;        // X coordinate (e.g., "50%", "100px")
  y: PositionValue;        // Y coordinate (e.g., "50%", "100px")
  size: PositionValue;     // Size of the hole (e.g., "200px", "50%")
  anchor: AnchorType;      // Anchor point for positioning
}
```

### PositionValue Type

A string in the format `"numberpx"` or `"number%"` (e.g., `"100px"`, `"50%"`).

### AnchorType

- `'ANCHOR_MIDDLE'` - Center the hole at the specified position
- `'ANCHOR_TOP_LEFT'` - Position the top-left corner at the specified position
- `'ANCHOR_TOP_RIGHT'` - Position the top-right corner at the specified position
- `'ANCHOR_BOTTOM_LEFT'` - Position the bottom-left corner at the specified position
- `'ANCHOR_BOTTOM_RIGHT'` - Position the bottom-right corner at the specified position

## Examples

### Basic Usage

```tsx
import { MaskLayer, Position } from '@your-username/hole-mask';

const position: Position = {
  x: '50%',
  y: '50%',
  size: '200px',
  anchor: 'ANCHOR_MIDDLE'
};

<MaskLayer holePosition={position} />
```

### Custom Styling

```tsx
<MaskLayer
  holePosition={position}
  backgroundColor="rgba(255, 0, 0, 0.3)"
  maskIndex={9999}
/>
```

### With Click Handler

```tsx
<MaskLayer
  holePosition={position}
  onOverlayClick={() => {
    console.log('User clicked outside the hole');
    // Handle overlay click
  }}
/>
```

## Requirements

- React 16.8.0 or higher
- React DOM 16.8.0 or higher

## License

MIT
