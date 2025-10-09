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
import { apiService } from '../services/api';
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
  jobStatus?: 'queued' | 'processing' | 'succeeded' | 'failed' | null;
}

export function PreviewCanvas({ model, outfit, isLoading = false, jobStatus = null }: PreviewCanvasProps) {
  const [lighting, setLighting] = useState([50]);
  const [fit, setFit] = useState([50]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'queued' | 'processing' | 'succeeded' | 'failed' | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  // Use the generated image from the outfit prop (if available) instead of local state
  // Check if the outfit image is a Cloudinary URL and not the original outfit image
  const generatedImage = outfit?.image?.includes('cloudinary.com') &&
                        outfit.image !== outfit.id &&
                        !outfit.image.includes('unsplash.com') ? outfit.image : null;

  const suggestions = [
    "Try pairing this with warmer accessories",
    "This style works great for evening events",
    "Consider a different color for your skin tone"
  ];

  const handleGenerateImage = async () => {
    if (!model || !outfit) return;
    
    setIsGenerating(true);
    setGenerationStatus('queued');
    
    try {
      // Call the actual AI generation API
      const job = await apiService.createGenerationJob(model.id, outfit.id);
      
      setCurrentJobId(job.jobId);
      setGenerationStatus(job.status);
      
      // Poll for job status
      const pollJobStatus = async () => {
        try {
          const status = await apiService.getJobStatus(job.jobId);
          setGenerationStatus(status.status);
          
          if (status.status === 'succeeded' && status.outputImage) {
            // Note: The generated image will be available via the outfit prop
            // when the parent component updates it
            setIsGenerating(false);
          } else if (status.status === 'failed') {
            console.error('Generation failed:', status.error);
            setIsGenerating(false);
          } else if (status.status === 'processing' || status.status === 'queued') {
            // Continue polling
            setTimeout(pollJobStatus, 2000);
          }
        } catch (error) {
          console.error('Error polling job status:', error);
          setIsGenerating(false);
        }
      };
      
      // Start polling
      setTimeout(pollJobStatus, 2000);
      
    } catch (error) {
      console.error('Error creating generation job:', error);
      // Fallback to simulation if API fails
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStatus('succeeded');
      }, 2000);
    }
  };

  const handleReset = () => {
    // Reset is handled by the parent component
    setGenerationStatus(null);
    setCurrentJobId(null);
    // Note: The actual reset of the generated image is handled by the parent component
    // when it clears the selected outfit
  };

  const handleSave = () => {
    if (generatedImage) {
      // Create a temporary link to download the image
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `ai-generated-outfit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No generated image to save');
    }
  };

  const handleShare = () => {
    if (generatedImage) {
      // Copy image URL to clipboard
      navigator.clipboard.writeText(generatedImage).then(() => {
        alert('Image URL copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy URL to clipboard');
      });
    } else {
      alert('No generated image to share');
    }
  };

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
        {(isLoading || isGenerating) && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500"></div>
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-pink-500" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">
                  {generationStatus === 'queued' ? 'Job Queued' :
                   generationStatus === 'processing' ? 'AI Processing' :
                   isGenerating ? 'AI Magic in Progress' :
                   jobStatus === 'queued' ? 'Job Queued' :
                   jobStatus === 'processing' ? 'AI Processing' :
                   'AI Magic in Progress'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {generationStatus === 'queued' ? 'Your job is in the queue...' :
                   generationStatus === 'processing' ? 'Generating your outfit...' :
                   isGenerating ? 'Fitting the perfect outfit...' :
                   jobStatus === 'queued' ? 'Your job is in the queue...' :
                   jobStatus === 'processing' ? 'Generating your outfit...' :
                   'Fitting the perfect outfit...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Model Image or Generated Image */}
        <div className="relative w-full h-full">
          {generatedImage ? (
            <ImageWithFallback
              src={generatedImage}
              alt={`AI Generated - ${model.name} wearing ${outfit?.name || 'outfit'}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <ImageWithFallback
                src={model.image}
                alt={model.name}
                className="w-full h-full object-cover"
              />
              
              {/* Outfit Overlay Effect */}
              {outfit && (
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent mix-blend-overlay" />
              )}
            </>
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
                    {generatedImage ? 'AI Generated' : `Wearing: ${outfit.name}`}
                  </p>
                )}
              </div>
              {outfit && (
                <Badge className={`${
                  generatedImage
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-pink-100 text-pink-700 border-pink-200'
                }`}>
                  {generatedImage ? 'AI Generated' : outfit.style}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>


      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {generatedImage ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600"
              onClick={handleSave}
            >
              <Download className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleGenerateImage}
              disabled={isGenerating}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              {isGenerating ? 'Generating...' : 'Regenerate'}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" className="text-gray-600">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600"
              onClick={handleSave}
            >
              <Download className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={handleGenerateImage}
              disabled={!outfit || isGenerating}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}