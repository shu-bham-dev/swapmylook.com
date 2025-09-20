import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { 
  RotateCcw, 
  Download, 
  Share2, 
  Sun, 
  Palette, 
  Maximize2,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Outfit } from './OutfitLibrary';

interface Model {
  id: string;
  name: string;
  image: string;
  category: 'female' | 'male' | 'diverse';
}

interface PreviewCanvasProps {
  model: Model | null;
  outfit: Outfit | null;
  isLoading?: boolean;
}

export function PreviewCanvas({ model, outfit, isLoading = false }: PreviewCanvasProps) {
  const [lighting, setLighting] = useState([50]);
  const [fit, setFit] = useState([50]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    "Try pairing this with warmer accessories",
    "This style works great for evening events",
    "Consider a different color for your skin tone"
  ];

  if (!model) {
    return (
      <Card className="aspect-[3/4] flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-dashed border-pink-200">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-pink-100 rounded-full flex items-center justify-center">
            <Maximize2 className="w-8 h-8 text-pink-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">No Model Selected</h3>
            <p className="text-sm text-muted-foreground">
              Choose a model to start trying on outfits
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Preview Card */}
      <Card className={`relative overflow-hidden transition-all duration-500 ${
        isFullscreen ? 'fixed inset-4 z-50' : 'aspect-[3/4]'
      }`}>
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500"></div>
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-pink-500" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">AI Magic in Progress</p>
                <p className="text-sm text-muted-foreground">Fitting the perfect outfit...</p>
              </div>
            </div>
          </div>
        )}

        {/* Model Image */}
        <div className="relative w-full h-full">
          <ImageWithFallback
            src={model.image}
            alt={model.name}
            className="w-full h-full object-cover"
          />
          
          {/* Outfit Overlay Effect */}
          {outfit && (
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent mix-blend-overlay" />
          )}
        </div>

        {/* Fullscreen Toggle */}
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>

        {/* Model Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{model.name}</h3>
                {outfit && (
                  <p className="text-sm text-muted-foreground">
                    Wearing: {outfit.name}
                  </p>
                )}
              </div>
              {outfit && (
                <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                  {outfit.style}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>


      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" className="text-gray-600">
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
        <Button variant="outline" size="sm" className="text-gray-600">
          <Download className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button variant="outline" size="sm" className="text-gray-600">
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      </div>
    </div>
  );
}