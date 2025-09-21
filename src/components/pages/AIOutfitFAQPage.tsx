import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { 
  HelpCircle,
  Sparkles,
  Zap,
  Camera,
  Palette,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface AIOutfitFAQPageProps {
  onPageChange: (page: string) => void;
}

export function AIOutfitFAQPage({ onPageChange }: AIOutfitFAQPageProps) {
  const faqItems = [
    {
      question: 'How does AI change clothes in photos?',
      answer: 'Our AI outfit changer uses advanced computer vision and machine learning algorithms to analyze your photo. It identifies the person\'s body shape, pose, and lighting conditions, then seamlessly overlays the selected outfit while maintaining realistic proportions and natural appearance. The technology automatically adjusts for fit, drape, and lighting to create photorealistic results that look completely authentic.'
    },
    {
      question: 'Is the AI outfit changer free to use?',
      answer: 'Yes! We offer free access to our basic AI change outfit features with 5 free credits per month. You can try our technology and see the magic for yourself without any cost. For unlimited usage and premium features like HD downloads and advanced customization, we offer affordable Pro and Enterprise plans. Many users find our free tier is perfect for occasional outfit experiments and style exploration.'
    },
    {
      question: 'What makes your AI the best for changing outfits?',
      answer: 'Our AI clothing changer stands out with its 95% accuracy rate, lightning-fast processing (30-60 seconds), and incredibly realistic results. Unlike other tools, we focus specifically on fashion and outfit transformation, which means our algorithms are specially trained on millions of fashion combinations. We also offer the most intuitive interface, comprehensive customization options, and privacy-focused architecture that keeps your photos secure.'
    },
    {
      question: 'Can I customize colors and styles with the AI?',
      answer: 'Absolutely! Our AI to change color of background based on outfit is just one of many customization features. You can modify any aspect of your outfits - change colors, adjust fit, alter styles, mix patterns, and even create completely original designs. The customization tools are designed to be intuitive yet powerful, giving you creative freedom while the AI handles the technical complexity of making everything look natural and realistic.'
    },
    {
      question: 'How accurate are the outfit visualizations?',
      answer: 'Our AI change outfit technology achieves 95% accuracy in outfit placement, color matching, and realistic rendering. The visualizations account for body proportions, lighting conditions, fabric drape, and even subtle shadows. While results may vary slightly based on photo quality and lighting, most users are amazed by how natural and authentic the transformed outfits appear. We continuously improve our algorithms based on user feedback and new fashion trends.'
    },
    {
      question: 'Is my privacy protected when using the AI outfit changer?',
      answer: 'Your privacy is our top priority. We use enterprise-grade security measures to protect your photos and data. All image processing happens on secure servers, and we never store your photos longer than necessary to complete the transformation. We don\'t share your images with third parties, and you maintain full ownership of all content you create. Our privacy-first approach means you can experiment with outfit changes confidently and securely.'
    }
  ];

  const quickTips = [
    'Use well-lit, front-facing photos for best AI outfit change results',
    'Experiment with different outfits - our AI makes it easy to try countless styles',
    'Save your favorite combinations to build a personal style library',
    'Share your transformations with friends for instant feedback',
    'Use the customization tools to perfect every detail of your look'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              AI Outfit Changer FAQ
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get answers to the most common questions about our revolutionary AI outfit change technology. 
              Everything you need to know about transforming your style with artificial intelligence.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="p-8 mb-12">
          <div className="space-y-2 mb-6">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            </div>
            <p className="text-muted-foreground">
              Quick answers to help you make the most of our AI clothing changer technology.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
                <Card className="hover:shadow-md transition-shadow">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{item.question}</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        {/* Quick Tips */}
        <Card className="p-8 mb-12 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="space-y-2 mb-6">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-semibold text-purple-800">Quick Tips for Best Results</h2>
            </div>
            <p className="text-purple-700">
              Get the most out of our AI outfit changer with these expert recommendations.
            </p>
          </div>

          <div className="space-y-3">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Technology Overview */}
        <Card className="p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Magic</h3>
              <p className="text-sm text-muted-foreground">
                Advanced machine learning algorithms for realistic outfit transformations
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Photorealistic Results</h3>
              <p className="text-sm text-muted-foreground">
                95% accuracy in lighting, fit, and color matching
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Endless Customization</h3>
              <p className="text-sm text-muted-foreground">
                Complete creative control over colors, styles, and designs
              </p>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-8 text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Ready to Try AI Outfit Magic?</h2>
              <p className="text-pink-100">
                Experience the future of fashion with our powerful AI clothing changer. 
                Transform your photos instantly and discover your perfect style!
              </p>
            </div>
            <Button
              onClick={() => onPageChange('login')}
              className="bg-white text-pink-600 hover:bg-pink-50"
            >
              Start Your Style Transformation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Additional Help */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Still have questions?{' '}
            <button
              onClick={() => onPageChange('contact')}
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Contact our support team
            </button>{' '}
            for personalized assistance with our AI outfit changer technology.
          </p>
        </div>
      </div>
    </div>
  );
}