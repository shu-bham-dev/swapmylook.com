import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Camera,
  Upload,
  Sparkles,
  Download,
  Share2,
  Zap,
  CheckCircle,
  ArrowRight,
  Palette,
  Settings,
  Heart
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface HowToChangeClothesPageProps {
  onPageChange: (page: string) => void;
}

export function HowToChangeClothesPage({ onPageChange }: HowToChangeClothesPageProps) {
  const steps = [
    {
      step: 1,
      title: 'Upload Your Photo',
      description: 'Start by uploading a clear, well-lit photo of yourself or your model. Our AI outfit changer works best with front-facing photos where the person is clearly visible.',
      icon: Upload,
      tips: [
        'Use good lighting for best results',
        'Face the camera directly',
        'Choose a photo with minimal background clutter'
      ]
    },
    {
      step: 2,
      title: 'Choose Your Outfit',
      description: 'Browse our extensive library of outfits and styles. From casual wear to formal attire, our AI outfit change technology has something for every occasion.',
      icon: Palette,
      tips: [
        'Filter by category, color, or style',
        'Save favorites for quick access',
        'Try different combinations'
      ]
    },
    {
      step: 3,
      title: 'Let AI Work Its Magic',
      description: 'Our advanced AI clothing changer automatically applies the selected outfit to your photo. The algorithm analyzes body shape, lighting, and proportions for realistic results.',
      icon: Sparkles,
      tips: [
        'Processing takes 30-60 seconds',
        'AI adjusts for perfect fit',
        'Realistic lighting matching'
      ]
    },
    {
      step: 4,
      title: 'Fine-Tune & Customize',
      description: 'Adjust the fit, lighting, and appearance to perfection. Our AI change outfit tools give you complete control over the final look.',
      icon: Settings,
      tips: [
        'Adjust clothing fit and drape',
        'Match lighting conditions',
        'Perfect color matching'
      ]
    },
    {
      step: 5,
      title: 'Save & Share',
      description: 'Download your transformed photo or share it directly with friends. Show off your new style with our AI outfit transformation technology.',
      icon: Share2,
      tips: [
        'Download high-resolution images',
        'Share on social media',
        'Save to your profile'
      ]
    }
  ];

  const benefits = [
    {
      title: 'No Technical Skills Needed',
      description: 'Our AI change outfit technology is designed for everyone. No Photoshop skills or technical knowledge required.',
      icon: Heart,
      color: 'bg-pink-50 text-pink-600'
    },
    {
      title: 'Instant Results',
      description: 'See your outfit changes in seconds, not hours. Our AI to change clothes works at lightning speed.',
      icon: Zap,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Realistic Transformations',
      description: 'Professional-quality results that look completely natural. The best AI outfit changer for authentic appearances.',
      icon: Camera,
      color: 'bg-blue-50 text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              How to Change Clothes in Photos with AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your photos instantly with our powerful AI outfit changer technology. 
              No technical skills needed - just upload, choose, and watch the magic happen!
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => onPageChange('login')}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Try AI Outfit Changer Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange('help')}
              className="border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">5 Simple Steps to AI Outfit Magic</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI change outfit process is designed to be intuitive and effortless. 
              Here's how you can transform your photos in minutes.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step) => (
              <Card key={step.step} className="p-8 hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <Badge className="bg-pink-100 text-pink-700 border-pink-200 mb-1">
                          Step {step.step}
                        </Badge>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold mb-3 text-gray-900">Pro Tips:</h4>
                      <div className="space-y-2">
                        {step.tips.map((tip, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-gray-700">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our AI Outfit Changer?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with the best AI outfit changer technology available today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${benefit.color} mx-auto mb-4`}>
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-8 text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Ready to Transform Your Photos?</h2>
              <p className="text-lg text-pink-100 max-w-2xl mx-auto">
                Join thousands of users who are already changing outfits with AI magic. 
                Experience the power of our AI change outfit technology today!
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => onPageChange('login')}
                className="bg-white text-pink-600 hover:bg-pink-50"
              >
                Start Changing Outfits with AI
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => onPageChange('help')}
                className="border-white text-white hover:bg-white/10"
              >
                See Examples
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}