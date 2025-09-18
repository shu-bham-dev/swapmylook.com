import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Heart, 
  Users, 
  Sparkles, 
  Target, 
  Award, 
  Zap,
  Globe,
  Camera,
  Palette,
  Shield,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface AboutPageProps {
  onPageChange: (page: string) => void;
}

export function AboutPage({ onPageChange }: AboutPageProps) {
  const stats = [
    { number: '50K+', label: 'Happy Users', icon: Users },
    { number: '1M+', label: 'Outfits Visualized', icon: Camera },
    { number: '500+', label: 'Outfit Styles', icon: Palette },
    { number: '99.9%', label: 'Uptime', icon: Zap }
  ];

  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop',
      bio: 'Former fashion director with 10+ years in the industry. Passionate about democratizing fashion through technology.'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'AI researcher and tech entrepreneur. Leading the development of our cutting-edge visualization algorithms.'
    },
    {
      name: 'Emily Zhang',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      bio: 'Award-winning UX designer focused on creating intuitive and beautiful fashion experiences.'
    },
    {
      name: 'David Park',
      role: 'VP of Engineering',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      bio: 'Full-stack engineer passionate about building scalable platforms that empower creativity.'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Inclusivity',
      description: 'Fashion should be accessible to everyone, regardless of body type, style preference, or budget.',
      color: 'bg-pink-50 text-pink-600'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'We push the boundaries of AI and fashion technology to create magical experiences.',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Shield,
      title: 'Privacy',
      description: 'Your photos and data are secure. We never share personal information without consent.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Empowerment',
      description: 'We help people discover their unique style and build confidence through fashion.',
      color: 'bg-green-50 text-green-600'
    }
  ];

  const milestones = [
    {
      year: '2022',
      title: 'Company Founded',
      description: 'Sarah and Marcus launched SwapMyLook with a vision to revolutionize fashion visualization.',
      icon: Sparkles
    },
    {
      year: '2023',
      title: 'AI Breakthrough',
      description: 'Developed proprietary AI technology for realistic outfit visualization with 95% accuracy.',
      icon: Zap
    },
    {
      year: '2023',
      title: '10K Users',
      description: 'Reached our first 10,000 users within 6 months of launch.',
      icon: Users
    },
    {
      year: '2024',
      title: 'Series A Funding',
      description: 'Raised $15M Series A to accelerate product development and global expansion.',
      icon: TrendingUp
    },
    {
      year: '2024',
      title: '50K+ Community',
      description: 'Growing community of fashion enthusiasts from over 100 countries.',
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Redefining Fashion with AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              At SwapMyLook, we believe everyone deserves to look and feel their best. 
              Our AI-powered platform makes fashion exploration fun, accessible, and personal.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => onPageChange('login')}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Join Our Community
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange('contact')}
              className="border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              Get in Touch
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-pink-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="p-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-pink-600" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To democratize fashion by making style exploration accessible, fun, and personal for everyone. 
                We're breaking down barriers between imagination and reality, helping people discover their 
                unique style without the traditional constraints of time, budget, or availability.
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A world where everyone feels confident and empowered through fashion. We envision a future 
                where AI-powered tools help people express their authentic selves, discover new styles, 
                and build confidence that extends far beyond their wardrobe.
              </p>
            </div>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${value.color}`}>
                    <value.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're a diverse team of fashion lovers, technologists, and dreamers working to transform how people experience style.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-pink-600 mb-3">{member.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From a simple idea to a global platform used by fashion enthusiasts worldwide.
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-pink-200 hidden md:block"></div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start space-x-6">
                  {/* Timeline dot */}
                  <div className="relative z-10 w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center">
                    <milestone.icon className="w-8 h-8 text-pink-600" />
                  </div>
                  
                  <Card className="flex-1 p-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-lg font-semibold">{milestone.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technology */}
        <Card className="p-8 mb-16 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-800">Cutting-Edge AI Technology</h2>
                </div>
                <p className="text-purple-700 leading-relaxed">
                  Our proprietary AI algorithms analyze millions of fashion combinations to provide 
                  realistic outfit visualizations. We use advanced computer vision and machine learning 
                  to ensure accurate fit, lighting, and style representation.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-purple-700">95% accuracy in outfit visualization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-purple-700">Real-time processing and rendering</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-purple-700">Privacy-first architecture</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-purple-700">Continuous learning and improvement</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl">
                <Camera className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-8 text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Ready to Transform Your Style?</h2>
              <p className="text-lg text-pink-100 max-w-2xl mx-auto">
                Join thousands of fashion enthusiasts who are already discovering their perfect style with SwapMyLook.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => onPageChange('login')}
                className="bg-white text-pink-600 hover:bg-pink-50"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => onPageChange('help')}
                className="border-white text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}