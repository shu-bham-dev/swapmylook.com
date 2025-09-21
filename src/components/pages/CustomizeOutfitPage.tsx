import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Palette,
  Sparkles,
  Sliders,
  Download,
  Share2,
  Zap,
  CheckCircle,
  ArrowRight,
  Heart,
  Camera,
  Wand2
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CustomizeOutfitPageProps {
  onPageChange: (page: string) => void;
}

export function CustomizeOutfitPage({ onPageChange }: CustomizeOutfitPageProps) {
  const beforeAfterExamples = [
    {
      before: '/assests/images/acc-what1.jpeg',
      after: '/assests/images/acc-what2.webp',
      title: 'Casual to Formal Transformation',
      description: 'See how our AI outfit changer can transform a simple casual look into elegant formal wear with perfect fit and lighting matching.'
    },
    {
      before: '/assests/images/acc-what3.webp',
      after: '/assests/images/acc-what4.webp',
      title: 'Color and Style Makeover',
      description: 'Watch as our AI change outfit technology completely revamps the color scheme and style while maintaining natural proportions.'
    },
    {
      before: '/assests/images/acc-what5.webp',
      after: '/assests/images/acc-what1.jpeg',
      title: 'Seasonal Style Switch',
      description: 'Experience seamless seasonal transitions with our AI clothing changer, adapting outfits to different weather and occasions.'
    }
  ];

  const customizationFeatures = [
    {
      title: 'Color Customization',
      description: 'Change any outfit color instantly. Our AI to change color of background based on outfit ensures perfect harmony.',
      icon: Palette,
      tips: [
        'Match existing wardrobe colors',
        'Experiment with new color combinations',
        'Create seasonal color palettes'
      ]
    },
    {
      title: 'Fit Adjustment',
      description: 'Perfect the fit of any outfit. Our AI change outfit technology analyzes body proportions for ideal sizing.',
      icon: Sliders,
      tips: [
        'Adjust sleeve and hem lengths',
        'Perfect waist and hip fitting',
        'Customize drape and flow'
      ]
    },
    {
      title: 'Style Modifications',
      description: 'Transform basic outfits into designer looks. The best AI outfit changer for creative styling.',
      icon: Wand2,
      tips: [
        'Add or remove design elements',
        'Change necklines and silhouettes',
        'Mix and match style elements'
      ]
    }
  ];

  const designProcess = [
    {
      step: 1,
      title: 'Start with Inspiration',
      description: 'Browse our style library or upload your own design ideas. Our AI outfit change platform supports endless creativity.',
      icon: Heart
    },
    {
      step: 2,
      title: 'Customize Every Detail',
      description: 'Use our intuitive tools to modify colors, patterns, and fit. Your personal AI change outfit designer at your fingertips.',
      icon: Sliders
    },
    {
      step: 3,
      title: 'Preview in Real-Time',
      description: 'See your custom designs come to life instantly. Our AI clothing changer provides immediate visual feedback.',
      icon: Camera
    },
    {
      step: 4,
      title: 'Refine and Perfect',
      description: 'Make final adjustments until your design is perfect. The best AI outfit changer for precision editing.',
      icon: Sparkles
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <Palette className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Customize and Design Your Own Outfit With AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Unleash your inner fashion designer with our powerful AI outfit customization tools. 
              Create unique styles, experiment with colors, and bring your fashion visions to life instantly.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => onPageChange('login')}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Start Designing Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange('how-to-change')}
              className="border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              See How It Works
            </Button>
          </div>
        </div>

        {/* Before & After Showcase */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">See the Magic of AI Outfit Transformation</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Witness how our AI change outfit technology can completely transform your look with realistic, stunning results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beforeAfterExamples.map((example, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="grid grid-cols-2">
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Before
                      </div>
                      <ImageWithFallback
                        src={example.before}
                        alt="Before AI outfit change"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        After
                      </div>
                      <ImageWithFallback
                        src={example.after}
                        alt="After AI outfit change"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold mb-2">{example.title}</h3>
                    <p className="text-sm text-muted-foreground">{example.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Customization Features */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Endless Customization Possibilities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI outfit changer gives you complete creative control over every aspect of your design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customizationFeatures.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {feature.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-600">{tip}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Design Process */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Your Creative Process Made Simple</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From inspiration to final design, our AI change outfit platform guides you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {designProcess.map((step) => (
              <Card key={step.step} className="p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-purple-600" />
                </div>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-3">
                  Step {step.step}
                </Badge>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <Card className="p-8 mb-16 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-4 text-purple-800">Why Design with AI?</h2>
            <p className="text-lg text-purple-700 max-w-2xl mx-auto">
              Experience the future of fashion design with our intelligent AI outfit changer technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Instant Visualization</h3>
                  <p className="text-sm text-muted-foreground">See your designs come to life in seconds, not days</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Zero Cost Experimentation</h3>
                  <p className="text-sm text-muted-foreground">Try unlimited designs without buying anything</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Photorealistic Results</h3>
                  <p className="text-sm text-muted-foreground">Professional-quality visuals that look completely real</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Personalized Style</h3>
                  <p className="text-sm text-muted-foreground">Create outfits that perfectly match your unique taste</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-8 text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Ready to Become a Fashion Designer?</h2>
              <p className="text-lg text-pink-100 max-w-2xl mx-auto">
                Unleash your creativity with the most powerful AI outfit customization platform. 
                Design, experiment, and create without limits!
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => onPageChange('login')}
                className="bg-white text-pink-600 hover:bg-pink-50"
              >
                Start Creating with AI
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => onPageChange('how-to-change')}
                className="border-white text-white hover:bg-white/10"
              >
                Learn How It Works
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}