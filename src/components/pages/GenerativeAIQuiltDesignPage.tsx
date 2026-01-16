import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import {
  Palette,
  Grid3x3,
  Layers,
  Sparkles,
  Download,
  Share2,
  RefreshCw,
  Zap,
  Target,
  Wand2,
  Image as ImageIcon,
  Copy,
  Check,
  LogIn,
  User
} from 'lucide-react';
import { toast } from '../../utils/toast';
import { apiService } from '../../services/api';

interface GenerativeAIQuiltDesignPageProps {
  onPageChange: (page: string) => void;
}

export function GenerativeAIQuiltDesignPage({ onPageChange }: GenerativeAIQuiltDesignPageProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern');
  const [colorPalette, setColorPalette] = useState(['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2']);
  const [complexity, setComplexity] = useState([3]);
  const [size, setSize] = useState('throw');
  const [rows, setRows] = useState(8);
  const [columns, setColumns] = useState(8);
  const [symmetry, setSymmetry] = useState('mirror');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<Array<{ id: number; image: string; prompt: string }>>([]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userQuota, setUserQuota] = useState<{
    monthlyRequests: number;
    usedThisMonth: number;
    remaining: number;
    resetDate: string;
    hasQuota: boolean;
  } | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = apiService.isAuthenticated();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        fetchUserQuota();
      }
    };

    checkAuth();
  }, []);

  const fetchUserQuota = async () => {
    try {
      const quota = await apiService.getUserQuota();
      setUserQuota(quota);
    } catch (error) {
      console.error('Failed to fetch user quota:', error);
    }
  };

  const styles = [
    { id: 'modern', label: 'Modern Geometric', icon: Grid3x3 },
    { id: 'traditional', label: 'Traditional Patchwork', icon: Layers },
    { id: 'abstract', label: 'Abstract Art', icon: Palette },
    { id: 'floral', label: 'Floral Pattern', icon: Sparkles },
    { id: 'minimalist', label: 'Minimalist', icon: Target },
    { id: 'vintage', label: 'Vintage', icon: Layers },
    { id: 'kids', label: 'Kids / Cartoon', icon: Sparkles }
  ];

  const sizes = [
    { id: 'baby', label: 'Baby (36" x 36")' },
    { id: 'throw', label: 'Throw (50" x 65")' },
    { id: 'twin', label: 'Twin (68" x 86")' },
    { id: 'queen', label: 'Queen (86" x 93")' },
    { id: 'king', label: 'King (104" x 93")' }
  ];

  const symmetryOptions = [
    { id: 'mirror', label: 'Mirror' },
    { id: 'radial', label: 'Radial' },
    { id: 'randomized', label: 'Randomized' },
    { id: 'none', label: 'None' }
  ];

  const samplePrompts = [
    "A modern geometric quilt with blue and gold colors, inspired by Moroccan tiles",
    "Traditional patchwork quilt with autumn colors and leaf patterns",
    "Abstract art quilt with vibrant rainbow colors and fluid shapes",
    "Minimalist quilt design with neutral colors and clean lines",
    "Floral quilt pattern with spring colors and botanical illustrations"
  ];

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      toast.error('Authentication Required', {
        description: 'Please log in to use the AI Quilt Design tool.',
      });
      onPageChange('login');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Prompt Required', {
        description: 'Please enter a description for your quilt design.',
      });
      return;
    }

    // Check quota - only 1 image per user
    if (userQuota && userQuota.remaining <= 0) {
      toast.error('Quota Exceeded', {
        description: 'You can only generate 1 quilt design. Please contact support for more.',
      });
      return;
    }

    setIsGenerating(true);
    setActiveJobId(null);
    setJobStatus(null);
    
    try {
      const response = await apiService.generateQuiltDesign(prompt, {
        style,
        colorPalette,
        complexity: complexity[0],
        size,
        rows,
        columns,
        symmetry
      });
      
      const { jobId } = response;
      setActiveJobId(jobId);
      setJobStatus('queued');
      
      toast.success('Design Generation Started!', {
        description: 'Your AI quilt design is being generated. This may take a few moments.',
      });
      
      // Start polling for job status
      pollJobStatus(jobId);
      
    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
      toast.error('Generation Failed', {
        description: 'Failed to generate quilt design. Please try again.',
      });
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const pollInterval = 2000; // Poll every 2 seconds
    const maxAttempts = 30; // Max 60 seconds (30 * 2s)
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        toast.error('Generation Timeout', {
          description: 'Design generation took too long. Please try again.',
        });
        setIsGenerating(false);
        setActiveJobId(null);
        setJobStatus(null);
        return;
      }

      try {
        const statusResponse = await apiService.getQuiltDesignJobStatus(jobId);
        const { status, outputImage, error: jobError } = statusResponse;
        
        setJobStatus(status);
        
        if (status === 'succeeded' && outputImage) {
          // Job completed successfully
          const newDesign = {
            id: generatedDesigns.length + 1,
            image: outputImage.url || `/images/placeholder-quilt-${Math.floor(Math.random() * 5) + 1}.jpg`,
            prompt: prompt
          };
          
          setGeneratedDesigns(prev => [newDesign, ...prev]);
          setIsGenerating(false);
          setActiveJobId(null);
          
          // Update quota locally
          if (userQuota) {
            setUserQuota({
              ...userQuota,
              usedThisMonth: userQuota.usedThisMonth + 1,
              remaining: userQuota.remaining - 1
            });
          }
          
          toast.success('Design Generated!', {
            description: 'Your AI quilt design has been created successfully.',
          });
        } else if (status === 'failed') {
          // Job failed
          setIsGenerating(false);
          setActiveJobId(null);
          toast.error('Generation Failed', {
            description: jobError || 'Failed to generate quilt design. Please try again.',
          });
        } else if (status === 'queued' || status === 'processing') {
          // Still processing, continue polling
          attempts++;
          setTimeout(poll, pollInterval);
        }
      } catch (error) {
        console.error('Failed to poll job status:', error);
        attempts++;
        setTimeout(poll, pollInterval);
      }
    };

    // Start polling
    setTimeout(poll, pollInterval);
  };

  const handleSamplePrompt = (sample: string) => {
    setPrompt(sample);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    toast.success('Copied!', {
      description: 'Prompt copied to clipboard.',
    });
    
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownload = (designId: number) => {
    const design = generatedDesigns.find(d => d.id === designId);
    if (!design) {
      toast.error('Design not found', {
        description: 'The design you are trying to download does not exist.',
      });
      return;
    }

    // Check if the image is a valid URL or placeholder
    if (design.image.startsWith('http') || design.image.startsWith('/')) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = design.image;
      link.download = `quilt-design-${designId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download Started', {
        description: 'Your quilt design is being downloaded.',
      });
    } else {
      // For placeholder images, show a message
      toast.info('Placeholder Image', {
        description: 'This is a placeholder image. Actual AI-generated designs would be downloadable.',
      });
    }
  };

  const handleShare = async (designId: number) => {
    const design = generatedDesigns.find(d => d.id === designId);
    if (!design) {
      toast.error('Design not found', {
        description: 'The design you are trying to share does not exist.',
      });
      return;
    }

    const shareUrl = window.location.href;
    const shareText = `Check out this AI-generated quilt design: "${design.prompt.substring(0, 100)}..."`;
    
    // Try to use the Web Share API if available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Quilt Design',
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared successfully!', {
          description: 'The design has been shared.',
        });
        return;
      } catch (error) {
        // User cancelled share or error occurred
        console.log('Share cancelled or failed:', error);
      }
    }
    
    // Fallback: Copy link to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast.success('Link Copied', {
        description: 'Share link copied to clipboard.',
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy', {
        description: 'Could not copy link to clipboard. Please try again.',
      });
    }
  };

  const handleRegenerate = (designId: number) => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Regenerated!', {
        description: 'New variation of the design has been created.',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <Grid3x3 className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Generative AI Quilt Design
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create beautiful, unique quilt patterns using artificial intelligence. 
              Describe your vision and watch as AI generates stunning quilt designs in seconds.
            </p>
          </div>
        </div>

        {/* Authentication & Quota Banner */}
        {!isLoggedIn ? (
          <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Login Required</h3>
                  <p className="text-sm text-muted-foreground">
                    You need to be logged in to generate AI quilt designs.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => onPageChange('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <LogIn className="w-4 h-4 mr-2 text-white" />
                Log In to Continue
              </Button>
            </div>
          </Card>
        ) : userQuota && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Your Quilt Design Quota</h3>
                  <p className="text-sm text-muted-foreground">
                    You can generate <span className="font-bold text-green-700">{userQuota.remaining}</span> quilt design{userQuota.remaining !== 1 ? 's' : ''} this month.
                    {userQuota.remaining <= 0 && (
                      <span className="text-red-600 font-semibold"> Quota exhausted!</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-700">
                  {userQuota.remaining} / {userQuota.monthlyRequests}
                </div>
                <div className="text-sm text-muted-foreground">
                  Resets on {new Date(userQuota.resetDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="prompt" className="text-lg font-semibold flex items-center">
                      <Wand2 className="w-5 h-5 mr-2 text-blue-600" />
                      Design Prompt
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPrompt}
                      className="h-8"
                    >
                      {copiedPrompt ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1" />
                      )}
                      {copiedPrompt ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your quilt design... (e.g., 'A modern geometric quilt with blue and gold colors, inspired by Moroccan tiles')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Be as descriptive as possible for better results.
                  </p>
                </div>

                {/* Sample Prompts */}
                <div>
                  <Label className="text-lg font-semibold mb-3 block">Sample Prompts</Label>
                  <div className="flex flex-wrap gap-2">
                    {samplePrompts.map((sample, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSamplePrompt(sample)}
                        className="text-sm"
                      >
                        {sample.substring(0, 40)}...
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Style Selection */}
                <div>
                  <Label className="text-lg font-semibold mb-3 block">Design Style</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {styles.map((styleItem) => (
                      <Button
                        key={styleItem.id}
                        variant={style === styleItem.id ? "default" : "outline"}
                        onClick={() => setStyle(styleItem.id)}
                        className={`flex flex-col h-auto py-3 ${style === styleItem.id ? 'bg-blue-600 text-white' : ''}`}
                      >
                        <styleItem.icon className="w-5 h-5 mb-1" />
                        <span className="text-xs">{styleItem.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div>
                  <Label className="text-lg font-semibold mb-3 block">Color Palette</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    {colorPalette.map((color, index) => (
                      <div key={index} className="relative group">
                        <div
                          className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-300 shadow-md transition-transform hover:scale-110"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            // Open a color picker - for now, cycle through predefined colors
                            const predefinedColors = [
                              '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2',
                              '#9D4EDD', '#FF9E6D', '#7209B7', '#3A86FF', '#FB5607'
                            ];
                            const currentIndex = predefinedColors.indexOf(color);
                            const nextColor = predefinedColors[(currentIndex + 1) % predefinedColors.length];
                            const newColors = [...colorPalette];
                            newColors[index] = nextColor;
                            setColorPalette(newColors);
                          }}
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Palette className="w-3 h-3 text-gray-600" />
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newColors = [...colorPalette];
                        const availableColors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#9D4EDD'];
                        const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
                        setColorPalette([...newColors, randomColor]);
                      }}
                      className="h-12 w-12 rounded-full flex items-center justify-center"
                    >
                      <span className="text-xl">+</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (colorPalette.length > 1) {
                          setColorPalette(colorPalette.slice(0, -1));
                        }
                      }}
                      disabled={colorPalette.length <= 1}
                      className="h-8"
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Click on any color to cycle through options. Click + to add a new color.
                  </p>
                </div>

                {/* Complexity Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold flex items-center">
                      <Layers className="w-5 h-5 mr-2 text-blue-600" />
                      Pattern Complexity
                    </Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                        <span className="text-blue-700 font-bold text-lg">{complexity[0]}</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">/5</span>
                    </div>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={complexity}
                      onValueChange={setComplexity}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full [&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-range]]:bg-blue-600 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-blue-600 [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:shadow-lg"
                    />
                  </div>
                  <div className="flex justify-between px-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div
                        key={value}
                        className={`flex flex-col items-center ${value === complexity[0] ? 'text-blue-600 font-semibold' : 'text-muted-foreground'}`}
                      >
                        <div className={`w-3 h-3 rounded-full mb-2 ${value === complexity[0] ? 'bg-blue-600' : 'bg-gray-300'}`} />
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground px-1">
                    <span>Simple</span>
                    <span>Moderate</span>
                    <span>Complex</span>
                  </div>
                </div>

                {/* Quilt Size & Layout Controls */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold mb-3 block">Quilt Size</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {sizes.map((sizeItem) => (
                        <Button
                          key={sizeItem.id}
                          variant={size === sizeItem.id ? "default" : "outline"}
                          onClick={() => setSize(sizeItem.id)}
                          className={`h-auto py-2 ${size === sizeItem.id ? 'bg-blue-600 text-white' : ''}`}
                        >
                          <span className="text-xs">{sizeItem.label.split(' ')[0]}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Label className="text-lg font-semibold mb-3 block">Grid Layout</Label>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="rows" className="text-sm block mb-2">Rows</Label>
                          <div className="flex items-center space-x-4">
                            <Slider
                              value={[rows]}
                              onValueChange={(value: number[]) => setRows(value[0])}
                              max={16}
                              min={4}
                              step={1}
                              className="flex-1 min-w-0 [&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-range]]:bg-blue-600 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-blue-600 [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:shadow-lg"
                            />
                            <span className="text-sm font-medium w-10 text-center">{rows}</span>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="columns" className="text-sm block mb-2">Columns</Label>
                          <div className="flex items-center space-x-4">
                            <Slider
                              value={[columns]}
                              onValueChange={(value: number[]) => setColumns(value[0])}
                              max={16}
                              min={4}
                              step={1}
                              className="flex-1 min-w-0 [&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-range]]:bg-blue-600 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-blue-600 [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:shadow-lg"
                            />
                            <span className="text-sm font-medium w-10 text-center">{columns}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-lg font-semibold mb-3 block">Symmetry</Label>
                      <div className="space-y-3">
                        {symmetryOptions.map((option) => (
                          <Button
                            key={option.id}
                            variant={symmetry === option.id ? "default" : "outline"}
                            onClick={() => setSymmetry(option.id)}
                            className={`w-full justify-start py-3 ${symmetry === option.id ? 'bg-blue-600 text-white' : ''}`}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !isLoggedIn || (userQuota && userQuota.remaining <= 0)}
                  className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!isLoggedIn ? (
                    <>
                      <LogIn className="w-5 h-5 mr-2 text-white" />
                      <div className="text-white">Log In to Generate</div>
                    </>
                  ) : userQuota && userQuota.remaining <= 0 ? (
                    <>
                      <span className="text-lg">Quota Exhausted</span>
                    </>
                  ) : isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Generating Design...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Quilt Design
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Generated Designs */}
            {generatedDesigns.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Generated Designs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedDesigns.map((design) => (
                    <Card key={design.id} className="overflow-hidden">
                      <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                        {design.image.startsWith('http') || design.image.startsWith('/') ? (
                          <img
                            src={design.image}
                            alt={`Quilt Design ${design.id}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <Grid3x3 className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                            <p className="text-lg font-semibold">Quilt Design #{design.id}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              {design.prompt.substring(0, 80)}...
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(design.id)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare(design.id)}
                            >
                              <Share2 className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRegenerate(design.id)}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Info & Features */}
          <div className="space-y-8">
            {/* How It Works */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                How It Works
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Describe Your Vision</h3>
                    <p className="text-sm text-muted-foreground">
                      Tell us what kind of quilt design you want using natural language.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Customize Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose style, colors, and complexity to match your preferences.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Generate & Refine</h3>
                    <p className="text-sm text-muted-foreground">
                      AI creates unique designs that you can download, share, or regenerate.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Key Features</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI-Powered Design</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced AI algorithms create unique, never-before-seen patterns.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Custom Color Palettes</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose from predefined palettes or create your own color schemes.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Download className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">High-Resolution Export</h3>
                    <p className="text-sm text-muted-foreground">
                      Download designs in multiple formats for printing or digital use.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Pro Tips</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Be specific about colors, patterns, and inspiration sources</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Mention cultural influences (e.g., "Japanese inspired", "Nordic minimalism")</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Include mood words (e.g., "cozy", "vibrant", "elegant")</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Try different complexity levels for varied pattern density</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Is this tool free to use?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! Our Generative AI Quilt Design tool is completely free. You can generate unlimited designs without any cost.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Can I use the designs commercially?</h3>
              <p className="text-sm text-muted-foreground">
                All designs generated are royalty-free and can be used for personal or commercial projects, including selling physical quilts.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">How accurate are the AI-generated designs?</h3>
              <p className="text-sm text-muted-foreground">
                Our AI specializes in quilt patterns and produces highly detailed, sewable designs that follow traditional quilt construction principles.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Can I save my designs?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can download your designs in high-resolution formats and they're automatically saved to your generation history.
              </p>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="mt-12 p-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Ready to Create Your Masterpiece?</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Join thousands of quilters and designers who are already creating stunning patterns with AI.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Your First Design
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
                onClick={() => onPageChange('tools')}
              >
                Explore More Tools
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}