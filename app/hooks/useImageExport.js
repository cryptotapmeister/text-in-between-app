'use client';

import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { 
  drawTextWithEffects, 
  clearCanvas, 
  drawBackgroundImage, 
  downloadImageFromCanvas,
  isCanvasSupported 
} from '@/app/utils/canvas';

export function useImageExport(canvasRef, textElements, canvasSize, backgroundImage) {
  
  const clearCanvasOnLogout = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      clearCanvas(ctx, canvas.width, canvas.height);
    }
  }, [canvasRef]);

  // Listen for auth state changes and clear canvas on logout
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        clearCanvasOnLogout();
      }
    });

    return () => subscription.unsubscribe();
  }, [clearCanvasOnLogout]);

  const renderCanvas = useCallback(async () => {
    if (!canvasRef.current || !isCanvasSupported()) {
      throw new Error('Canvas not supported or not available');
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    try {
      // Set canvas dimensions
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      // Clear canvas first
      clearCanvas(ctx, canvas.width, canvas.height, '#ffffff');

      // Draw background image if exists
      if (backgroundImage) {
        await drawBackgroundImage(ctx, backgroundImage, canvas.width, canvas.height);
      }

      // Draw all text elements
      textElements.forEach(element => {
        drawTextWithEffects(ctx, element.text, element.position.x, element.position.y + element.fontSize, {
          font: element.fontFamily,
          fontSize: element.fontSize,
          isBold: element.isBold,
          isItalic: element.isItalic,
          color: element.color,
          glowColor: element.color,
          glowIntensity: element.glowIntensity
        });
      });

      return canvas;
    } catch (error) {
      console.error('Error rendering canvas:', error);
      throw error;
    }
  }, [canvasRef, textElements, canvasSize, backgroundImage]);

  const handleDownload = useCallback(async (format = 'png') => {
    try {
      if (!isCanvasSupported()) {
        alert('Canvas is not supported in your browser');
        return false;
      }

      // Render the canvas with all elements
      const canvas = await renderCanvas();
      
      // Download the image
      const success = downloadImageFromCanvas(canvas, 'text-in-between', format);
      
      if (!success) {
        alert('Failed to download image. Please try again.');
      }
      
      return success;
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error occurred while downloading image. Please try again.');
      return false;
    }
  }, [renderCanvas]);

  const getCanvasBlob = useCallback(async (format = 'png', quality = 0.95) => {
    try {
      const canvas = await renderCanvas();
      
      return new Promise((resolve, reject) => {
        const mimeType = format === 'jpeg' ? 'image/jpeg' : 
                         format === 'webp' ? 'image/webp' : 'image/png';
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, mimeType, quality);
      });
    } catch (error) {
      console.error('Error creating canvas blob:', error);
      throw error;
    }
  }, [renderCanvas]);

  const getCanvasDataURL = useCallback(async (format = 'png', quality = 0.95) => {
    try {
      const canvas = await renderCanvas();
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 
                       format === 'webp' ? 'image/webp' : 'image/png';
      
      if (format === 'jpeg') {
        return canvas.toDataURL(mimeType, quality);
      } else if (format === 'webp') {
        return canvas.toDataURL(mimeType, quality);
      } else {
        return canvas.toDataURL('image/png');
      }
    } catch (error) {
      console.error('Error creating canvas data URL:', error);
      throw error;
    }
  }, [renderCanvas]);

  // Clean up canvas when component unmounts
  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        clearCanvas(ctx, canvas.width, canvas.height);
      }
    };
  }, [canvasRef]);

  return {
    handleDownload,
    renderCanvas,
    getCanvasBlob,
    getCanvasDataURL,
    clearCanvasOnLogout,
    isCanvasSupported: isCanvasSupported()
  };
} 