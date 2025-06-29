/**
 * Canvas utility functions for text rendering with effects
 */

export function drawTextWithEffects(ctx, text, x, y, options = {}) {
  const {
    font = 'Inter',
    fontSize = 24,
    isBold = false,
    isItalic = false,
    color = '#000000',
    glowColor = color,
    glowIntensity = 0,
    backgroundColor = null
  } = options;

  // Save current context state
  ctx.save();

  try {
    // Set font style
    const fontWeight = isBold ? 'bold' : 'normal';
    const fontStyle = isItalic ? 'italic' : 'normal';
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${font}`;
    
    // Set text color
    ctx.fillStyle = color;
    
    // Add glow effect if specified
    if (glowIntensity > 0) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = glowIntensity * 5;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
    
    // Draw background if specified
    if (backgroundColor) {
      const textMetrics = ctx.measureText(text);
      const textHeight = fontSize;
      
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(
        x - 4,
        y - textHeight + 4,
        textMetrics.width + 8,
        textHeight
      );
      
      // Reset fill style for text
      ctx.fillStyle = color;
    }
    
    // Draw the text
    ctx.fillText(text, x, y);
    
  } catch (error) {
    console.error('Error drawing text:', error);
    // Fallback: draw simple text without effects
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText(text, x, y);
  } finally {
    // Restore context state
    ctx.restore();
  }
}

export function clearCanvas(ctx, width, height, backgroundColor = '#ffffff') {
  try {
    ctx.clearRect(0, 0, width, height);
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }
  } catch (error) {
    console.error('Error clearing canvas:', error);
  }
}

export function drawBackgroundImage(ctx, imageSrc, width, height) {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Handle CORS
      
      img.onload = () => {
        try {
          // Clear canvas first
          ctx.clearRect(0, 0, width, height);
          
          // Draw image to fit canvas
          ctx.drawImage(img, 0, 0, width, height);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load background image: ${imageSrc}`));
      };
      
      img.src = imageSrc;
    } catch (error) {
      reject(error);
    }
  });
}

export function renderCanvasToImage(canvas, format = 'png', quality = 0.95) {
  try {
    const mimeType = `image/${format}`;
    
    if (format === 'jpeg' || format === 'jpg') {
      return canvas.toDataURL('image/jpeg', quality);
    } else if (format === 'webp') {
      return canvas.toDataURL('image/webp', quality);
    } else {
      return canvas.toDataURL('image/png');
    }
  } catch (error) {
    console.error('Error rendering canvas to image:', error);
    // Fallback to PNG
    return canvas.toDataURL('image/png');
  }
}

export function downloadImageFromCanvas(canvas, filename = 'text-in-between', format = 'png') {
  try {
    const dataURL = renderCanvasToImage(canvas, format);
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${filename}.${format}`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error downloading image:', error);
    return false;
  }
}

export function getCanvasImageData(canvas) {
  try {
    const ctx = canvas.getContext('2d');
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch (error) {
    console.error('Error getting canvas image data:', error);
    return null;
  }
}

export function isCanvasSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  } catch (error) {
    return false;
  }
}

export function getFontMetrics(ctx, text, font, fontSize) {
  try {
    ctx.save();
    ctx.font = `${fontSize}px ${font}`;
    const metrics = ctx.measureText(text);
    ctx.restore();
    
    return {
      width: metrics.width,
      height: fontSize, // Approximate height
      actualBoundingBoxLeft: metrics.actualBoundingBoxLeft || 0,
      actualBoundingBoxRight: metrics.actualBoundingBoxRight || metrics.width,
      actualBoundingBoxAscent: metrics.actualBoundingBoxAscent || fontSize * 0.8,
      actualBoundingBoxDescent: metrics.actualBoundingBoxDescent || fontSize * 0.2
    };
  } catch (error) {
    console.error('Error getting font metrics:', error);
    return {
      width: text.length * fontSize * 0.6, // Fallback estimate
      height: fontSize
    };
  }
} 