import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Undo2, 
  Redo2, 
  Save, 
  Download, 
  Share2, 
  Settings, 
  History,
  Heart,
  Star,
  Camera,
  Palette
} from 'lucide-react';

interface ControlsPanelProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export function ControlsPanel({ 
  onUndo, 
  onRedo, 
  onSave, 
  onDownload, 
  onShare,
  canUndo = false,
  canRedo = false,
  currentStep = 1,
  totalSteps = 3
}: ControlsPanelProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    if (onSave) {
      await onSave();
    }
    setTimeout(() => setIsSaving(false), 1000);
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Your Progress</span>
            <Badge variant="outline" className="text-pink-600 border-pink-200">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Select Model</span>
            <span>Choose Outfit</span>
            <span>Perfect Look</span>
          </div>
        </div>
      </Card>

      {/* Main Controls */}
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-pink-500" />
          Quick Actions
        </h3>
        
        <div className="space-y-3">
          {/* History Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="flex-1 text-gray-600 disabled:opacity-50"
            >
              <Undo2 className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="flex-1 text-gray-600 disabled:opacity-50"
            >
              <Redo2 className="w-4 h-4 mr-1" />
              Redo
            </Button>
          </div>

          {/* Save & Export */}
          <div className="space-y-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Look
                </>
              )}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="text-gray-600"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onShare}
                className="text-gray-600"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent History */}
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-pink-500" />
          Recent Looks
        </h3>
        
        <div className="space-y-2">
          {[
            { name: 'Summer Casual', time: '2 min ago', liked: true },
            { name: 'Business Chic', time: '5 min ago', liked: false },
            { name: 'Evening Glam', time: '10 min ago', liked: true },
          ].map((look, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-pink-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{look.name}</p>
                  <p className="text-xs text-muted-foreground">{look.time}</p>
                </div>
              </div>
              <Heart className={`w-4 h-4 ${look.liked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
            </div>
          ))}
        </div>
      </Card>

      {/* Style Insights */}
      <Card className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-pink-500" />
          Style Insights
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Your Style Score</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Fashion Forward</span>
              <span>92%</span>
            </div>
            <Progress value={92} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Color Harmony</span>
              <span>88%</span>
            </div>
            <Progress value={88} className="h-1" />
          </div>
          
          <div className="text-xs text-pink-600 bg-white/60 rounded-lg p-2 mt-3">
            💡 Tip: Try adding accessories to complete your look!
          </div>
        </div>
      </Card>
    </div>
  );
}