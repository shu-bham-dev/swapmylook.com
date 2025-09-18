import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X, 
  ArrowRight, 
  Upload, 
  Palette, 
  Sparkles,
  Camera,
  Heart
} from 'lucide-react';

interface OnboardingOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  currentStep?: number;
}

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to SwapMyLook! ✨",
    description: "Transform your style with AI-powered outfit visualization. Let's get you started!",
    icon: Sparkles,
    color: "from-pink-400 to-purple-500"
  },
  {
    id: 2,
    title: "Choose Your Model 👤",
    description: "Select from our diverse models or upload your own photo to see outfits on yourself.",
    icon: Upload,
    color: "from-blue-400 to-cyan-500"
  },
  {
    id: 3,
    title: "Pick Your Perfect Outfit 👗",
    description: "Browse our curated collection with filters for style, season, and occasion.",
    icon: Palette,
    color: "from-green-400 to-emerald-500"
  },
  {
    id: 4,
    title: "Fine-tune & Save 💫",
    description: "Adjust fit and lighting, then save or share your favorite looks with friends!",
    icon: Camera,
    color: "from-orange-400 to-red-500"
  }
];

export function OnboardingOverlay({ isVisible, onClose, currentStep = 0 }: OnboardingOverlayProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentStep > 0) {
      setActiveStep(currentStep - 1);
    }
  }, [currentStep]);

  if (!isVisible) return null;

  const currentStepData = onboardingSteps[activeStep];
  const isLastStep = activeStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveStep(prev => prev + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveStep(prev => prev - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-md transform transition-all duration-300 ${
        isAnimating ? 'scale-95 opacity-75' : 'scale-100 opacity-100'
      }`}>
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${currentStepData.color}`} />
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-200">
                {activeStep + 1} of {onboardingSteps.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Step Content */}
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${currentStepData.color} flex items-center justify-center`}>
                <currentStepData.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentStepData.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="px-6 pb-4">
          <div className="flex justify-center space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeStep
                    ? 'bg-pink-500 w-6'
                    : index < activeStep
                    ? 'bg-pink-300'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={activeStep === 0}
              className="text-gray-500 disabled:opacity-50"
            >
              Back
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-gray-600"
              >
                Skip Tour
              </Button>
              <Button
                onClick={handleNext}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                {isLastStep ? (
                  <>
                    Get Started
                    <Heart className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        {activeStep === 0 && (
          <div className="mx-6 mb-6 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100">
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-pink-700">Fun Fact!</p>
              <p className="text-xs text-pink-600">
                Our AI can visualize over 10,000 unique outfit combinations! 🎨
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}