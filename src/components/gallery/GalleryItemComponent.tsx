import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FileImage, FileVideo, File, Download, Eye, X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface GalleryItemProps {
  image: string;
  title: string;
  description: string;
  type: 'poem' | 'publication' | string;
  mediaType?: string;
  thumbnail?: string;
  onPreviewClick?: () => void;
}

const getMediaIcon = (mediaType?: string) => {
  switch (mediaType) {
    case 'document':
      return <FileText className="w-12 h-12 text-gray-400" />;
    case 'image':
      return <FileImage className="w-12 h-12 text-blue-400" />;
    case 'video':
      return <FileVideo className="w-12 h-12 text-red-400" />;
    default:
      return <File className="w-12 h-12 text-gray-400" />;
  }
};

const GalleryItemComponent = ({ 
  image, 
  title, 
  description, 
  type, 
  mediaType = 'image',
  thumbnail,
  onPreviewClick
}: GalleryItemProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const isDocument = mediaType === 'document';
  const hasThumbnail = isDocument ? !!thumbnail : true;

  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel(zoomLevel + 0.5);
      setIsZoomed(true);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel(zoomLevel - 0.5);
      if (zoomLevel <= 1.5) {
        setIsZoomed(false);
      }
    }
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
  };
  
  const getFullUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    
    // If it's already a full URL, return as is
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    
    // For relative paths, ensure they start with a slash
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    
    // Use environment variable for the base URL if available, otherwise default to localhost:8000
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    
    // For documents, ensure we're using the correct endpoint
    const isDocument = url.includes('gallery_media/') || url.includes('poem_media/');
    if (isDocument) {
      // Ensure the URL points to the media endpoint
      return `${baseUrl}/media${cleanUrl}`;
    }
    
    return `${baseUrl}${cleanUrl}`;
  };

  const downloadFile = async (url: string) => {
    try {
      const fullUrl = getFullUrl(url);
      if (!fullUrl) {
        console.error('No valid URL provided for download');
        return;
      }

      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = fullUrl;
      
      // Extract filename from URL or use a default
      let filename = url.split('/').pop() || 'document';
      
      // For documents, we'll add a proper extension
      if (isDocument) {
        const extension = url.split('.').pop();
        if (!filename.includes('.') && extension) {
          filename = `${filename}.${extension}`;
        }
      }
      
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      window.alert('Failed to download file. Please try again.');
    }
  };

  const previewFile = (url: string) => {
    try {
      const fullUrl = getFullUrl(url);
      if (!fullUrl) {
        console.error('No valid URL provided for preview');
        return;
      }

      // Handle different file types
      const extension = url.split('.').pop()?.toLowerCase();
      
      // PDF preview
      if (['pdf'].includes(extension || '')) {
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
      }
      // Office documents preview
      else if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension || '')) {
        const previewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
        window.open(previewUrl, '_blank', 'noopener,noreferrer');
      }
      // Image preview
      else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
      }
      // Video preview
      else if (['mp4', 'webm', 'ogg'].includes(extension || '')) {
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
      }
      // For other file types, show a message and download
      else {
        window.alert('Preview not available for this file type. Downloading instead.');
        downloadFile(url);
      }
    } catch (error) {
      console.error('Error previewing file:', error);
      window.alert('Failed to preview file. Please try again.');
    }
  };

  // Check if the image exists before trying to display it
  const [imageExists, setImageExists] = React.useState<boolean | null>(null);
  const [currentImage, setCurrentImage] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let isMounted = true;
    
    const checkImage = async (url: string) => {
      if (!url) {
        if (isMounted) {
          setImageExists(false);
          setIsLoading(false);
        }
        return;
      }
      
      const fullUrl = getFullUrl(url);
      
      try {
        const response = await fetch(fullUrl, { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        if (isMounted) {
          if (response.ok) {
            setImageExists(true);
            setCurrentImage(fullUrl);
          } else {
            setImageExists(false);
            console.warn(`Image not found: ${fullUrl}`);
          }
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error checking image:', error);
          setImageExists(false);
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    checkImage(image);
    
    return () => {
      isMounted = false;
    };
  }, [image]);

  const handlePreviewClick = () => {
    setIsPreviewOpen(true);
    if (onPreviewClick) {
      onPreviewClick();
    }
  };

  const renderThumbnail = () => {
    if (isDocument && !hasThumbnail) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center w-full h-full">
          {getMediaIcon(mediaType)}
          <span className="mt-2 text-sm text-gray-500">Document</span>
        </div>
      );
    }
    
    const imgSrc = isDocument && hasThumbnail ? getFullUrl(thumbnail) : currentImage;
    
    return (
      <img
        src={imgSrc}
        alt={title}
        className={`w-full h-full ${isDocument ? 'object-contain' : 'object-cover'} transition-transform duration-500`}
        loading="lazy"
        onError={(e) => {
          console.error('Error loading image:', imgSrc);
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM2YzcyN2YiPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
        }}
      />
    );
  };

  const renderDocumentPreview = () => (
    <div className="p-6">
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
          {getMediaIcon(mediaType)}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{description || 'Document preview'}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={() => downloadFile(image)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => previewFile(image)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>
    </div>
  );

  const renderImagePreview = () => (
    <div className="relative w-full h-full">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          title="Zoom In"
          disabled={zoomLevel >= 3}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          title="Zoom Out"
          disabled={zoomLevel <= 1}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>
      <div
        className={`relative w-full h-full ${isZoomed ? '' : 'max-h-[80vh] mx-auto'}`}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <img
          src={currentImage}
          alt={title}
          className="w-full h-full object-contain"
          loading="lazy"
          style={{
            maxWidth: '100%',
            height: 'auto',
            maxHeight: '100%'
          }}
          onError={(e) => {
            console.error('Error loading image:', currentImage);
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM2YzcyN2YiPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
          }}
        />
      </div>

    </div>
  );

  const renderPreviewContent = () => {
    return (
      <div className="flex flex-col h-full">
        {isDocument ? renderDocumentPreview() : renderImagePreview()}
      </div>
    );
  };

  return (
    <div className="relative">
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogTrigger asChild>
          <div onClick={handlePreviewClick} className="cursor-pointer">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
              <div className="aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                {renderThumbnail()}
              </div>
              <CardContent className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
                  <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                    {type === 'poem' ? 'Poem' : type === 'publication' ? 'Publication' : type}
                  </span>
                </div>
                {description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                    {description}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
          <div className="relative">
            {renderPreviewContent()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryItemComponent;