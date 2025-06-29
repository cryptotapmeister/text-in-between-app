'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Download, Plus, Trash2, Type, Palette, AlertCircle } from 'lucide-react';
import DraggableText from './TextLayer';
import FontPicker from './FontPicker';
import { useImageExport } from '@/app/hooks/useImageExport';
import { isCanvasSupported } from '@/app/utils/canvas';

const ItemTypes = {
  TEXT: 'text',
};

// Main Canvas Component
function Canvas({ textElements, onMoveText, onUpdateText, onDeleteText, canvasSize, backgroundImage }) {
  const [, drop] = useDrop({
    accept: ItemTypes.TEXT,
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const element = textElements.find(el => el.id === item.id);
      if (element && delta) {
        onMoveText(item.id, {
          x: Math.max(0, Math.min(canvasSize.width - 100, element.position.x + delta.x)),
          y: Math.max(0, Math.min(canvasSize.height - 50, element.position.y + delta.y))
        });
      }
    },
  });

  return (
    <div
      ref={drop}
      className="relative border-2 border-gray-300 bg-white overflow-hidden"
      style={{
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {textElements.map((element) => (
        <DraggableText
          key={element.id}
          id={element.id}
          text={element.text}
          x={element.position.x}
          y={element.position.y}
          fontSize={element.fontSize}
          fontFamily={element.fontFamily}
          color={element.color}
          isBold={element.isBold}
          isItalic={element.isItalic}
          glowIntensity={element.glowIntensity}
          onUpdate={onUpdateText}
          onDelete={onDeleteText}
        />
      ))}
    </div>
  );
}

// Additional Properties Panel for text styling beyond font
function AdditionalPropertiesPanel({ selectedText, onUpdateText }) {
  if (!selectedText) return null;

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-4 mt-4">
      <h3 className="font-semibold text-lg">Text Effects</h3>
      
      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium mb-1">Font Size: {selectedText.fontSize}px</label>
        <input
          type="range"
          min="12"
          max="100"
          value={selectedText.fontSize}
          onChange={(e) => onUpdateText(selectedText.id, { fontSize: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <input
          type="color"
          value={selectedText.color}
          onChange={(e) => onUpdateText(selectedText.id, { color: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded-md"
        />
      </div>

      {/* Glow Effect */}
      <div>
        <label className="block text-sm font-medium mb-1">Glow Intensity: {selectedText.glowIntensity}</label>
        <input
          type="range"
          min="0"
          max="10"
          value={selectedText.glowIntensity}
          onChange={(e) => onUpdateText(selectedText.id, { glowIntensity: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  );
}

// Main Image Editor Component
export default function ImageEditor() {
  const [textElements, setTextElements] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Use the image export hook
  const { handleDownload, isCanvasSupported: canvasSupported } = useImageExport(
    canvasRef, 
    textElements, 
    canvasSize, 
    backgroundImage
  );

  // Check for canvas support
  useEffect(() => {
    if (!canvasSupported) {
      setError('Canvas is not supported in your browser. Some features may not work.');
    }
  }, [canvasSupported]);

  const addTextElement = () => {
    const newElement = {
      id: Date.now(),
      text: 'Sample Text',
      position: { x: 100, y: 100 },
      fontSize: 24,
      fontFamily: 'Inter',
      color: '#000000',
      isBold: false,
      isItalic: false,
      glowIntensity: 0,
    };
    setTextElements([...textElements, newElement]);
    setSelectedTextId(newElement.id);
  };

  const updateTextElement = (id, updates) => {
    setTextElements(prev => 
      prev.map(element => 
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  const deleteTextElement = (id) => {
    setTextElements(prev => prev.filter(element => element.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  };

  const moveTextElement = (id, newPosition) => {
    updateTextElement(id, { position: newPosition });
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportImage = async (format = 'png') => {
    try {
      setError(null);
      await handleDownload(format);
    } catch (error) {
      console.error('Export failed:', error);
      setError(`Failed to export image: ${error.message}`);
    }
  };

  const selectedText = textElements.find(el => el.id === selectedTextId);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex flex-wrap gap-4">
              <button
                onClick={addTextElement}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                <Plus size={16} />
                Add Text
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                <Type size={16} />
                Upload Background
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => exportImage('png')}
                  disabled={!canvasSupported}
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Download size={16} />
                  PNG
                </button>
                <button
                  onClick={() => exportImage('jpeg')}
                  disabled={!canvasSupported}
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Download size={16} />
                  JPEG
                </button>
                <button
                  onClick={() => exportImage('webp')}
                  disabled={!canvasSupported}
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Download size={16} />
                  WEBP
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="hidden"
            />

            <Canvas
              textElements={textElements}
              onMoveText={moveTextElement}
              onUpdateText={updateTextElement}
              onDeleteText={deleteTextElement}
              canvasSize={canvasSize}
              backgroundImage={backgroundImage}
            />

            {/* Hidden canvas for export */}
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
              width={canvasSize.width}
              height={canvasSize.height}
            />
          </div>

          {/* Properties Panel */}
          <div>
            <FontPicker
              selectedText={selectedText}
              onUpdateText={updateTextElement}
            />

            <AdditionalPropertiesPanel
              selectedText={selectedText}
              onUpdateText={updateTextElement}
            />

            {/* Text Elements List */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Text Elements</h3>
              {textElements.length === 0 ? (
                <p className="text-gray-500 text-center">No text elements added</p>
              ) : (
                <div className="space-y-2">
                  {textElements.map((element) => (
                    <div
                      key={element.id}
                      className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                        selectedTextId === element.id ? 'bg-blue-100' : 'bg-white'
                      }`}
                      onClick={() => setSelectedTextId(element.id)}
                    >
                      <span className="truncate">{element.text}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTextElement(element.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Test Cases Section for Development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Test Cases</h3>
                <div className="space-y-2 text-sm">
                  <button 
                    onClick={() => {
                      const testElement = {
                        id: Date.now(),
                        text: '你好 안녕 こんにちは',
                        position: { x: 50, y: 50 },
                        fontSize: 32,
                        fontFamily: 'Noto Sans CJK SC',
                        color: '#ff0000',
                        isBold: false,
                        isItalic: false,
                        glowIntensity: 5,
                      };
                      setTextElements(prev => [...prev, testElement]);
                    }}
                    className="block w-full text-left p-2 bg-white rounded hover:bg-gray-50"
                  >
                    Add CJK Test Text
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 