import React from 'react';

type Unit = 'px' | '%';

// Shape-specific position value types
type RectanglePositionValue = `${number}${Unit} ${number}${Unit}`;
type SquarePositionValue = `${number}${Unit}`;
type CirclePositionValue = `${number}${Unit}`;

// Union type for all position values
type PositionValue = RectanglePositionValue | SquarePositionValue | CirclePositionValue;

export interface Position {
    x: PositionValue;
    y: PositionValue;
    size: PositionValue;
    anchor: 'ANCHOR_MIDDLE' | 'ANCHOR_TOP_LEFT' | 'ANCHOR_TOP_RIGHT' | 'ANCHOR_BOTTOM_LEFT' | 'ANCHOR_BOTTOM_RIGHT';
    shape: 'SHAPE_RECTANGLE' | 'SHAPE_SQUARE' | 'SHAPE_CIRCLE';
}

export interface MaskLayerProps {
    holePosition: Position;
    backgroundColor?: string;
    onOverlayClick?: () => void;
    maskIndex?: number;
}

const MaskLayer: React.FC<MaskLayerProps> = ({
    holePosition,
    backgroundColor = 'rgba(0, 0, 0, 0.1)',
    onOverlayClick,
    maskIndex = 1000,
}) => {
    // Helper function to parse value and unit
    const parseValue = (value: PositionValue) => {
        const match = value.match(/^(\d+(?:\.\d+)?)(px|%)$/);
        if (!match) {
            throw new Error(`Invalid position value: ${value}. Expected format: "numberpx" or "number%"`);
        }
        return {
            value: parseFloat(match[1]),
            unit: match[2] as Unit
        };
    };

    // Helper function to parse rectangle dimensions (width height)
    const parseRectangleDimensions = (value: RectanglePositionValue) => {
        const parts = value.split(' ');
        if (parts.length !== 2) {
            throw new Error(`Invalid rectangle dimensions: ${value}. Expected format: "widthpx heightpx" or "width% height%"`);
        }
        
        const widthMatch = parts[0].match(/^(\d+(?:\.\d+)?)(px|%)$/);
        const heightMatch = parts[1].match(/^(\d+(?:\.\d+)?)(px|%)$/);
        
        if (!widthMatch || !heightMatch) {
            throw new Error(`Invalid rectangle dimensions: ${value}. Expected format: "widthpx heightpx" or "width% height%"`);
        }
        
        return {
            width: { value: parseFloat(widthMatch[1]), unit: widthMatch[2] as Unit },
            height: { value: parseFloat(heightMatch[1]), unit: heightMatch[2] as Unit }
        };
    };

    // Helper function to get shape-specific size value
    const getShapeSize = (size: PositionValue, shape: Position['shape']): PositionValue => {
        switch (shape) {
            case 'SHAPE_RECTANGLE':
                // For rectangles, if single value is provided, treat as width=height (CSS-like behavior)
                if (!size.includes(' ')) {
                    return `${size} ${size}` as RectanglePositionValue;
                }
                return size;
            case 'SHAPE_SQUARE':
            case 'SHAPE_CIRCLE':
                // For squares/circles, if multiple values are provided, use only the first one
                if (size.includes(' ')) {
                    return size.split(' ')[0] as PositionValue;
                }
                return size;
            default:
                return size;
        }
    };

    // Helper function to calculate circle center position
    const calculateCircleCenter = (x: PositionValue, y: PositionValue, radius: number, unit: Unit, anchor: Position['anchor']) => {
        switch (anchor) {
            case 'ANCHOR_TOP_LEFT':
                return {
                    centerX: `calc(${x} + ${radius}${unit})`,
                    centerY: `calc(${y} + ${radius}${unit})`
                };
            case 'ANCHOR_TOP_RIGHT':
                return {
                    centerX: `calc(${x} - ${radius}${unit})`,
                    centerY: `calc(${y} + ${radius}${unit})`
                };
            case 'ANCHOR_BOTTOM_LEFT':
                return {
                    centerX: `calc(${x} + ${radius}${unit})`,
                    centerY: `calc(${y} - ${radius}${unit})`
                };
            case 'ANCHOR_BOTTOM_RIGHT':
                return {
                    centerX: `calc(${x} - ${radius}${unit})`,
                    centerY: `calc(${y} - ${radius}${unit})`
                };
            case 'ANCHOR_MIDDLE':
            default:
                return {
                    centerX: x,
                    centerY: y
                };
        }
    };

    // Helper function to detect if click is inside circle
    const isClickInsideCircle = (
        clickX: number, 
        clickY: number, 
        centerX: number, 
        centerY: number, 
        radius: number
    ): boolean => {
        const distance = Math.sqrt(
            Math.pow(clickX - centerX, 2) + 
            Math.pow(clickY - centerY, 2)
        );
        return distance <= radius;
    };

    // Helper function to convert position value to pixels
    const positionToPixels = (value: number, unit: Unit, containerSize: number): number => {
        return unit === '%' ? (containerSize * value) / 100 : value;
    };

    const getHoleBoundaries = () => {
        switch (holePosition.shape) {
            case 'SHAPE_RECTANGLE': {
                const rectangleSize = getShapeSize(holePosition.size, 'SHAPE_RECTANGLE') as RectanglePositionValue;
                //const xParsed = parseValue(holePosition.x);
                //const yParsed = parseValue(holePosition.y);
                const dimensions = parseRectangleDimensions(rectangleSize);
                
                switch (holePosition.anchor) {
                    case 'ANCHOR_TOP_LEFT':
                        return {
                            left: holePosition.x,
                            top: holePosition.y,
                            right: `calc(${holePosition.x} + ${dimensions.width.value}${dimensions.width.unit})`,
                            bottom: `calc(${holePosition.y} + ${dimensions.height.value}${dimensions.height.unit})`
                        };
                    case 'ANCHOR_TOP_RIGHT':
                        return {
                            left: `calc(${holePosition.x} - ${dimensions.width.value}${dimensions.width.unit})`,
                            top: holePosition.y,
                            right: holePosition.x,
                            bottom: `calc(${holePosition.y} + ${dimensions.height.value}${dimensions.height.unit})`
                        };
                    case 'ANCHOR_BOTTOM_LEFT':
                        return {
                            left: holePosition.x,
                            top: `calc(${holePosition.y} - ${dimensions.height.value}${dimensions.height.unit})`,
                            right: `calc(${holePosition.x} + ${dimensions.width.value}${dimensions.width.unit})`,
                            bottom: holePosition.y
                        };
                    case 'ANCHOR_BOTTOM_RIGHT':
                        return {
                            left: `calc(${holePosition.x} - ${dimensions.width.value}${dimensions.width.unit})`,
                            top: `calc(${holePosition.y} - ${dimensions.height.value}${dimensions.height.unit})`,
                            right: holePosition.x,
                            bottom: holePosition.y
                        };
                    case 'ANCHOR_MIDDLE':
                    default:
                        return {
                            left: `calc(${holePosition.x} - ${dimensions.width.value / 2}${dimensions.width.unit})`,
                            top: `calc(${holePosition.y} - ${dimensions.height.value / 2}${dimensions.height.unit})`,
                            right: `calc(${holePosition.x} + ${dimensions.width.value / 2}${dimensions.width.unit})`,
                            bottom: `calc(${holePosition.y} + ${dimensions.height.value / 2}${dimensions.height.unit})`
                        };
                }
            }
            case 'SHAPE_SQUARE':
            case 'SHAPE_CIRCLE': {
                const singleSize = getShapeSize(holePosition.size, holePosition.shape);
                const sizeParsed = parseValue(singleSize);
                //const xParsed = parseValue(holePosition.x);
                //const yParsed = parseValue(holePosition.y);

                switch (holePosition.anchor) {
                    case 'ANCHOR_TOP_LEFT':
                        return {
                            left: holePosition.x,
                            top: holePosition.y,
                            right: `calc(${holePosition.x} + ${holePosition.size})`,
                            bottom: `calc(${holePosition.y} + ${holePosition.size})`
                        };
                    case 'ANCHOR_TOP_RIGHT':
                        return {
                            left: `calc(${holePosition.x} - ${holePosition.size})`,
                            top: holePosition.y,
                            right: holePosition.x,
                            bottom: `calc(${holePosition.y} + ${holePosition.size})`
                        };
                    case 'ANCHOR_BOTTOM_LEFT':
                        return {
                            left: holePosition.x,
                            top: `calc(${holePosition.y} - ${holePosition.size})`,
                            right: `calc(${holePosition.x} + ${holePosition.size})`,
                            bottom: holePosition.y
                        };
                    case 'ANCHOR_BOTTOM_RIGHT':
                        return {
                            left: `calc(${holePosition.x} - ${holePosition.size})`,
                            top: `calc(${holePosition.y} - ${holePosition.size})`,
                            right: holePosition.x,
                            bottom: holePosition.y
                        };
                    case 'ANCHOR_MIDDLE':
                    default:
                        return {
                            left: `calc(${holePosition.x} - ${sizeParsed.value / 2}${sizeParsed.unit})`,
                            top: `calc(${holePosition.y} - ${sizeParsed.value / 2}${sizeParsed.unit})`,
                            right: `calc(${holePosition.x} + ${sizeParsed.value / 2}${sizeParsed.unit})`,
                            bottom: `calc(${holePosition.y} + ${sizeParsed.value / 2}${sizeParsed.unit})`
                        };
                }
            }
        }
    };

    const holeBounds = getHoleBoundaries();

    // Helper function to get rectangle height for mask calculations
    const getRectangleHeight = () => {
        if (holePosition.shape === 'SHAPE_RECTANGLE') {
            const dimensions = holePosition.size.split(' ');
            if (dimensions.length === 2) {
                return dimensions[1]; // Return height part
            } else {
                return holePosition.size; // Single value treated as both width and height
            }
        } else if (holePosition.shape === 'SHAPE_SQUARE' || holePosition.shape === 'SHAPE_CIRCLE') {
            // For squares/circles, use only the first value if multiple are provided
            if (holePosition.size.includes(' ')) {
                return holePosition.size.split(' ')[0]; // Take only the first value
            }
            return holePosition.size; // Single value
        }
        return holePosition.size; // Fallback for other shapes
    };

    // Handle click events
    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (onOverlayClick) {
            onOverlayClick();
        }
    };

    // Handle circle click with detection
    const handleCircleClick = (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        const circleSize = getShapeSize(holePosition.size, 'SHAPE_CIRCLE');
        const sizeParsed = parseValue(circleSize);
        const radius = sizeParsed.value / 2;
        
        const { centerX, centerY } = calculateCircleCenter(
            holePosition.x, 
            holePosition.y, 
            radius, 
            sizeParsed.unit, 
            holePosition.anchor
        );
        
        const centerXValue = parseValue(centerX as PositionValue);
        const centerYValue = parseValue(centerY as PositionValue);
        
        const centerXPx = positionToPixels(centerXValue.value, centerXValue.unit, rect.width);
        const centerYPx = positionToPixels(centerYValue.value, centerYValue.unit, rect.height);
        const radiusPx = positionToPixels(radius, sizeParsed.unit, Math.min(rect.width, rect.height));
        
        if (isClickInsideCircle(clickX, clickY, centerXPx, centerYPx, radiusPx)) {
            // Click is inside circle - trigger unmasked click by dispatching to parent
            event.stopPropagation();
            const parentElement = event.currentTarget.parentElement;
            if (parentElement) {
                const newEvent = new MouseEvent('click', {
                    clientX: event.clientX,
                    clientY: event.clientY,
                    bubbles: true,
                    cancelable: true
                });
                parentElement.dispatchEvent(newEvent);
            }
        } else {
            // Click is outside circle - handle as overlay click
            event.stopPropagation();
            if (onOverlayClick) {
                onOverlayClick();
            }
        }
    };

    // Render circle mask
    if (holePosition.shape === 'SHAPE_CIRCLE') {
        const circleSize = getShapeSize(holePosition.size, 'SHAPE_CIRCLE');
        const sizeParsed = parseValue(circleSize);
        const radius = sizeParsed.value / 2;
        const { centerX, centerY } = calculateCircleCenter(
            holePosition.x, 
            holePosition.y, 
            radius, 
            sizeParsed.unit, 
            holePosition.anchor
        );
        
        return (
            <div
                onClick={handleCircleClick}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: backgroundColor,
                    mask: `radial-gradient(circle ${radius}${sizeParsed.unit} at ${centerX} ${centerY}, transparent 0%, transparent 100%, black 100%)`,
                    WebkitMask: `radial-gradient(circle ${radius}${sizeParsed.unit} at ${centerX} ${centerY}, transparent 0%, transparent 100%, black 100%)`,
                    zIndex: maskIndex
                }}
            />
        );
    }

    // Render rectangle/square mask using four-div approach
    return (
        <>
            <div
                onClick={handleClick}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: holeBounds.top,
                    backgroundColor: backgroundColor,
                    zIndex: maskIndex
                }}
            />

            <div
                onClick={handleClick}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: `calc(100% - ${holeBounds.bottom})`,
                    backgroundColor: backgroundColor,
                    zIndex: maskIndex
                }}
            />

            <div
                onClick={handleClick}
                style={{
                    position: 'absolute',
                    top: holeBounds.top,
                    left: 0,
                    width: holeBounds.left,
                    height: getRectangleHeight(),
                    backgroundColor: backgroundColor,
                    zIndex: maskIndex
                }}
            />

            <div
                onClick={handleClick}
                style={{
                    position: 'absolute',
                    top: holeBounds.top,
                    right: 0,
                    width: `calc(100% - ${holeBounds.right})`,
                    height: getRectangleHeight(),
                    backgroundColor: backgroundColor,
                    zIndex: maskIndex
                }}
            />
        </>
    );
};

export default MaskLayer;