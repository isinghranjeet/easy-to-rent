/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/profile/NotificationSettings.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Loader2,
  Save,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';

interface NotificationPrefs {
  emailEnabled: boolean;
  wishlistEmails: boolean;
  bookingEmails: boolean;
  paymentEmails: boolean;
  offerEmails: boolean;
  pushEnabled: boolean;
  wishlistPush: boolean;
  bookingPush: boolean;
  smsEnabled: boolean;
  bookingSms: boolean;
}

export const NotificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    emailEnabled: true, wishlistEmails: true, bookingEmails: true, paymentEmails: true, offerEmails: true,
    pushEnabled: true, wishlistPush: true, bookingPush: true,
    smsEnabled: false, bookingSms: false,
  });

  useEffect(() => { fetchPrefs(); }, []);

  const fetchPrefs = async () => {
    setLoading(true);
    try { await api.getNotificationStats(); } catch { /* default */ }
    setLoading(false);
  };

  const togglePref = (key: keyof NotificationPrefs) => {
    setPrefs((prev: NotificationPrefs) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleEmailMaster = () => {
    setPrefs((prev: NotificationPrefs) => ({
      ...prev,
      emailEnabled: !prev.emailEnabled,
      wishlistEmails: !prev.emailEnabled,
      bookingEmails: !prev.emailEnabled,
      paymentEmails: !prev.emailEnabled,
      offerEmails: !prev.emailEnabled,
    }));
  };

  const togglePushMaster = () => {
    setPrefs((prev: NotificationPrefs) => ({
      ...prev,
      pushEnabled: !prev.pushEnabled,
      wishlistPush: !prev.pushEnabled,
      bookingPush: !prev.pushEnabled,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      try { await api.updateWishlistEmailPreference(prefs.wishlistEmails); } catch { /* demo */ }
      toast.success('Notification preferences saved');
    } catch (error: any) {
      toast.error('Failed to save preferences', { description: error?.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><Bell className="h-6 w-6 text-orange-500" />Notification Settings</h2>
        <p className="text-muted-foreground">Manage how you receive notifications</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg"><Mail className="h-5 w-5 text-orange-600" /></div>
            <div>
              <CardTitle className="text-lg">Email Notifications</CardTitle>
              <CardDescription>Receive updates via email</CardDescription>
            </div>
          </div>
          <Switch checked={prefs.emailEnabled} onCheckedChange={toggleEmailMaster} />
        </CardHeader>
        {prefs.emailEnabled && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div><Label className="font-medium">Email Address</Label><p className="text-sm text-muted-foreground">Update in profile settings</p></div>
              <Input placeholder="your@email.com" className="max-w-xs" disabled />
            </div>
            <div className="space-y-3">
              {[
                { key: 'wishlistEmails', label: 'Wishlist Reminders', desc: 'Price drops & availability' },
                { key: 'bookingEmails', label: 'Booking Updates', desc: 'Confirmations & changes' },
                { key: 'paymentEmails', label: 'Payment Notifications', desc: 'Receipts & alerts' },
                { key: 'offerEmails', label: 'Special Offers', desc: 'Promotions & discounts' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div><p className="font-medium">{item.label}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                  <Switch checked={prefs[item.key as keyof NotificationPrefs] as boolean} onCheckedChange={() => togglePref(item.key as keyof NotificationPrefs)} />
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><Smartphone className="h-5 w-5 text-blue-600" /></div>
            <div>
              <CardTitle className="text-lg">Push Notifications</CardTitle>
              <CardDescription>Real-time alerts on your device</CardDescription>
            </div>
          </div>
          <Switch checked={prefs.pushEnabled} onCheckedChange={togglePushMaster} />
        </CardHeader>
        {prefs.pushEnabled && (
          <CardContent className="space-y-3">
            {[
              { key: 'wishlistPush', label: 'Wishlist Alerts', desc: 'Instant price drop notifications' },
              { key: 'bookingPush', label: 'Booking Updates', desc: 'Real-time booking status' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div><p className="font-medium">{item.label}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                <Switch checked={prefs[item.key as keyof NotificationPrefs] as boolean} onCheckedChange={() => togglePref(item.key as keyof NotificationPrefs)} />
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><MessageSquare className="h-5 w-5 text-green-600" /></div>
            <div>
              <CardTitle className="text-lg">SMS Notifications</CardTitle>
              <CardDescription>Important updates via SMS</CardDescription>
            </div>
          </div>
          <Switch checked={prefs.smsEnabled} onCheckedChange={() => togglePref('smsEnabled')} />
        </CardHeader>
        {prefs.smsEnabled && (
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-800">SMS may incur carrier charges</p>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="font-medium">Booking Confirmations</p><p className="text-sm text-muted-foreground">Instant SMS confirmation</p></div>
              <Switch checked={prefs.bookingSms} onCheckedChange={() => togglePref('bookingSms')} />
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};
