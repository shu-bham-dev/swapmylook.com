import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Upload, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiService } from '../services/api';

interface Model {
  id: string;
  name: string;
  image: string;
  category: 'female' | 'male' | 'diverse';
}

interface ModelSelectionProps {
  onModelSelect: (model: Model | null) => void;
  selectedModel: Model | null;
}

const predefinedModels: Model[] = [
  {
    id: '1',
    name: 'Aria',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
    category: 'female'
  },
  {
    id: '2', 
    name: 'Marcus',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    category: 'male'
  },
  {
    id: '3',
    name: 'Luna',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
    category: 'female'
  }
];

export function ModelSelection({ onModelSelect, selectedModel }: ModelSelectionProps) {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedModel, setUploadedModel] = useState<Model | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is authenticated
  const isAuthenticated = apiService.isAuthenticated();

  // Check if the selected model is an uploaded one
  const isUploadedModelSelected = selectedModel && uploadedModel && selectedModel.id === uploadedModel.id;

  const handleButtonClick = () => {
    if (!isAuthenticated) {
      // Redirect to login page using React Router
      navigate('/login');
      return;
    }
    
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      try {
        // Upload file to backend using the API service
        const data = await apiService.uploadFile(file, 'model');
        
        // Create model object with the uploaded image
        const newUploadedModel: Model = {
          id: data.imageAsset.id,
          name: 'Your Model',
          image: data.imageAsset.url,
          category: 'diverse'
        };
        
        setUploadedModel(newUploadedModel);
        onModelSelect(newUploadedModel);
        
      } catch (error) {
        console.error('Upload failed:', error);
        // Fallback to simulation if API fails
        const newUploadedModel: Model = {
          id: `uploaded-${Date.now()}`,
          name: 'Your Model',
          image: URL.createObjectURL(file),
          category: 'diverse'
        };
        setUploadedModel(newUploadedModel);
        onModelSelect(newUploadedModel);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSelectUploadedModel = () => {
    if (uploadedModel) {
      onModelSelect(uploadedModel);
    }
  };

  const handleRemoveUploadedModel = () => {
    setUploadedModel(null);
    onModelSelect(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-pink-400 to-coral-500 bg-clip-text text-transparent">
          Choose Your Model
        </h2>
        <p className="text-muted-foreground">
          Select a model or upload your own photo to get started
        </p>
      </div>

      {/* Upload Option or Preview */}
      {uploadedModel ? (
        <Card className="border-2 border-pink-300 transition-colors p-4 bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="font-medium text-gray-900 text-sm mb-2">Your Uploaded Model</h3>
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden mx-auto max-w-32">
                <ImageWithFallback
                  src={uploadedModel.image}
                  alt={uploadedModel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex space-x-2 mt-3 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-pink-300 text-pink-600 hover:bg-pink-50 text-xs ${
                    isUploadedModelSelected ? 'bg-pink-100' : ''
                  }`}
                  onClick={handleSelectUploadedModel}
                >
                  {isUploadedModelSelected ? 'Selected ✓' : 'Select'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
                  onClick={handleRemoveUploadedModel}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-pink-200 hover:border-pink-300 transition-colors p-4 text-center bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              {isUploading ? (
                <div className="animate-spin w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full" />
              ) : (
                <Upload className="w-4 h-4 text-pink-500" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 text-sm">Upload Your Photo</h3>
              <p className="text-xs text-muted-foreground">
                {isUploading ? 'Processing...' : 'JPG, PNG up to 10MB'}
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                className="border-pink-300 text-pink-600 hover:bg-pink-50 text-xs cursor-pointer"
                disabled={isUploading}
                onClick={handleButtonClick}
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
              <input
                ref={fileInputRef}
                id="model-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Predefined Models */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Or select a model:</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-2 px-2">
          {predefinedModels.map((model) => (
            <Card
              key={model.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden flex-shrink-0 w-32 ${
                selectedModel?.id === model.id
                  ? 'ring-2 ring-pink-400 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => onModelSelect(model)}
            >
              <div className="aspect-[3/4] relative">
                <ImageWithFallback
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3 text-white" />
                    <span className="text-white font-medium text-xs">{model.name}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}