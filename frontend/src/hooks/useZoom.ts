import { useState, useCallback } from 'react';

export const useZoom = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomIn = useCallback(() => {
    if (zoomLevel < 3) {
      setZoomLevel(prev => prev + 0.1);
    }
  }, [zoomLevel]);

  const handleZoomOut = useCallback(() => {
    if (zoomLevel > 1) {
      setZoomLevel(prev => prev - 0.1);
    }
  }, [zoomLevel]);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1);
  }, []);

  return {
    zoomLevel,
    isZoomed,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    setIsZoomed
  };
};
