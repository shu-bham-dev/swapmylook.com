import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Chrome,
  Facebook,
  Apple,
  ArrowRight,
  UserPlus,
  Heart,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../../services/api';
import { toast } from 'sonner';

interface LoginPageProps {
  onLogin: () => void;
  onPageChange: (page: string) => void;
}

export function LoginPage({ onLogin, onPageChange }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login with email and password
        await apiService.login(email, password);
        toast.success('Welcome back!', {
          description: 'You have successfully logged in.',
        });
      } else {
        // Sign up with email, password, and name
        await apiService.signup(email, password, name);
        toast.success('Account created!', {
          description: 'Your account has been created successfully.',
        });
      }
      onLogin();
      onPageChange('home');
    } catch (error) {
      // Error handling is now done by the API service
      console.error('Authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Get Google OAuth URL and redirect
      const { url } = await apiService.getGoogleAuthUrl();
      window.location.href = url;
    } catch (error) {
      console.error('Google login failed:', error);
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      await apiService.demoAuth();
      toast.success('Demo access granted!', {
        description: 'You are now logged in with a demo account.',
      });
      onLogin();
      onPageChange('home');
    } catch (error) {
      console.error('Demo login failed:', error);
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    onPageChange('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {isLogin ? 'Welcome Back!' : 'Join SwapMyLook'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? 'Sign in to continue your fashion journey' 
                : 'Start transforming your style with AI'
              }
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="p-6 space-y-6">
          {/* Social Login */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Demo Account
              </Button>
              <Button
                variant="outline"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Quick Start
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-pink-100 focus:border-pink-300"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 border-pink-100 focus:border-pink-300"
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 border-pink-100 focus:border-pink-300"
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="text-pink-600 h-auto p-0">
                  Forgot password?
                </Button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Switch between Login/Signup */}
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant="link"
                className="text-pink-600 h-auto p-0 ml-1"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Button>
            </p>

            <Separator />

            {/* Guest Access */}
            <Button
              variant="outline"
              onClick={handleGuestAccess}
              className="w-full text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Continue as Guest
            </Button>
          </div>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Trusted by 50,000+ fashion enthusiasts</span>
          </div>
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our{' '}
            <Button 
              variant="link" 
              className="text-pink-600 h-auto p-0 text-xs"
              onClick={() => onPageChange('terms')}
            >
              Terms & Privacy Policy
            </Button>
          </p>
        </div>

        {/* Feature Highlights */}
        <Card className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <div className="space-y-3">
            <h3 className="font-medium text-pink-800 text-center">Why join SwapMyLook?</h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-pink-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Unlimited AI outfit visualizations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Save and organize your favorite looks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Personalized style recommendations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Access to premium outfit collections</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}