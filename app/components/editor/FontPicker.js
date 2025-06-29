'use client';

import { useState, useEffect } from 'react';

const GOOGLE_FONTS = {
  english: [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Source Sans Pro', 'Montserrat',
    'Oswald', 'Raleway', 'Ubuntu', 'PT Sans', 'Merriweather', 'Playfair Display'
  ],
  cjk: [
    'Noto Sans CJK SC', 'Noto Sans CJK TC', 'Noto Sans CJK JP', 'Noto Sans CJK KR',
    'Source Han Sans', 'Source Han Serif'
  ]
};

const SYSTEM_FONTS = ['Arial', 'Times New Roman', 'Courier New', 'Helvetica', 'Georgia', 'Verdana'];

export default function FontPicker({ selectedText, onUpdateText }) {
  const [font, setFont] = useState(selectedText?.fontFamily || 'Inter');
  const [isBold, setIsBold] = useState(selectedText?.isBold || false);
  const [isItalic, setIsItalic] = useState(selectedText?.isItalic || false);
  const [fontLoadError, setFontLoadError] = useState(false);

  const isCJK = GOOGLE_FONTS.cjk.includes(font);
  const allFonts = [...GOOGLE_FONTS.english, ...GOOGLE_FONTS.cjk];

  useEffect(() => {
    if (!selectedText) return;
    
    setFont(selectedText.fontFamily);
    setIsBold(selectedText.isBold);
    setIsItalic(selectedText.isItalic);
  }, [selectedText]);

  useEffect(() => {
    const loadGoogleFont = async () => {
      try {
        setFontLoadError(false);
        
        // Check if font is already loaded
        const existingLink = document.querySelector(`link[href*="${font.replace(/ /g, '+')}"]`);
        if (existingLink) return;

        const link = document.createElement('link');
        const fontWeight = isBold && !isCJK ? '400;700' : '400';
        const fontStyle = isItalic && !isCJK ? 'ital,wght@0,400;1,400' : `wght@${fontWeight}`;
        
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:${fontStyle}&display=swap`;
        link.rel = 'stylesheet';
        
        // Add error handling
        link.onerror = () => {
          setFontLoadError(true);
          console.warn(`Failed to load Google Font: ${font}. Falling back to system font.`);
        };
        
        document.head.appendChild(link);
        
        // Test if font actually loaded
        setTimeout(() => {
          const testElement = document.createElement('div');
          testElement.style.fontFamily = font;
          testElement.style.fontSize = '12px';
          testElement.textContent = 'Test';
          testElement.style.position = 'absolute';
          testElement.style.visibility = 'hidden';
          document.body.appendChild(testElement);
          
          const computedStyle = window.getComputedStyle(testElement);
          if (computedStyle.fontFamily.indexOf(font) === -1) {
            setFontLoadError(true);
          }
          
          document.body.removeChild(testElement);
        }, 1000);
        
      } catch (error) {
        console.error('Error loading Google Font:', error);
        setFontLoadError(true);
      }
    };

    if (allFonts.includes(font)) {
      loadGoogleFont();
    }
  }, [font, isBold, isItalic, isCJK, allFonts]);

  const handleFontChange = (newFont) => {
    setFont(newFont);
    if (selectedText) {
      onUpdateText(selectedText.id, { fontFamily: newFont });
    }
  };

  const handleBoldChange = (newBold) => {
    if (isCJK) return; // Prevent bold for CJK fonts
    setIsBold(newBold);
    if (selectedText) {
      onUpdateText(selectedText.id, { isBold: newBold });
    }
  };

  const handleItalicChange = (newItalic) => {
    if (isCJK) return; // Prevent italic for CJK fonts
    setIsItalic(newItalic);
    if (selectedText) {
      onUpdateText(selectedText.id, { isItalic: newItalic });
    }
  };

  const getEffectiveFont = () => {
    if (fontLoadError) {
      return SYSTEM_FONTS[0]; // Fallback to Arial
    }
    return font;
  };

  if (!selectedText) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-center">Select a text element to edit font properties</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      <h3 className="font-semibold text-lg">Font Properties</h3>
      
      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Font Family
          {fontLoadError && (
            <span className="text-red-500 text-xs ml-2">(Using fallback font)</span>
          )}
        </label>
        <select
          value={font}
          onChange={(e) => handleFontChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <optgroup label="English Fonts">
            {GOOGLE_FONTS.english.map(fontName => (
              <option key={fontName} value={fontName}>{fontName}</option>
            ))}
          </optgroup>
          <optgroup label="CJK Fonts">
            {GOOGLE_FONTS.cjk.map(fontName => (
              <option key={fontName} value={fontName}>{fontName}</option>
            ))}
          </optgroup>
          <optgroup label="System Fonts (Fallback)">
            {SYSTEM_FONTS.map(fontName => (
              <option key={fontName} value={fontName}>{fontName}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Bold/Italic Controls */}
      <div className="flex space-x-4">
        <div className="relative">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isBold}
              onChange={(e) => handleBoldChange(e.target.checked)}
              disabled={isCJK}
              className="mr-2"
            />
            Bold
          </label>
          {isCJK && (
            <div className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              Not available for CJK fonts
            </div>
          )}
        </div>
        
        <div className="relative">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isItalic}
              onChange={(e) => handleItalicChange(e.target.checked)}
              disabled={isCJK}
              className="mr-2"
            />
            Italic
          </label>
          {isCJK && (
            <div className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              Not available for CJK fonts
            </div>
          )}
        </div>
      </div>

      {/* Font Preview */}
      <div className="border rounded p-3 bg-white">
        <label className="block text-sm font-medium mb-2">Preview</label>
        <div
          style={{
            fontFamily: `${getEffectiveFont()}, ${SYSTEM_FONTS.join(', ')}`,
            fontSize: '18px',
            fontWeight: isBold && !isCJK ? 'bold' : 'normal',
            fontStyle: isItalic && !isCJK ? 'italic' : 'normal',
          }}
        >
          Sample Text 你好 안녕 こんにちは
        </div>
      </div>
    </div>
  );
} 