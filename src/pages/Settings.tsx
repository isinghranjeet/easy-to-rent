import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Settings, Moon, Sun, Bell, Shield, User, Lock, LogOut } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    // TODO: Call change password API
    toast.success('Password updated');
    setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // TODO: Call updateProfile API
      toast.success('Profile updated');
      updateUser(formData);
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-4">
          Settings
        </h1>
        <p className="text-xl text-gray-600">Manage your preferences and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Settings
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-2"
              />
            </div>
            <Button onClick={handleSaveProfile} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Dark Mode
                </Label>
                <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
              </div>
              <Switch 
                checked={isDark}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </Label>
                <p className="text-sm text-gray-500">Receive emails about wishlist and bookings</p>
              </div>
              <Switch 
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                Update Password
              </Button>
            </form>
            <Button variant="outline" className="w-full">
              Logout from All Devices
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <LogOut className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-orange-700">
              These actions cannot be undone. This will permanently delete your account and remove all data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
              Delete Account
            </Button>
            <p className="text-xs text-orange-700 mt-2 text-center">
              Account deletion is permanent and cannot be recovered.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

