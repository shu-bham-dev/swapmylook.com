import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Filter, Heart, Star, Upload, Plus, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Outfit {
  id: string;
  name: string;
  image: string;
  category: 'casual' | 'formal' | 'summer' | 'winter' | 'party' | 'business';
  tags: string[];
  style: string;
  season: string;
  color: string;
  rating: number;
  liked: boolean;
  isCustom?: boolean;
}

interface OutfitLibraryProps {
  onOutfitSelect: (outfit: Outfit) => void;
  selectedOutfit: Outfit | null;
}

const outfits: Outfit[] = [
  {
    id: '1',
    name: 'Summer Breeze',
    image: 'https://images.unsplash.com/photo-1586024452802-86e0d084a4f9?w=400&h=500&fit=crop',
    category: 'casual',
    tags: ['flowy', 'light', 'comfortable'],
    style: 'Bohemian',
    season: 'Summer',
    color: 'Light Blue',
    rating: 4.8,
    liked: false
  },
  {
    id: '2',
    name: 'Evening Elegance',
    image: 'https://images.unsplash.com/photo-1678274342617-09c13eefab9f?w=400&h=500&fit=crop',
    category: 'formal',
    tags: ['elegant', 'sophisticated', 'glamorous'],
    style: 'Classic',
    season: 'All Season',
    color: 'Black',
    rating: 4.9,
    liked: true
  },
  {
    id: '3',
    name: 'Urban Explorer',
    image: 'https://images.unsplash.com/photo-1740381918234-d364ff4c5cb4?w=400&h=500&fit=crop',
    category: 'casual',
    tags: ['urban', 'trendy', 'versatile'],
    style: 'Street',
    season: 'Spring',
    color: 'Navy',
    rating: 4.7,
    liked: false
  },
  {
    id: '5',
    name: 'Weekend Vibes',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
    category: 'casual',
    tags: ['relaxed', 'cozy', 'weekend'],
    style: 'Casual',
    season: 'Fall',
    color: 'Beige',
    rating: 4.5,
    liked: true
  },
  {
    id: '6',
    name: 'Party Ready',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop',
    category: 'party',
    tags: ['sparkly', 'fun', 'celebration'],
    style: 'Glamorous',
    season: 'All Season',
    color: 'Gold',
    rating: 4.8,
    liked: false
  }
];

export function OutfitLibrary({ onOutfitSelect, selectedOutfit }: OutfitLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedOutfits, setLikedOutfits] = useState<Set<string>>(new Set(['2', '5']));
  const [customOutfits, setCustomOutfits] = useState<Outfit[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allOutfits = [...outfits, ...customOutfits];

  const categories = [
    { id: 'all', name: 'All', count: allOutfits.length },
    { id: 'casual', name: 'Casual', count: allOutfits.filter(o => o.category === 'casual').length },
    { id: 'formal', name: 'Formal', count: allOutfits.filter(o => o.category === 'formal').length },
    { id: 'business', name: 'Business', count: allOutfits.filter(o => o.category === 'business').length },
    { id: 'party', name: 'Party', count: allOutfits.filter(o => o.category === 'party').length }
  ];

  const filteredOutfits = allOutfits.filter(outfit => {
    const matchesSearch = outfit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         outfit.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || outfit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleLike = (outfitId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedOutfits(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(outfitId)) {
        newLiked.delete(outfitId);
      } else {
        newLiked.add(outfitId);
      }
      return newLiked;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate upload process
      setTimeout(() => {
        const imageUrl = URL.createObjectURL(file);
        
        const newOutfit: Outfit = {
          id: `custom-${Date.now()}`,
          name: `Custom Outfit ${customOutfits.length + 1}`,
          image: imageUrl,
          category: 'casual',
          tags: ['custom', 'uploaded'],
          style: 'Custom',
          season: 'All Season',
          color: 'Various',
          rating: 5.0,
          liked: false,
          isCustom: true
        };

        setCustomOutfits(prev => [...prev, newOutfit]);
        setIsUploading(false);
        
        // Clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1500);
    }
  };

  const removeCustomOutfit = (outfitId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomOutfits(prev => prev.filter(outfit => outfit.id !== outfitId));
    // Also remove from liked if it was liked
    setLikedOutfits(prev => {
      const newLiked = new Set(prev);
      newLiked.delete(outfitId);
      return newLiked;
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <div className="flex-shrink-0 space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Outfit Library</h2>
        </div>

        {/* Upload Section */}
        <Card className="border-2 border-dashed border-pink-200 hover:border-pink-300 transition-colors p-4 text-center bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              {isUploading ? (
                <div className="animate-spin w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full" />
              ) : (
                <Upload className="w-5 h-5 text-pink-500" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900">Upload Custom Outfit</h3>
              <p className="text-xs text-muted-foreground">
                {isUploading ? 'Processing your outfit...' : 'JPG, PNG up to 10MB'}
              </p>
            </div>
            <label htmlFor="outfit-upload" className="cursor-pointer">
              <Button 
                size="sm"
                className="bg-pink-500 hover:bg-pink-600 text-white"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
              <input
                ref={fileInputRef}
                id="outfit-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search outfits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-pink-100 focus:border-pink-300"
          />
        </div>

        {/* Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5 bg-pink-50 text-pink-600">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium">{category.name}</span>
                  <span className="text-[10px] opacity-70">{category.count}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Outfit Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2 pb-4">
          {filteredOutfits.map((outfit) => (
            <Card
              key={outfit.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden group relative ${
                selectedOutfit?.id === outfit.id
                  ? 'ring-2 ring-pink-400 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => onOutfitSelect(outfit)}
            >
              <div className="aspect-[3/4] relative">
                <ImageWithFallback
                  src={outfit.image}
                  alt={outfit.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Custom outfit indicator */}
                {outfit.isCustom && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-pink-500 text-white text-xs">
                      Custom
                    </Badge>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => toggleLike(outfit.id, e)}
                    className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        likedOutfits.has(outfit.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                  
                  {outfit.isCustom && (
                    <button
                      onClick={(e) => removeCustomOutfit(outfit.id, e)}
                      className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white text-sm">{outfit.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs">{outfit.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {outfit.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-white/20 text-white border-white/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Basic Info Always Visible */}
              <div className="p-2">
                <h3 className="font-medium text-sm truncate">{outfit.name}</h3>
                <p className="text-xs text-muted-foreground">{outfit.style}</p>
              </div>
            </Card>
          ))}
        </div>

        {filteredOutfits.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No outfits found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}