import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Copy, X, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Competitor {
  position: number;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
}

interface GeoPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  gpsCoordinates: string;
  competitors: Competitor[];
}

export const GeoPositionModal: React.FC<GeoPositionModalProps> = ({
  isOpen,
  onClose,
  gpsCoordinates,
  competitors
}) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return;
    
    const rect = modalRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep modal within viewport bounds
      const maxX = window.innerWidth - 400;
      const maxY = window.innerHeight - 500;
      
      setPosition({
        x: Math.max(0, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleCopyCoordinates = async () => {
    try {
      await navigator.clipboard.writeText(gpsCoordinates);
      toast({
        title: "Coordinates copied!",
        description: "GPS coordinates copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy coordinates to clipboard",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Card
        ref={modalRef}
        className="absolute w-96 max-h-[500px] pointer-events-auto shadow-xl border"
        style={{
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {/* Header - Draggable area */}
        <div
          className="p-4 border-b bg-white rounded-t-lg cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium text-gray-700 truncate">
                {gpsCoordinates}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCoordinates}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-0">
          <div className="p-4 pb-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Results</h3>
          </div>
          
          <ScrollArea className="h-80">
            <div className="px-4 pb-4">
              {competitors.map((competitor) => (
                <div
                  key={competitor.position}
                  className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0"
                >
                  {/* Position Number */}
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                    {competitor.position}
                  </div>
                  
                  {/* Business Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {competitor.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {competitor.address}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex">
                        {renderStars(competitor.rating)}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">
                        {competitor.rating} ({competitor.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
