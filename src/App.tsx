import { useState, useEffect, lazy, Suspense } from 'react';
import { Navigation } from './components/Navigation';
import { ModelSelection } from './components/ModelSelection';
import { OutfitLibrary, type Outfit } from './components/OutfitLibrary';
import { PreviewCanvas } from './components/PreviewCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { SEO, homePageSEO } from './components/SEO';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Separator } from './components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';
import { Sparkles, Menu, X } from 'lucide-react';

// Lazy load page components with proper typing
const LoginPage = lazy(() => import('./components/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const ProfilePage = lazy(() => import('./components/pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const SubscriptionPage = lazy(() => import('./components/pages/SubscriptionPage').then(module => ({ default: module.SubscriptionPage })));
const HelpPage = lazy(() => import('./components/pages/HelpPage').then(module => ({ default: module.HelpPage })));
const ContactPage = lazy(() => import('./components/pages/ContactPage').then(module => ({ default: module.ContactPage })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then(module => ({ default: module.AboutPage })));
const TermsPage = lazy(() => import('./components/pages/TermsPage').then(module => ({ default: module.TermsPage })));

// Loading component for lazy loading
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
  </div>
);

interface Model {
  id: string;
  name: string;
  image: string;
  category: 'female' | 'male' | 'diverse';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ model: Model | null; outfit: Outfit | null }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);


  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Handle logout (when navigating to login page while logged in)
  const handlePageChange = (page: string) => {
    if (page === 'login' && isLoggedIn) {
      setIsLoggedIn(false);
      setSelectedModel(null);
      setSelectedOutfit(null);
      setHistory([]);
      setHistoryIndex(-1);
    }
    setCurrentPage(page);
  };

  // Determine current step for progress tracking
  const getCurrentStep = () => {
    if (!selectedModel) return 1;
    if (!selectedOutfit) return 2;
    return 3;
  };

  // Handle outfit selection with loading simulation
  const handleOutfitSelect = (outfit: Outfit) => {
    if (!selectedModel) return;
    
    setIsLoading(true);
    
    // Add to history
    const newHistoryEntry = { model: selectedModel, outfit };
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newHistoryEntry]);
    setHistoryIndex(prev => prev + 1);
    
    // Simulate AI processing time
    setTimeout(() => {
      setSelectedOutfit(outfit);
      setIsLoading(false);
    }, 1500);
  };

  // History management
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = () => {
    if (canUndo) {
      setHistoryIndex(prev => prev - 1);
      const prevState = history[historyIndex - 1];
      setSelectedModel(prevState.model);
      setSelectedOutfit(prevState.outfit);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      setHistoryIndex(prev => prev + 1);
      const nextState = history[historyIndex + 1];
      setSelectedModel(nextState.model);
      setSelectedOutfit(nextState.outfit);
    }
  };

  // Route to different pages with lazy loading
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <LoginPage onLogin={handleLogin} onPageChange={handlePageChange} />
          </Suspense>
        );
      case 'profile':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ProfilePage onPageChange={handlePageChange} />
          </Suspense>
        );
      case 'subscription':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SubscriptionPage onPageChange={handlePageChange} />
          </Suspense>
        );
      case 'help':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HelpPage onPageChange={handlePageChange} />
          </Suspense>
        );
      case 'contact':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ContactPage onPageChange={handlePageChange} />
          </Suspense>
        );
      case 'about':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AboutPage onPageChange={handlePageChange} />
          </Suspense>
        );
      case 'terms':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TermsPage onPageChange={handlePageChange} />
          </Suspense>
        );
      case 'home':
      default:
        return renderHomePage();
    }
  };

  // Render the main fashion tool page
  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mobile Single Screen Layout */}
          <div className="lg:hidden space-y-3">
            {/* Model Selection */}
            <Card className="p-3">
              <ModelSelection
                onModelSelect={setSelectedModel}
                selectedModel={selectedModel}
              />
            </Card>

            {/* Outfit Library */}
            <Card className="p-3">
              <OutfitLibrary
                onOutfitSelect={handleOutfitSelect}
                selectedOutfit={selectedOutfit}
              />
            </Card>

            {/* Preview Canvas */}
            <PreviewCanvas
              model={selectedModel}
              outfit={selectedOutfit}
              isLoading={isLoading}
            />

            {/* Quick Controls */}
            <Card className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">Quick Actions</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className="text-gray-600 text-xs"
                  >
                    Undo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className="text-gray-600 text-xs"
                  >
                    Redo
                  </Button>
                </div>
              </div>
              <Separator className="mb-3" />
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="text-xs">Save</Button>
                <Button variant="outline" size="sm" className="text-xs">Download</Button>
                <Button variant="outline" size="sm" className="text-xs">Share</Button>
              </div>
            </Card>
          </div>

          {/* Desktop Layout - First Row */}
          <div className="hidden lg:block">
            <Card className="p-6 h-[calc(100vh-8rem)]">
              <ModelSelection
                onModelSelect={setSelectedModel}
                selectedModel={selectedModel}
              />
            </Card>
          </div>

          <div className="hidden lg:block">
            <Card className="p-6 h-[calc(100vh-8rem)] flex flex-col">
              <OutfitLibrary
                onOutfitSelect={handleOutfitSelect}
                selectedOutfit={selectedOutfit}
              />
            </Card>
          </div>

          {/* Preview Canvas - Desktop only (mobile has it in the single column) */}
          <div className="hidden lg:block">
            <div className="h-[calc(100vh-8rem)]">
              <PreviewCanvas
                model={selectedModel}
                outfit={selectedOutfit}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Controls Panel - Second Row (only show when outfit is selected) */}
          {selectedOutfit && (
            <div className="hidden lg:block lg:col-span-3">
              <ControlsPanel
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={canUndo}
                canRedo={canRedo}
                currentStep={getCurrentStep()}
                totalSteps={3}
              />
            </div>
          )}
        </div>

        {/* Mobile Preview Controls */}
        {/* Removed since controls are now integrated above */}

      </main>

      {/* How to Change Clothes in Photos with AI Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            How to Change Clothes in Photos with AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your photos instantly with our powerful AI outfit changer technology.
            No technical skills needed - just follow these simple steps!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-pink-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Upload Your Photo</h3>
            <p className="text-muted-foreground">
              Start with a clear, well-lit photo. Our AI outfit changer works best with front-facing photos where you're clearly visible.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Choose Your Outfit</h3>
            <p className="text-muted-foreground">
              Browse our extensive library of outfits and styles. From casual to formal, find the perfect look for any occasion.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">See the Magic</h3>
            <p className="text-muted-foreground">
              Watch as our AI automatically applies the outfit with perfect fit and realistic lighting. Results in seconds!
            </p>
          </Card>
        </div>
      </section>

      {/* Spacer between sections */}
      <div className="h-12"></div>

      {/* Customize and Design Your Own Outfit With AI Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Customize and Design Your Own Outfit With AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create unique fashion designs and see instant transformations with our AI-powered customization tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="/assests/images/acc-what1.jpeg"
              alt="AI outfit transformation example"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold mb-2">Casual to Formal Magic</h3>
              <p className="text-sm text-muted-foreground">
                See how our AI can transform everyday looks into elegant formal wear instantly.
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="/assests/images/acc-what2.webp"
              alt="AI color transformation example"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold mb-2">Color Transformation</h3>
              <p className="text-sm text-muted-foreground">
                Experiment with different color schemes and see complete style makeovers.
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="/assests/images/acc-what3.webp"
              alt="AI seasonal style transformation"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold mb-2">Seasonal Style Switch</h3>
              <p className="text-sm text-muted-foreground">
                Adapt your outfits to different seasons and occasions with AI magic.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Spacer between sections */}
      <div className="h-12"></div>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get answers to common questions about our AI outfit changer technology.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left font-semibold">
              How does AI change clothes in photos?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our AI uses advanced computer vision to analyze your photo and seamlessly overlay selected outfits while maintaining realistic proportions and natural appearance.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left font-semibold">
              Is the AI outfit changer free to use?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! We offer free access with 5 credits per month. You can try our technology and see the magic for yourself without any cost.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left font-semibold">
              How accurate are the outfit visualizations?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our AI achieves 95% accuracy in outfit placement, color matching, and realistic rendering. The visualizations account for body proportions and lighting conditions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left font-semibold">
              Can I customize colors and styles?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Absolutely! You can modify any aspect of your outfits - change colors, adjust fit, alter styles, and create completely original designs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

    </div>
  );

  return (
    <div className="min-h-screen">
      {/* SEO for current page */}
      {currentPage === 'home' && <SEO {...homePageSEO} />}
      {currentPage === 'about' && <SEO title="About Swap My Look - AI Fashion Technology" description="Learn about our AI-powered fashion technology and how we're revolutionizing virtual try-ons and outfit selection." url="https://swapmylook.com/about" />}
      {currentPage === 'contact' && <SEO title="Contact Us - Swap My Look Support" description="Get in touch with the Swap My Look team for support, partnerships, or any questions about our AI fashion technology." url="https://swapmylook.com/contact" />}
      {currentPage === 'help' && <SEO title="Help & FAQ - Swap My Look Support" description="Find answers to frequently asked questions and get help with using our AI fashion outfit selector platform." url="https://swapmylook.com/help" />}
      {currentPage === 'profile' && <SEO title="My Profile - Swap My Look" description="Manage your Swap My Look profile, preferences, and outfit history." url="https://swapmylook.com/profile" />}
      {currentPage === 'subscription' && <SEO title="Subscription Plans - Swap My Look" description="Choose the perfect subscription plan for unlimited AI outfit changes and premium features." url="https://swapmylook.com/subscription" />}
      {currentPage === 'terms' && <SEO title="Terms of Service - Swap My Look" description="Read our terms of service and privacy policy for using the Swap My Look AI fashion platform." url="https://swapmylook.com/terms" />}
      
      {/* Navigation - show on all pages except login */}
      {currentPage !== 'login' && (
        <Navigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoggedIn={isLoggedIn}
          userCredits={25}
        />
      )}
      
      {/* Page Content */}
      {renderPage()}
    </div>
  );
}