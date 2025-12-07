import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import { apiService } from './services/api';
import { Toaster, toast } from 'sonner';

// Lazy load page components with proper typing
const LoginPage = lazy(() => import('./components/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const SettingsPage = lazy(() => import('./components/pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const MyHistoryPage = lazy(() => import('./components/pages/MyHistoryPage').then(module => ({ default: module.MyHistoryPage })));
const SubscriptionPage = lazy(() => import('./components/pages/SubscriptionPage').then(module => ({ default: module.SubscriptionPage })));
const ContactPage = lazy(() => import('./components/pages/ContactPage').then(module => ({ default: module.ContactPage })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then(module => ({ default: module.AboutPage })));
const TermsPage = lazy(() => import('./components/pages/TermsPage').then(module => ({ default: module.TermsPage })));
const AuthSuccessPage = lazy(() => import('./components/pages/AuthSuccessPage').then(module => ({ default: module.AuthSuccessPage })));

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

// Main App component with routing
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ model: Model | null; outfit: Outfit | null }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<'queued' | 'processing' | 'succeeded' | 'failed' | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize authentication on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a valid token
        if (apiService.isAuthenticated()) {
          // Verify token is still valid by fetching current user
          await apiService.fetchCurrentUser();
          setIsLoggedIn(true);
        } else {
          // No auto-login, user remains logged out
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);
        // Clear invalid token
        apiService.clearAuthData();
        setIsLoggedIn(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle login
  const handleLogin = async () => {
    try {
      // The actual login is handled by the LoginPage component
      // This function just updates the state
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Handle page navigation
  const handlePageChange = (page: string) => {
    if (page === 'login' && !isLoggedIn) {
      toast.info('Please login to continue', {
        description: 'You need to be logged in to access this feature.',
      });
    }
    navigate(`/${page === 'home' ? '' : page}`);
  };

  // Determine current step for progress tracking
  const getCurrentStep = () => {
    if (!selectedModel) return 1;
    if (!selectedOutfit) return 2;
    return 3;
  };

  // Handle outfit selection with actual API call
  const handleOutfitSelect = async (outfit: Outfit) => {
    if (!selectedModel) return;
    
    setIsLoading(true);
    setJobStatus('queued');
    
    // Scroll to preview canvas after a short delay
    const scrollToPreview = () => {
      setTimeout(() => {
        const element = document.getElementById('preview-canvas');
        if (element) {
          console.log('Scrolling to preview canvas', element);
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Additional fallback: scroll by offset if needed
          const yOffset = -80; // adjust for fixed header if any
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        } else {
          console.warn('Preview canvas element not found');
        }
      }, 200);
    };
    
    try {
      // Add to history
      const newHistoryEntry = { model: selectedModel, outfit };
      setHistory(prev => [...prev.slice(0, historyIndex + 1), newHistoryEntry]);
      setHistoryIndex(prev => prev + 1);
      
      // Update selected outfit immediately to show placeholder
      setSelectedOutfit(outfit);
      scrollToPreview();
      
      // Create generation job with default prompt
      const job = await apiService.createGenerationJob(
        selectedModel.id,
        outfit.id
      );
      
      setCurrentJobId(job.jobId);
      setJobStatus(job.status);
      
      // Poll for job status
      const pollJobStatus = async () => {
        try {
          const status = await apiService.getJobStatus(job.jobId);
          setJobStatus(status.status);
          
          if (status.status === 'succeeded' && status.outputImage) {
            // Update the outfit with the generated image
            const updatedOutfit = {
              ...outfit,
              image: status.outputImage.url
            };
            setSelectedOutfit(updatedOutfit);
            setIsLoading(false);
            console.log('✅ AI Generated image updated:', status.outputImage.url);
            scrollToPreview();
          } else if (status.status === 'failed') {
            console.error('Generation failed:', status.error);
            setSelectedOutfit(outfit);
            setIsLoading(false);
            scrollToPreview();
          } else if (status.status === 'processing' || status.status === 'queued') {
            // Continue polling
            setTimeout(pollJobStatus, 2000);
          }
        } catch (error) {
          console.error('Error polling job status:', error);
          setSelectedOutfit(outfit);
          setIsLoading(false);
          scrollToPreview();
        }
      };
      
      // Start polling
      setTimeout(pollJobStatus, 2000);
      
    } catch (error) {
      console.error('Error creating generation job:', error);
      // Fallback to simulation if API fails
      setTimeout(() => {
        setSelectedOutfit(outfit);
        setIsLoading(false);
        scrollToPreview();
      }, 1500);
    }
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

  // Get current page from location
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1);

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
            <div id="preview-canvas">
              <PreviewCanvas
                model={selectedModel}
                outfit={selectedOutfit}
                isLoading={isLoading}
                jobStatus={jobStatus}
              />
            </div>

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
            <div id="preview-canvas" className="h-[calc(100vh-8rem)]">
              <PreviewCanvas
                model={selectedModel}
                outfit={selectedOutfit}
                isLoading={isLoading}
                jobStatus={jobStatus}
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

  // Handle logout
  const handleLogout = async () => {
    try {
      await apiService.logout();
      toast.success('Logged out', {
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      toast.error('Logout Error', {
        description: 'There was an issue logging out.',
      });
    } finally {
      apiService.clearAuthData();
      setIsLoggedIn(false);
      setSelectedModel(null);
      setSelectedOutfit(null);
      setHistory([]);
      setHistoryIndex(-1);
      navigate('/');
    }
  };

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* SEO for current page */}
      {currentPage === 'home' && <SEO {...homePageSEO} />}
      {currentPage === 'about' && <SEO title="About Swap My Look - AI Fashion Technology" description="Learn about our AI-powered fashion technology and how we're revolutionizing virtual try-ons and outfit selection." url="https://swapmylook.com/about" />}
      {currentPage === 'contact' && <SEO title="Contact Us - Swap My Look Support" description="Get in touch with the Swap My Look team for support, partnerships, or any questions about our AI fashion technology." url="https://swapmylook.com/contact" />}
      {currentPage === 'settings' && <SEO title="Settings - Swap My Look" description="Manage your account settings, preferences, and security options." url="https://swapmylook.com/settings" />}
      {currentPage === 'history' && <SEO title="My History - Swap My Look" description="View and manage your uploaded models, outfits, and AI-generated images." url="https://swapmylook.com/history" />}
      {currentPage === 'subscription' && <SEO title="Subscription Plans - Swap My Look" description="Choose the perfect subscription plan for unlimited AI outfit changes and premium features." url="https://swapmylook.com/subscription" />}
      {currentPage === 'terms' && <SEO title="Terms of Service - Swap My Look" description="Read our terms of service and privacy policy for using the Swap My Look AI fashion platform." url="https://swapmylook.com/terms" />}
      
      {/* Navigation - show on all pages except login */}
      {currentPage !== 'login' && (
        <Navigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoggedIn={isLoggedIn}
          userCredits={25}
          onLogout={handleLogout}
        />
      )}
      
      {/* Page Content */}
      <Routes>
        <Route path="/" element={renderHomePage()} />
        <Route path="/login" element={
          <Suspense fallback={<LoadingFallback />}>
            <LoginPage onLogin={handleLogin} onPageChange={handlePageChange} />
          </Suspense>
        } />
        <Route path="/settings" element={
          <Suspense fallback={<LoadingFallback />}>
            <SettingsPage onPageChange={handlePageChange} />
          </Suspense>
        } />
        <Route path="/history" element={
          <Suspense fallback={<LoadingFallback />}>
            <MyHistoryPage onPageChange={handlePageChange} />
          </Suspense>
        } />
        <Route path="/subscription" element={
          <Suspense fallback={<LoadingFallback />}>
            <SubscriptionPage onPageChange={handlePageChange} />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<LoadingFallback />}>
            <ContactPage onPageChange={handlePageChange} />
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<LoadingFallback />}>
            <AboutPage onPageChange={handlePageChange} />
          </Suspense>
        } />
        <Route path="/terms" element={
          <Suspense fallback={<LoadingFallback />}>
            <TermsPage onPageChange={handlePageChange} />
          </Suspense>
        } />
        <Route path="/auth/success" element={
          <Suspense fallback={<LoadingFallback />}>
            <AuthSuccessPage onLogin={handleLogin} onPageChange={handlePageChange} />
          </Suspense>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        duration={4000}
        expand={true}
        richColors
        closeButton
      />
    </div>
  );
}

// Main App wrapper with Router
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}