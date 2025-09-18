import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { 
  Crown, 
  Check, 
  Sparkles, 
  Zap, 
  Star, 
  Users, 
  Infinity,
  CreditCard,
  Shield,
  Heart,
  Download,
  Palette,
  Camera
} from 'lucide-react';

interface SubscriptionPageProps {
  onPageChange: (page: string) => void;
}

export function SubscriptionPage({ onPageChange }: SubscriptionPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for trying out SwapMyLook',
      price: { monthly: 0, yearly: 0 },
      features: [
        '5 outfit visualizations per month',
        'Basic model selection',
        'Standard quality renders',
        'Community support',
        'Watermarked downloads'
      ],
      limitations: [
        'Limited outfit library access',
        'No advanced editing tools',
        'Basic style suggestions'
      ],
      icon: Heart,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For fashion enthusiasts and influencers',
      price: { monthly: 19, yearly: 190 },
      features: [
        '100 outfit visualizations per month',
        'Full outfit library access',
        'HD quality renders',
        'Advanced editing tools',
        'Watermark-free downloads',
        'Priority customer support',
        'Style trend insights',
        'Custom model uploads'
      ],
      limitations: [],
      icon: Crown,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-300',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For businesses and fashion brands',
      price: { monthly: 99, yearly: 990 },
      features: [
        'Unlimited outfit visualizations',
        'Custom outfit collections',
        '4K quality renders',
        'Brand integration tools',
        'API access',
        'Dedicated account manager',
        'Custom model training',
        'Advanced analytics',
        'White-label solutions'
      ],
      limitations: [],
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300'
    }
  ];

  const currentUsage = {
    visualizations: 47,
    limit: 100,
    daysLeft: 18
  };

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    // Simulate payment process
    console.log(`Upgrading to ${planId} plan`);
  };

  const getPrice = (plan: typeof plans[0]) => {
    const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
    const period = billingCycle === 'monthly' ? 'month' : 'year';
    return { price, period };
  };

  const getDiscount = () => {
    return billingCycle === 'yearly' ? 20 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Style Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock your fashion potential with our AI-powered outfit visualization tools. 
            Start your style journey today!
          </p>
        </div>

        {/* Current Usage (for logged-in users) */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-pink-800">Current Usage</h3>
                <p className="text-sm text-pink-600">Pro Plan • {currentUsage.daysLeft} days remaining</p>
              </div>
            </div>
            <Badge className="bg-pink-200 text-pink-800 border-pink-300">
              {currentUsage.visualizations}/{currentUsage.limit} used
            </Badge>
          </div>
          <Progress 
            value={(currentUsage.visualizations / currentUsage.limit) * 100} 
            className="h-3 mb-2" 
          />
          <p className="text-sm text-pink-700">
            You've used {currentUsage.visualizations} of {currentUsage.limit} outfit visualizations this month.
          </p>
        </Card>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <Switch
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
          />
          <span className={`text-sm ${billingCycle === 'yearly' ? 'font-medium' : 'text-muted-foreground'}`}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              Save 20%
            </Badge>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const { price, period } = getPrice(plan);
            const Icon = plan.icon;
            const isCurrentPlan = plan.id === 'pro'; // Assuming user is on pro plan
            
            return (
              <Card
                key={plan.id}
                className={`relative p-6 transition-all duration-300 hover:shadow-lg ${
                  plan.popular 
                    ? 'ring-2 ring-pink-400 shadow-lg scale-105' 
                    : `${plan.borderColor} hover:${plan.borderColor.replace('border-', 'ring-2 ring-')}`
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-pink-500 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Header */}
                  <div className="space-y-3">
                    <div className={`w-12 h-12 ${plan.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${plan.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold">${price}</span>
                      <span className="text-muted-foreground">/{period}</span>
                    </div>
                    {billingCycle === 'yearly' && price > 0 && (
                      <p className="text-sm text-green-600">
                        Save ${(plan.price.monthly * 12 - plan.price.yearly)} per year
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-medium">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    {isCurrentPlan ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        className={`w-full ${
                          plan.id === 'free'
                            ? 'bg-gray-600 hover:bg-gray-700'
                            : plan.popular
                            ? 'bg-pink-500 hover:bg-pink-600'
                            : 'bg-purple-500 hover:bg-purple-600'
                        } text-white`}
                      >
                        {plan.id === 'free' ? 'Get Started' : `Upgrade to ${plan.name}`}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6 text-center">Compare All Features</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Features</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4 bg-pink-50">Pro</th>
                  <th className="text-center py-3 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-3 px-4">Monthly Visualizations</td>
                  <td className="text-center py-3 px-4">5</td>
                  <td className="text-center py-3 px-4 bg-pink-50">100</td>
                  <td className="text-center py-3 px-4">
                    <Infinity className="w-4 h-4 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">HD Quality</td>
                  <td className="text-center py-3 px-4">
                    <X className="w-4 h-4 mx-auto text-red-500" />
                  </td>
                  <td className="text-center py-3 px-4 bg-pink-50">
                    <Check className="w-4 h-4 mx-auto text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-4 h-4 mx-auto text-green-500" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Watermark-free Downloads</td>
                  <td className="text-center py-3 px-4">
                    <X className="w-4 h-4 mx-auto text-red-500" />
                  </td>
                  <td className="text-center py-3 px-4 bg-pink-50">
                    <Check className="w-4 h-4 mx-auto text-green-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-4 h-4 mx-auto text-green-500" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">API Access</td>
                  <td className="text-center py-3 px-4">
                    <X className="w-4 h-4 mx-auto text-red-500" />
                  </td>
                  <td className="text-center py-3 px-4 bg-pink-50">
                    <X className="w-4 h-4 mx-auto text-red-500" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-4 h-4 mx-auto text-green-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* FAQ */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Can I change my plan anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! You can upgrade, downgrade, or cancel your subscription at any time. 
                  Changes take effect at your next billing cycle.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">What happens to my credits when I upgrade?</h4>
                <p className="text-sm text-muted-foreground">
                  Unused credits from your current plan will be added to your new plan allowance.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Is there a free trial?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! Every new user gets 5 free outfit visualizations to try our platform.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Do you offer refunds?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day money-back guarantee for all paid plans. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>30-Day Guarantee</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Join 50,000+ fashion enthusiasts already using SwapMyLook
          </p>
        </div>
      </div>
    </div>
  );
}

// Missing X import
import { X } from 'lucide-react';