'use client';

import { useDrag } from 'react-dnd';

export default function DraggableText({ text, x, y, id, fontSize, fontFamily, color, isBold, isItalic, glowIntensity, onUpdate, onDelete }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TEXT',
    item: { text, x, y, id },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  const isCJKFont = ['Noto Sans CJK SC', 'Noto Sans CJK TC', 'Noto Sans CJK JP', 'Noto Sans CJK KR', 'Source Han Sans', 'Source Han Serif'].includes(fontFamily);

  return (
    <div 
      ref={drag} 
      style={{ 
        position: 'absolute',
        left: x, 
        top: y,
        fontSize: `${fontSize}px`,
        fontFamily: fontFamily,
        color: color,
        fontWeight: isBold && !isCJKFont ? 'bold' : 'normal',
        fontStyle: isItalic && !isCJKFont ? 'italic' : 'normal',
        textShadow: glowIntensity > 0 ? `0 0 ${glowIntensity * 5}px ${color}` : 'none',
        cursor: 'move',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        zIndex: 10,
      }} 
      className={`${isDragging ? 'opacity-50' : ''}`}
      onDoubleClick={() => {
        const newText = prompt('Edit text:', text);
        if (newText !== null) {
          onUpdate(id, { text: newText });
        }
      }}
    >
      {text}
      <button
        onClick={() => onDelete(id)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  );
} 