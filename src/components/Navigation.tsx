import { useState } from 'react';
import { Button } from './ui/button';
import {
  Sparkles,
  Menu,
  X,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  Heart
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isLoggedIn?: boolean;
  userCredits?: number;
}

export function Navigation({ currentPage, onPageChange, isLoggedIn = false, userCredits = 25 }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Style Studio', icon: Sparkles },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Heart },
  ];

  const userMenuItems = [
    { id: 'profile', label: 'Profile & Settings', icon: Settings },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                SwapMyLook
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                AI-Powered Fashion Visualization
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(item.id)}
                className={currentPage === item.id ? "bg-pink-500 text-white" : "text-gray-600 hover:text-pink-600"}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Credits Display */}
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-200">
                    ✨ {userCredits} credits
                  </Badge>
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">Jane Doe</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          jane@example.com
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {userMenuItems.map((item) => (
                      <DropdownMenuItem key={item.id} onClick={() => onPageChange(item.id)}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onPageChange('login')}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange('login')}
                  className="text-gray-600 hover:text-pink-600"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => onPageChange('login')}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-pink-100">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full justify-start ${
                    currentPage === item.id ? "bg-pink-500 text-white" : "text-gray-600"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
              
              {isLoggedIn ? (
                <>
                  <div className="py-2">
                    <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-200">
                      ✨ {userCredits} credits
                    </Badge>
                  </div>
                  {userMenuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onPageChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start text-gray-600"
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onPageChange('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onPageChange('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-600"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      onPageChange('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}