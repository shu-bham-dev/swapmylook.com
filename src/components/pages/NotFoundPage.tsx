import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Home, Search, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotFoundPageProps {
  onPageChange?: (page: string) => void;
}

export function NotFoundPage({ onPageChange }: NotFoundPageProps) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (onPageChange) {
      onPageChange('home');
    } else {
      navigate('/');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const popularPages = [
    { name: 'AI Clothes Changer', path: 'ai-clothes-changer' },
    { name: 'Outfit Library', path: '' },
    { name: 'About Us', path: 'about' },
    { name: 'Blog', path: 'blog' },
    { name: 'Contact', path: 'contact' },
    { name: 'Login', path: 'login' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            The page you're looking for seems to have wandered off into the fashion abyss. 
            Don't worry though - there are plenty of stylish alternatives waiting for you!
          </p>
        </div>

        <Card className="p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <Search className="w-5 h-5 mr-2 text-pink-600" />
                  What might have happened?
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">•</span>
                    The page may have been moved or renamed
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">•</span>
                    You might have typed the URL incorrectly
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">•</span>
                    The page could be temporarily unavailable
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">•</span>
                    Our fashion AI might be giving it a makeover
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleGoBack}
                    variant="outline"
                    className="flex items-center"
                  >
                    Go Back
                  </Button>
                  <Button
                    onClick={handleGoHome}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 flex items-center"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Popular Pages</h3>
                <p className="text-sm text-muted-foreground">
                  Try one of these popular destinations instead:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {popularPages.map((page, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-3"
                      onClick={() => navigate(`/${page.path}`)}
                    >
                      <span className="truncate">{page.name}</span>
                      <ArrowRight className="w-3 h-3 ml-2 flex-shrink-0" />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  If you believe this is an error or need assistance, please contact our support team.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/contact')}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Still lost? Try using the search feature or browse our{' '}
            <button
              onClick={() => navigate('/blog')}
              className="text-pink-600 hover:text-pink-700 underline"
            >
              blog
            </button>{' '}
            for fashion inspiration.
          </p>
        </div>
      </div>
    </div>
  );
}