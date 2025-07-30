import { useState } from 'react'
import './App.css'
import MaskLayer from './MaskLayer'
import type { Position } from './MaskLayer'

function App() {
  const [overlayClicks, setOverlayClicks] = useState(0)
  const [unmaskedClicks, setUnmaskedClicks] = useState(0)

  // Example rectangle position with width and height
  const rectanglePosition: Position = {
    x: '50%',
    y: '50%',
    size: '200px 100px',
    anchor: 'ANCHOR_MIDDLE',
    shape: 'SHAPE_RECTANGLE'
  };

  const squarePosition: Position = {
    x: '50%',
    y: '50%',
    size: '200px 400px',
    anchor: 'ANCHOR_MIDDLE',
    shape: 'SHAPE_SQUARE'
  };

  const circlePosition: Position = {
    x: '50%',
    y: '50%',
    size: '200px',
    anchor: 'ANCHOR_MIDDLE',
    shape: 'SHAPE_CIRCLE'
  };

  const Shape = squarePosition;


  const handleOverlayClick = () => {
    setOverlayClicks(prev => prev + 1)
    console.log('Overlay clicked!')
  }

  const handleUnmaskedClick = () => {
    setUnmaskedClicks(prev => prev + 1)
    console.log('Unmasked area clicked!')
  }

  return (
    <div 
      style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#f0f0f0' }}
      onClick={handleUnmaskedClick}
    >
      <MaskLayer 
        holePosition={Shape}
        backgroundColor="rgba(0, 0, 0, 0.5)"
        onOverlayClick={handleOverlayClick}
      />
      
      <div style={{ padding: '20px' }}>
        <h1>Shape Mask Demo</h1>
        <p>This is a test of the shape mask functionality.</p>
        <p><strong>CSS-like Behavior:</strong></p>
        <ul>
          <li>Rectangle: "200px" → "200px 200px" (square), "200px 100px" → 200×100</li>
          <li>Square: "200px 100px" → "200px" (ignores second value)</li>
          <li>Circle: "200px 100px" → "200px" (ignores second value)</li>
        </ul>
        
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          right: '20px', 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          padding: '10px', 
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}>
          <p><strong>Overlay clicks:</strong> {overlayClicks}</p>
          <p><strong>Unmasked clicks:</strong> {unmaskedClicks}</p>
        </div>
      </div>
    </div>
  )
}

export default App
