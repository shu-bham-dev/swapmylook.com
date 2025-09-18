import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { 
  Search, 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Video, 
  Download, 
  Upload, 
  Palette, 
  Settings,
  Camera,
  Share2,
  CreditCard,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

interface HelpPageProps {
  onPageChange: (page: string) => void;
}

export function HelpPage({ onPageChange }: HelpPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      questions: [
        {
          q: 'How do I create my first outfit visualization?',
          a: 'Getting started is easy! First, select or upload a model photo, then browse our outfit library to choose a style you like. Our AI will automatically apply the outfit to your model. You can fine-tune the lighting and fit before saving or downloading your look.'
        },
        {
          q: 'What image formats are supported for model uploads?',
          a: 'We support JPG, PNG, and WebP formats up to 10MB. For best results, use high-resolution photos with good lighting where the person is clearly visible and facing forward.'
        },
        {
          q: 'How accurate are the outfit visualizations?',
          a: 'Our AI technology provides highly realistic visualizations with 95% accuracy in outfit placement and color matching. Results may vary based on image quality and lighting conditions.'
        }
      ]
    },
    {
      id: 'account-billing',
      title: 'Account & Billing',
      icon: CreditCard,
      questions: [
        {
          q: 'How do credits work?',
          a: 'Each outfit visualization uses 1 credit. Free users get 5 credits per month, Pro users get 100, and Enterprise users have unlimited usage. Credits reset monthly and unused credits don\'t roll over.'
        },
        {
          q: 'Can I upgrade or downgrade my plan?',
          a: 'Yes! You can change your plan anytime from your profile settings. Upgrades take effect immediately, while downgrades take effect at your next billing cycle.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through Stripe.'
        }
      ]
    },
    {
      id: 'features',
      title: 'Features & Tools',
      icon: Palette,
      questions: [
        {
          q: 'How do I save and organize my favorite outfits?',
          a: 'Click the heart icon on any outfit visualization to save it to your favorites. You can organize saved outfits with tags and view them in your profile dashboard.'
        },
        {
          q: 'Can I share my outfit visualizations?',
          a: 'Absolutely! Use the share button to generate a link or download the image. Pro and Enterprise users get watermark-free sharing options.'
        },
        {
          q: 'What editing tools are available?',
          a: 'You can adjust lighting, fit, and apply filters to your visualizations. Pro users get access to advanced tools like background removal and color adjustments.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: Settings,
      questions: [
        {
          q: 'Why is my visualization taking so long to process?',
          a: 'Processing typically takes 30-60 seconds. High-resolution images or complex outfits may take longer. If it takes more than 2 minutes, try refreshing the page or contact support.'
        },
        {
          q: 'The outfit doesn\'t look right on my model. What can I do?',
          a: 'Try adjusting the fit and lighting sliders. Make sure your model photo has good lighting and the person is facing forward. For best results, use photos where the full body is visible.'
        },
        {
          q: 'I\'m having trouble uploading my photo.',
          a: 'Ensure your image is under 10MB and in JPG, PNG, or WebP format. Check your internet connection and try clearing your browser cache if the issue persists.'
        }
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Getting Started Guide',
      description: 'Step-by-step tutorial for new users',
      icon: Book,
      action: () => {},
      color: 'bg-pink-50 text-pink-600'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch our comprehensive video guides',
      icon: Video,
      action: () => {},
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageCircle,
      action: () => onPageChange('contact'),
      color: 'bg-blue-50 text-blue-600'
    }
  ];

  const troubleshootingSteps = [
    {
      issue: 'Upload Failed',
      icon: Upload,
      steps: [
        'Check file size (max 10MB)',
        'Verify file format (JPG, PNG, WebP)',
        'Ensure stable internet connection',
        'Try a different browser'
      ]
    },
    {
      issue: 'Poor Visualization Quality',
      icon: Camera,
      steps: [
        'Use high-resolution source images',
        'Ensure good lighting in photos',
        'Try different model poses',
        'Adjust fit and lighting settings'
      ]
    },
    {
      issue: 'Slow Processing',
      icon: Zap,
      steps: [
        'Check internet connection',
        'Try during off-peak hours',
        'Reduce image resolution',
        'Clear browser cache'
      ]
    }
  ];

  const filteredQuestions = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => searchQuery === '' || 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            How Can We Help You?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions, tutorials, and troubleshooting guides to make the most of SwapMyLook.
          </p>
        </div>

        {/* Search */}
        <Card className="p-6 mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, tutorials, or guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-lg border-pink-200 focus:border-pink-400"
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-pink-50">
            <TabsTrigger value="faq" className="data-[state=active]:bg-pink-200">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="guides" className="data-[state=active]:bg-pink-200">
              <Book className="w-4 h-4 mr-2" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="troubleshooting" className="data-[state=active]:bg-pink-200">
              <Settings className="w-4 h-4 mr-2" />
              Troubleshooting
            </TabsTrigger>
          </TabsList>

          {/* FAQ */}
          <TabsContent value="faq">
            <div className="space-y-6">
              {filteredQuestions.map((category) => (
                <Card key={category.id} className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-pink-600" />
                    </div>
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                    <Badge variant="outline">{category.questions.length}</Badge>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Guides */}
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-pink-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Uploading Your Model</h3>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</div>
                      <div>
                        <p className="font-medium text-gray-900">Choose a high-quality photo</p>
                        <p>Select a clear, well-lit image where the person is facing forward</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</div>
                      <div>
                        <p className="font-medium text-gray-900">Upload your image</p>
                        <p>Click "Choose File" and select your photo (max 10MB)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</div>
                      <div>
                        <p className="font-medium text-gray-900">Wait for processing</p>
                        <p>Our AI will analyze and prepare your model for outfit visualization</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Palette className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Choosing Outfits</h3>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</div>
                      <div>
                        <p className="font-medium text-gray-900">Browse the outfit library</p>
                        <p>Use filters to find outfits by category, style, or occasion</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</div>
                      <div>
                        <p className="font-medium text-gray-900">Preview and select</p>
                        <p>Hover over outfits to see details, then click to apply</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</div>
                      <div>
                        <p className="font-medium text-gray-900">Fine-tune the look</p>
                        <p>Adjust lighting, fit, and other settings to perfect your style</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Saving & Sharing</h3>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</div>
                      <div>
                        <p className="font-medium text-gray-900">Save to favorites</p>
                        <p>Click the heart icon to save looks to your profile</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</div>
                      <div>
                        <p className="font-medium text-gray-900">Download images</p>
                        <p>Save high-quality images to your device</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</div>
                      <div>
                        <p className="font-medium text-gray-900">Share with friends</p>
                        <p>Generate share links or post directly to social media</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Pro Tips</h3>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Use well-lit photos for best results</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Try different angles and poses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Experiment with the adjustment sliders</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Save your favorite combinations</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Troubleshooting */}
          <TabsContent value="troubleshooting">
            <div className="space-y-6">
              {troubleshootingSteps.map((trouble, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <trouble.icon className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold">{trouble.issue}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trouble.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {stepIndex + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}

              {/* Still Need Help */}
              <Card className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
                <div className="text-center space-y-4">
                  <AlertCircle className="w-12 h-12 text-pink-600 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-pink-800">Still Need Help?</h3>
                    <p className="text-pink-700">
                      Can't find the answer you're looking for? Our support team is here to help!
                    </p>
                  </div>
                  <Button
                    onClick={() => onPageChange('contact')}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Contact Support
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}