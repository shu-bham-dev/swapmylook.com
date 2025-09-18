import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  Twitter,
  Instagram,
  Facebook,
  User,
  Bug,
  Lightbulb,
  CreditCard,
  Shield,
  Sparkles
} from 'lucide-react';

interface ContactPageProps {
  onPageChange: (page: string) => void;
}

export function ContactPage({ onPageChange }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const supportCategories = [
    { value: 'technical', label: 'Technical Issue', icon: Bug },
    { value: 'billing', label: 'Billing & Payments', icon: CreditCard },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'account', label: 'Account Support', icon: User },
    { value: 'privacy', label: 'Privacy & Security', icon: Shield },
    { value: 'general', label: 'General Question', icon: MessageCircle }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      contact: 'support@swapmylook.com',
      availability: '24/7',
      color: 'bg-pink-50 text-pink-600'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available in app',
      availability: '9 AM - 6 PM EST',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      contact: '+1 (555) 123-4567',
      availability: '9 AM - 5 PM EST (Pro & Enterprise)',
      color: 'bg-green-50 text-green-600'
    }
  ];

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', handle: '@swapmylook', color: 'text-blue-400' },
    { icon: Instagram, label: 'Instagram', handle: '@swapmylook', color: 'text-pink-500' },
    { icon: Facebook, label: 'Facebook', handle: 'SwapMyLook', color: 'text-blue-600' }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-800">Message Sent!</h2>
              <p className="text-muted-foreground">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full"
              >
                Send Another Message
              </Button>
              <Button 
                onClick={() => onPageChange('home')}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question, need help, or want to share feedback? We're here to help you make the most of SwapMyLook.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Send us a Message</h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="border-pink-200 focus:border-pink-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="border-pink-200 focus:border-pink-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="border-pink-200 focus:border-pink-400">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center space-x-2">
                                <category.icon className="w-4 h-4" />
                                <span>{category.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select onValueChange={(value) => handleInputChange('priority', value)}>
                        <SelectTrigger className="border-pink-200 focus:border-pink-400">
                          <SelectValue placeholder="Normal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide as much detail as possible to help us assist you better..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-pink-50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method.color}`}>
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{method.title}</h4>
                      <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                      <p className="text-sm font-medium">{method.contact}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{method.availability}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Office Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Our Office</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-pink-500 mt-0.5" />
                  <div>
                    <p className="font-medium">SwapMyLook HQ</p>
                    <p className="text-sm text-muted-foreground">
                      123 Fashion District<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-pink-500" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Monday - Friday: 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">
                  Stay updated with the latest fashion trends and SwapMyLook news.
                </p>
                {socialLinks.map((social, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-pink-50 transition-colors cursor-pointer">
                    <social.icon className={`w-5 h-5 ${social.color}`} />
                    <div>
                      <p className="font-medium">{social.label}</p>
                      <p className="text-sm text-muted-foreground">{social.handle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
              <h3 className="text-lg font-semibold mb-4 text-pink-800">Quick Links</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange('help')}
                  className="w-full justify-start text-pink-700 hover:bg-pink-100"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Help Center
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange('subscription')}
                  className="w-full justify-start text-pink-700 hover:bg-pink-100"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing & Plans
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange('terms')}
                  className="w-full justify-start text-pink-700 hover:bg-pink-100"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy & Terms
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Response Time Notice */}
        <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Response Times</p>
              <p className="text-sm text-blue-700">
                <strong>General inquiries:</strong> Within 24 hours • 
                <strong> Technical issues:</strong> Within 12 hours • 
                <strong> Billing questions:</strong> Within 6 hours
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}