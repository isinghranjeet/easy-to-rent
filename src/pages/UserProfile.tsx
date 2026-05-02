/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/UserProfile.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Settings, 
  Lock, 
  Camera, 
  FileText, 
  CreditCard, 
  Heart, 
  Bell, 
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Shield,
  Moon,
  Sun,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { ChangePasswordModal } from '@/components/profile/ChangePasswordModal';
import { BookingHistory } from '@/components/profile/BookingHistory';
import { PaymentHistory } from '@/components/profile/PaymentHistory';
import { NotificationSettings } from '@/components/profile/NotificationSettings';

type TabType = 'overview' | 'edit' | 'password' | 'bookings' | 'payments' | 'favorites' | 'notifications' | 'support';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card className="text-center p-8">
          <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <CardTitle className="text-xl mb-2">Login Required</CardTitle>
          <CardContent>
            <p className="text-muted-foreground mb-6">Please login to view your profile</p>
            <Link to="/login">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600">
                Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const avatarLetter = user.name?.charAt(0)?.toUpperCase() || 'U';
  const joinedDate = new Date(user.joinedDate || user.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const menuItems = [
    { id: 'overview' as TabType, label: 'Overview', icon: User, color: 'text-orange-500' },
    { id: 'edit' as TabType, label: 'Edit Profile', icon: Settings, color: 'text-blue-500' },
    { id: 'password' as TabType, label: 'Change Password', icon: Lock, color: 'text-purple-500' },
    { id: 'bookings' as TabType, label: 'Booking History', icon: FileText, color: 'text-green-500' },
    { id: 'payments' as TabType, label: 'Payment History', icon: CreditCard, color: 'text-indigo-500' },
    { id: 'favorites' as TabType, label: 'Saved Favorites', icon: Heart, color: 'text-red-500' },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell, color: 'text-yellow-500' },
    { id: 'support' as TabType, label: 'Support', icon: HelpCircle, color: 'text-gray-500' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab user={user} avatarLetter={avatarLetter} joinedDate={joinedDate} onEditProfile={() => setShowEditModal(true)} onChangePassword={() => setShowPasswordModal(true)} />;
      case 'edit':
        return <EditProfileModal open={showEditModal} onOpenChange={setShowEditModal} user={user} onUpdate={updateUser} />;
      case 'password':
        return <ChangePasswordModal open={showPasswordModal} onOpenChange={setShowPasswordModal} />;
      case 'bookings':
        return <BookingHistory />;
      case 'payments':
        return <PaymentHistory />;
      case 'favorites':
        return <div className="text-center py-12"><Heart className="h-16 w-16 text-red-500 mx-auto mb-4" /><h2 className="text-2xl font-bold mb-2">Saved Favorites</h2><p className="text-muted-foreground mb-6">View your saved properties</p><Link to="/wishlist"><Button className="bg-gradient-to-r from-orange-500 to-orange-600">View Wishlist</Button></Link></div>;
      case 'notifications':
        return <NotificationSettings />;
      case 'support':
        return <div className="text-center py-12"><HelpCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" /><h2 className="text-2xl font-bold mb-2">Support</h2><p className="text-muted-foreground mb-6">Get help with your account</p><Link to="/help"><Button className="bg-gradient-to-r from-orange-500 to-orange-600">Contact Support</Button></Link></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <h1 className="text-lg font-bold">My Profile</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <aside className={`lg:w-64 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-24">
              {/* Profile Preview */}
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-14 h-14 ring-2 ring-orange-100">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback className="bg-gradient-to-r from-orange-400 to-orange-500 font-bold">
                      {avatarLetter}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Badge variant={user.role === 'owner' ? 'secondary' : 'default'} className="w-full justify-center">
                  {user.role?.toUpperCase()}
                </Badge>
              </CardContent>
              
              <div className="border-t">
                <nav className="p-2 space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        activeTab === item.id 
                          ? 'bg-orange-50 text-orange-700' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </nav>
              </div>
              
              <CardContent className="pt-0">
                <Button 
                  variant="destructive" 
                  className="w-full mt-4"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {loading ? 'Logging out...' : 'Logout'}
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal 
        open={showEditModal} 
        onOpenChange={setShowEditModal} 
        user={user} 
        onUpdate={updateUser} 
      />
      <ChangePasswordModal 
        open={showPasswordModal} 
        onOpenChange={setShowPasswordModal} 
      />
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ 
  user, 
  avatarLetter, 
  joinedDate, 
  onEditProfile, 
  onChangePassword 
}: { 
  user: any; 
  avatarLetter: string; 
  joinedDate: string;
  onEditProfile: () => void;
  onChangePassword: () => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 ring-4 ring-orange-100">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="w-24 h-24 bg-gradient-to-r from-orange-400 to-orange-500 text-4xl font-bold">
                  {avatarLetter}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <Badge variant={user.role === 'owner' ? 'secondary' : 'default'} className="mt-2">
                {user.role?.toUpperCase()}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Member since {joinedDate}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={onEditProfile} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button onClick={onChangePassword} variant="outline">
                <Lock className="h-4 w-4 mr-2" />
                Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Mail className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Phone className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}
            {user.address && (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg md:col-span-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{user.address}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Account Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">{user.wishlistCount || 0}</p>
              <p className="text-sm text-muted-foreground">Wishlist</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{user.bookingCount || 0}</p>
              <p className="text-sm text-muted-foreground">Bookings</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{user.compareCount || 0}</p>
              <p className="text-sm text-muted-foreground">Compare</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{user.contactCount || 0}</p>
              <p className="text-sm text-muted-foreground">Contacts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/bookings">
                <FileText className="h-6 w-6" />
                <span>Bookings</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/payments">
                <CreditCard className="h-6 w-6" />
                <span>Payments</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/wishlist">
                <Heart className="h-6 w-6" />
                <span>Favorites</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/settings">
                <Bell className="h-6 w-6" />
                <span>Alerts</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
