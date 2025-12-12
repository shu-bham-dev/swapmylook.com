import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Upload, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { toast } from '../../utils/toast';

const AdminActionPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    type: 'model' | 'outfit';
    tags: string[];
    isPublic: boolean;
  }>({
    name: '',
    type: 'model',
    tags: [],
    isPublic: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const tagOptions = ['Casual', 'Formal', 'Business', 'Party'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image file');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    setIsUploading(true);
    try {
      // Upload the file with metadata
      const uploadResult = await apiService.uploadFile(selectedFile, formData.type, {
        name: formData.name,
        tags: formData.tags,
        isPublic: formData.isPublic,
      });

      toast.success('Image uploaded successfully!', {
        description: `"${formData.name}" has been added to the public library.`,
      });

      // Reset form
      setFormData({
        name: '',
        type: 'model',
        tags: [],
        isPublic: true,
      });
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed', {
        description: 'There was an error uploading the image. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Admin Upload
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload images for models and outfits to be displayed on the homepage.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Section */}
            <div>
              <Label htmlFor="image-upload" className="block text-sm font-medium mb-2">
                Upload Image
              </Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-pink-200 rounded-lg hover:border-pink-300 transition-colors">
                <div className="space-y-2 text-center">
                  {previewUrl ? (
                    <div className="mx-auto">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-48 w-auto object-cover rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {selectedFile?.name}
                      </p>
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-pink-400" />
                  )}
                  <div className="flex text-sm text-muted-foreground">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md font-medium text-pink-600 hover:text-pink-500"
                    >
                      <span>{previewUrl ? 'Change file' : 'Choose an image'}</span>
                      <input
                        id="image-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <Label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter image name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isUploading}
                required
              />
            </div>

            {/* Type Selection */}
            <div>
              <Label htmlFor="type" className="block text-sm font-medium mb-2">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'model' | 'outfit') => setFormData({ ...formData, type: value })}
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="model">Model</SelectItem>
                  <SelectItem value="outfit">Outfit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags Selection (only show if type is outfit) */}
            {formData.type === 'outfit' && (
              <div>
                <Label className="block text-sm font-medium mb-2">
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={formData.tags.includes(tag)}
                        onCheckedChange={() => handleTagToggle(tag)}
                        disabled={isUploading}
                      />
                      <Label
                        htmlFor={`tag-${tag}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Public Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, isPublic: checked })
                }
                disabled={isUploading}
              />
              <Label
                htmlFor="isPublic"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Make this image public (visible on homepage)
              </Label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Image'
                )}
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Uploaded images will be available on the homepage for users to select as models or outfits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminActionPage;