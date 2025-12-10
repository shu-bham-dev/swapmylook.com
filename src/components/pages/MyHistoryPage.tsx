
import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import {
  Heart,
  Download,
  Share2,
  Trash2,
  Star,
  Image as ImageIcon,
  User,
  Shirt,
  Sparkles,
  Filter,
  Grid,
  List,
  Repeat
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { apiService } from '../../services/api';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '../ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface Outfit {
  id: string;
  type: 'model' | 'outfit' | 'output';
  url: string;
  width?: number;
  height?: number;
  sizeBytes: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
  tags: string[];
  metadata: any;
}

interface OutfitsStats {
  total: number;
  byType: {
    model: number;
    outfit: number;
    output: number;
  };
  storageUsage: {
    totalBytes: number;
    totalFiles: number;
    byType: any;
  };
  favorites: number;
  generationAttempts: number;
}

interface MyHistoryPageProps {
  onPageChange: (page: string) => void;
}

export function MyHistoryPage({ onPageChange }: MyHistoryPageProps) {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [stats, setStats] = useState<OutfitsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState<Outfit | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; pages: number } | null>(null);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, favoritesOnly]);

  useEffect(() => {
    loadOutfits();
    loadStats();
  }, [activeTab, favoritesOnly, page, limit]);

  const loadOutfits = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOutfits({
        type: activeTab === 'all' ? 'all' : activeTab as 'model' | 'outfit' | 'output' | 'all',
        favorite: favoritesOnly || undefined,
        page,
        limit
      });
      setOutfits(response.outfits);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      console.error('Failed to load outfits:', err);
      setError('Failed to load your outfits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getOutfitsStats();
      setStats(response);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleFavoriteToggle = async (outfitId: string, currentFavorite: boolean) => {
    try {
      await apiService.toggleOutfitFavorite(outfitId, !currentFavorite);
      // Update local state
      setOutfits(prev => prev.map(outfit => 
        outfit.id === outfitId 
          ? { ...outfit, favorite: !currentFavorite }
          : outfit
      ));
      // Reload stats to update favorites count
      loadStats();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const performDeleteOutfit = async (outfitId: string) => {
    try {
      await apiService.deleteOutfit(outfitId);
      // Remove from local state
      setOutfits(prev => prev.filter(outfit => outfit.id !== outfitId));
      // Reload stats
      loadStats();
      // Clear outfitToDelete
      setOutfitToDelete(null);
    } catch (err) {
      console.error('Failed to delete outfit:', err);
      alert('Failed to delete image. Please try again.');
    }
  };

  const openDeleteDialog = (outfit: Outfit) => {
    setOutfitToDelete(outfit);
    setDeleteDialogOpen(true);
  };

  const handleImageClick = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setIsDialogOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'model':
        return <User className="w-4 h-4" />;
      case 'outfit':
        return <Shirt className="w-4 h-4" />;
      case 'output':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <ImageIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'model':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'outfit':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'output':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && outfits.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500"></div>
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-pink-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My History</h1>
          <p className="text-muted-foreground">
            Manage your uploaded models, outfits, and AI-generated images
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                </div>
                <div className="text-sm text-muted-foreground">Total Images</div>
              </div>
               
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{stats.byType.model}</div>
                </div>
                <div className="text-sm text-muted-foreground">Models</div>
              </div>
               
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Shirt className="w-5 h-5 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">{stats.byType.outfit}</div>
                </div>
                <div className="text-sm text-muted-foreground">Outfits</div>
              </div>
               
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">{stats.byType.output}</div>
                </div>
                <div className="text-sm text-muted-foreground">AI Generated</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Repeat className="w-5 h-5 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-600">{stats.generationAttempts}</div>
                </div>
                <div className="text-sm text-muted-foreground">Generation Attempts</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{stats.favorites}</div>
                <div className="text-sm text-muted-foreground">Favorites</div>
              </div>
              <Button
                variant={favoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setFavoritesOnly(!favoritesOnly)}
                className={favoritesOnly ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
              >
                <Star className={`w-4 h-4 mr-2 ${favoritesOnly ? 'fill-white' : ''}`} />
                {favoritesOnly ? 'Show All' : 'Show Favorites'}
              </Button>
            </div>
          </Card>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-pink-50">
              <TabsTrigger value="all" className="data-[state=active]:bg-pink-200">
                <ImageIcon className="w-4 h-4 mr-2" />
                All
              </TabsTrigger>
              <TabsTrigger value="model" className="data-[state=active]:bg-pink-200">
                <User className="w-4 h-4 mr-2" />
                Models
              </TabsTrigger>
              <TabsTrigger value="outfit" className="data-[state=active]:bg-pink-200">
                <Shirt className="w-4 h-4 mr-2" />
                Outfits
              </TabsTrigger>
              <TabsTrigger value="output" className="data-[state=active]:bg-pink-200">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generated
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2">
             <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="p-6 mb-6 bg-red-50 border-red-200">
            <div className="text-red-700 text-center">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={loadOutfits}
                className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
              >
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Outfits Grid/List */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500"></div>
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-pink-500" />
              </div>
            </div>
          )}
          {outfits.length === 0 ? (
            <Card className="p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No outfits found</h3>
              <p className="text-muted-foreground mb-4">
                {favoritesOnly
                  ? "You haven't marked any images as favorites yet."
                  : activeTab === 'all'
                  ? "You haven't uploaded any models, outfits, or generated any AI images yet."
                  : `You haven't uploaded any ${activeTab}s yet.`
                }
              </p>
              {activeTab === 'model' || activeTab === 'outfit' ? (
                <Button
                  onClick={() => onPageChange('home')}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Go to Style Studio
                </Button>
              ) : null}
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {outfits.map((outfit) => (
                <Card key={outfit.id} className="overflow-hidden group hover:shadow-lg transition-all">
                  <div className="aspect-[3/4] relative">
                    <div className="w-full h-full cursor-pointer" onClick={() => handleImageClick(outfit)}>
                      <ImageWithFallback
                        src={outfit.url}
                        alt={`${outfit.type} image`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(outfit.url, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleFavoriteToggle(outfit.id, outfit.favorite)}
                        >
                          <Heart className={`w-4 h-4 ${outfit.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openDeleteDialog(outfit)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <Badge
                      variant="outline"
                      className={`absolute top-2 left-2 ${getTypeColor(outfit.type)}`}
                    >
                      {getTypeIcon(outfit.type)}
                      <span className="ml-1 capitalize">{outfit.type}</span>
                    </Badge>

                    {/* Favorite Heart */}
                    {outfit.favorite && (
                      <Heart className="absolute top-2 right-2 w-5 h-5 text-red-500 fill-red-500" />
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium truncate">
                        {outfit.metadata?.originalName  || outfit.metadata?.filename || `Image ${outfit.id.slice(-6)}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(outfit.sizeBytes)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {formatDate(outfit.createdAt)}
                      </div>
                      {outfit.tags.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {outfit.tags[0]}
                          {outfit.tags.length > 1 && ` +${outfit.tags.length - 1}`}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {outfits.map((outfit) => (
                <Card key={outfit.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 flex-shrink-0">
                      <div className="w-full h-full cursor-pointer" onClick={() => handleImageClick(outfit)}>
                        <ImageWithFallback
                          src={outfit.url}
                          alt={`${outfit.type} image`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className={getTypeColor(outfit.type)}>
                          {getTypeIcon(outfit.type)}
                          <span className="ml-1 capitalize">{outfit.type}</span>
                        </Badge>
                        {outfit.favorite && (
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium truncate">
                          {outfit.metadata?.originalName || outfit.metadata?.filename || `Image ${outfit.id.slice(-6)}`}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(outfit.createdAt)}
                        </div>
                        {outfit.tags.length > 0 && (
                          <div className="flex space-x-1">
                            {outfit.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {outfit.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{outfit.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(outfit.url, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFavoriteToggle(outfit.id, outfit.favorite)}
                      >
                        <Heart className={`w-4 h-4 ${outfit.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDeleteDialog(outfit)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Items per page:</span>
              <Select value={limit.toString()} onValueChange={(value: string) => setLimit(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder={limit} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    size="default"
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      size="default"
                      isActive={page === p}
                      onClick={() => setPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    size="default"
                    onClick={() => setPage(prev => Math.min(prev + 1, pagination.pages))}
                    className={page === pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="text-sm text-muted-foreground">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} items
            </div>
          </div>
        )}

        {/* Image Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Image Details</DialogTitle>
              <DialogDescription>
                View and manage your image.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-[3/4]">
                {selectedOutfit && (
                  <ImageWithFallback
                    src={selectedOutfit.url}
                    alt={`${selectedOutfit.type} image`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Metadata</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>Type: {selectedOutfit?.type}</p>
                    <p>Size: {selectedOutfit && formatFileSize(selectedOutfit.sizeBytes)}</p>
                    <p>Uploaded: {selectedOutfit && formatDate(selectedOutfit.createdAt)}</p>
                    <p>Tags: {selectedOutfit?.tags.join(', ') || 'None'}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => selectedOutfit && window.open(selectedOutfit.url, '_blank')}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => selectedOutfit && handleFavoriteToggle(selectedOutfit.id, selectedOutfit.favorite)}
                    className="w-full"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${selectedOutfit?.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                    {selectedOutfit?.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => selectedOutfit && openDeleteDialog(selectedOutfit)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Image</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this image? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {outfitToDelete && (
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <ImageWithFallback
                      src={outfitToDelete.url}
                      alt={`${outfitToDelete.type} image`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {outfitToDelete.metadata?.filename || `Image ${outfitToDelete.id.slice(-6)}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatFileSize(outfitToDelete.sizeBytes)} • {formatDate(outfitToDelete.createdAt)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (outfitToDelete) {
                    performDeleteOutfit(outfitToDelete.id);
                  }
                  setDeleteDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
