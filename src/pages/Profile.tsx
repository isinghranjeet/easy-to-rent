import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Phone, Mail, MapPin, Heart, Scale3D, Building2, Eye, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const avatarLetter = user.name?.charAt(0)?.toUpperCase() || 'U';
  const joinedDate = new Date(user.joinedDate || user.createdAt).toLocaleDateString();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-4">
          My Profile
        </h1>
        <p className="text-xl text-gray-600">Manage your account information</p>
      </div>

      {/* Profile Header */}
      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <Avatar className="w-32 h-32 ring-4 ring-orange-100">
              <AvatarImage src={user.photo} />
              <AvatarFallback className="w-32 h-32 bg-gradient-to-r from-orange-400 to-orange-500 text-4xl font-bold">
                {avatarLetter}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl">{user.name}</CardTitle>
          <Badge variant={user.role === 'owner' ? 'secondary' : 'default'} className="text-lg px-4 py-2">
            {user.role.toUpperCase()}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail className="h-5 w-5 text-orange-500" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="h-5 w-5 text-orange-500" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-orange-600">{user.wishlistCount || 0}</CardTitle>
            <CardDescription>Wishlist</CardDescription>
          </CardHeader>
          <CardContent>
            <Heart className="h-12 w-12 text-orange-500 mx-auto mb-2 opacity-75" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-orange-600">{user.compareCount || 0}</CardTitle>
            <CardDescription>Compare</CardDescription>
          </CardHeader>
          <CardContent>
            <Scale3D className="h-12 w-12 text-orange-500 mx-auto mb-2 opacity-75" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-gray-900">{joinedDate}</CardTitle>
            <CardDescription>Joined</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar className="h-12 w-12 text-orange-500 mx-auto mb-2 opacity-75" />
          </CardContent>
        </Card>

        {user.lastLogin && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-gray-900">
                {new Date(user.lastLogin).toLocaleString()}
              </CardTitle>
              <CardDescription>Last Login</CardDescription>
            </CardHeader>
            <CardContent>
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-2 opacity-75" />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Owner Stats - Only show for owners */}
      {user.role === 'owner' && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Owner Dashboard Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-1">{user.pgCount || 0}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Total PGs</div>
              </div>
              <div className="text-center p-6 bg-emerald-50 rounded-xl">
                <div className="text-3xl font-bold text-emerald-600 mb-1">{user.verifiedListings || 0}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Verified</div>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600 mb-1">{user.pendingListings || 0}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Pending</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">{user.viewsCount || 0}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Total Views</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <Button className="h-16 text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            Edit Profile
          </Button>
          <Button variant="outline" className="h-16 text-lg font-semibold">
            Change Password
          </Button>
          <Button 
            onClick={handleLogout}
            variant="destructive" 
            className="h-16 text-lg font-semibold"
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

