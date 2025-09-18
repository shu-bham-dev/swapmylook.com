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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mobile Single Screen Layout */}
          <div className="lg:hidden space-y-4">
            {/* Model Selection */}
            <Card className="p-4">
              <ModelSelection 
                onModelSelect={setSelectedModel}
                selectedModel={selectedModel}
              />
            </Card>

            {/* Preview Canvas */}
            <PreviewCanvas
              model={selectedModel}
              outfit={selectedOutfit}
              isLoading={isLoading}
            />

            {/* Outfit Library */}
            <Card className="p-4">
              <OutfitLibrary
                onOutfitSelect={handleOutfitSelect}
                selectedOutfit={selectedOutfit}
              />
            </Card>

            {/* Quick Controls */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Quick Actions</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className="text-gray-600"
                  >
                    Undo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className="text-gray-600"
                  >
                    Redo
                  </Button>
                </div>
              </div>
              <Separator className="mb-4" />
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">Save</Button>
                <Button variant="outline" size="sm">Download</Button>
                <Button variant="outline" size="sm">Share</Button>
              </div>
            </Card>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <Card className="p-6">
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
          <div className="hidden lg:block lg:col-span-1">
            <PreviewCanvas
              model={selectedModel}
              outfit={selectedOutfit}
              isLoading={isLoading}
            />
          </div>

          <div className="hidden lg:block">
            <ControlsPanel
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
              currentStep={getCurrentStep()}
              totalSteps={3}
            />
          </div>
        </div>

        {/* Mobile Preview Controls */}
        {/* Removed since controls are now integrated above */}

        {/* Fashion Tips */}
        {selectedModel && selectedOutfit && (
          <div className="mt-6">
            <Card className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                </div>
                <div>
                  <h4 className="font-medium text-pink-800 mb-1">Style Tip</h4>
                  <p className="text-sm text-pink-700">
                    {selectedOutfit.category === 'formal' 
                      ? "This elegant look pairs beautifully with statement jewelry and classic heels."
                      : selectedOutfit.category === 'casual'
                      ? "Perfect for weekend adventures! Try adding a denim jacket for layering."
                      : "This versatile piece can be dressed up or down depending on your accessories."
                    }
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

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