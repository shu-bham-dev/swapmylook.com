import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { 
  User, 
  Settings, 
  Heart, 
  History, 
  Camera, 
  Bell, 
  Palette, 
  Download,
  Share2,
  Trash2,
  Crown,
  Star,
  Calendar,
  Edit3
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProfilePageProps {
  onPageChange: (page: string) => void;
}

export function ProfilePage({ onPageChange }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane@example.com');
  const [bio, setBio] = useState('Fashion enthusiast exploring new styles with AI');

  const savedOutfits = [
    {
      id: '1',
      name: 'Summer Breeze',
      image: 'https://images.unsplash.com/photo-1586024452802-86e0d084a4f9?w=300&h=400&fit=crop',
      date: '2024-01-15',
      liked: true,
      tags: ['casual', 'summer']
    },
    {
      id: '2',
      name: 'Evening Elegance',
      image: 'https://images.unsplash.com/photo-1678274342617-09c13eefab9f?w=300&h=400&fit=crop',
      date: '2024-01-14',
      liked: true,
      tags: ['formal', 'elegant']
    },
    {
      id: '3',
      name: 'Urban Explorer',
      image: 'https://images.unsplash.com/photo-1740381918234-d364ff4c5cb4?w=300&h=400&fit=crop',
      date: '2024-01-13',
      liked: false,
      tags: ['casual', 'street']
    },
    {
      id: '4',
      name: 'Business Power',
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=400&fit=crop',
      date: '2024-01-12',
      liked: true,
      tags: ['business', 'professional']
    }
  ];

  const recentActivity = [
    { action: 'Created "Summer Breeze" look', time: '2 hours ago', type: 'create' },
    { action: 'Shared "Evening Elegance" with friends', time: '1 day ago', type: 'share' },
    { action: 'Downloaded "Urban Explorer" outfit', time: '2 days ago', type: 'download' },
    { action: 'Liked "Business Power" style', time: '3 days ago', type: 'like' }
  ];

  const stylePreferences = {
    favoriteColors: ['Pink', 'Navy', 'White', 'Beige'],
    preferredStyles: ['Casual', 'Elegant', 'Minimalist'],
    bodyType: 'Pear',
    occasions: ['Work', 'Weekend', 'Date Night']
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop" alt="Profile" />
                <AvatarFallback className="text-xl">JD</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-pink-500 hover:bg-pink-600 text-white p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-xl font-semibold border-pink-200 focus:border-pink-400"
                  />
                  <Input
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your style..."
                    className="border-pink-200 focus:border-pink-400"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                    <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro Member
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{bio}</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? 'Save' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <Separator className="my-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">47</div>
              <div className="text-sm text-muted-foreground">Outfits Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-sm text-muted-foreground">Favorites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-coral-500">156</div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4.8</div>
              <div className="text-sm text-muted-foreground">Style Score</div>
            </div>
          </div>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="saved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-pink-50">
            <TabsTrigger value="saved" className="data-[state=active]:bg-pink-200">
              <Heart className="w-4 h-4 mr-2" />
              Saved Outfits
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-pink-200">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-pink-200">
              <Palette className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-pink-200">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Saved Outfits */}
          <TabsContent value="saved">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Your Saved Outfits</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">25 credits left</span>
                  <Button
                    size="sm"
                    onClick={() => onPageChange('subscription')}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Upgrade
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {savedOutfits.map((outfit) => (
                  <Card key={outfit.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="aspect-[3/4] relative">
                      <ImageWithFallback
                        src={outfit.image}
                        alt={outfit.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute inset-0 flex items-center justify-center space-x-2">
                          <Button size="sm" variant="secondary">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Heart */}
                      {outfit.liked && (
                        <Heart className="absolute top-2 right-2 w-5 h-5 text-red-500 fill-red-500" />
                      )}
                    </div>
                    
                    <div className="p-3">
                      <h4 className="font-medium truncate">{outfit.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-wrap gap-1">
                          {outfit.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(outfit.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* History */}
          <TabsContent value="history">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-pink-50 transition-colors">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      {activity.type === 'create' && <Camera className="w-5 h-5 text-pink-600" />}
                      {activity.type === 'share' && <Share2 className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'download' && <Download className="w-5 h-5 text-green-600" />}
                      {activity.type === 'like' && <Heart className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Style Preferences */}
          <TabsContent value="preferences">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Style Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Favorite Colors</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {stylePreferences.favoriteColors.map((color) => (
                        <Badge key={color} variant="outline" className="bg-pink-50 text-pink-700">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Preferred Styles</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {stylePreferences.preferredStyles.map((style) => (
                        <Badge key={style} variant="outline" className="bg-purple-50 text-purple-700">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Body Type</Label>
                    <p className="text-sm text-muted-foreground mt-1">{stylePreferences.bodyType}</p>
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    Update Preferences
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Style Journey</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Style Exploration</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Color Confidence</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trend Awareness</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />

                  <div className="mt-6 p-3 bg-pink-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-pink-500" />
                      <span className="text-sm font-medium text-pink-700">Style Tip</span>
                    </div>
                    <p className="text-sm text-pink-600 mt-1">
                      Try experimenting with bold patterns to boost your trend awareness!
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="outline" className="w-full justify-start text-muted-foreground">
                      Change Password
                    </Button>
                  </div>

                  <Separator />

                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Style Updates</Label>
                      <p className="text-xs text-muted-foreground">Get notified about new outfit suggestions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Trend Alerts</Label>
                      <p className="text-xs text-muted-foreground">Weekly fashion trend notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-xs text-muted-foreground">Promotional content and special offers</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Credit Reminders</Label>
                      <p className="text-xs text-muted-foreground">Low credit balance notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}