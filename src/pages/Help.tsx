import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MessageCircle, HelpCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useContact } from '@/hooks/useContact';

const HelpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { initiateContact } = useContact();

  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'support@easytorent.com';
  const supportPhone = import.meta.env.VITE_SUPPORT_PHONE || '+91-XXXXXXXXXX';
  const supportWhatsapp = import.meta.env.VITE_SUPPORT_WHATSAPP || 'https://wa.me/+91XXXXXXXXXX';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you! We will get back to you soon.');
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const quickContact = async (type: 'phone' | 'whatsapp' | 'email') => {
    if (type === 'phone') {
      window.location.href = `tel:${supportPhone.replace(/[^0-9]/g, '')}`;
    } else if (type === 'whatsapp') {
      window.open(supportWhatsapp, '_blank');
    } else {
      window.location.href = `mailto:${supportEmail}`;
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="text-center p-12">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <CardTitle className="text-3xl mb-4">Thank You!</CardTitle>
          <CardContent className="text-lg">
            <p>Your message has been sent successfully.</p>
            <p className="mt-4 text-sm text-gray-600">We will respond within 24 hours.</p>
            <Button onClick={() => setSubmitted(false)} className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600">
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
      <div className="text-center mb-16">
        <HelpCircle className="h-24 w-24 text-orange-500 mx-auto mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-4">
          Help & Support
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get help with your account or contact our support team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Quick Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              Quick Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => quickContact('whatsapp')} className="w-full flex items-center gap-3 h-14 bg-green-500 hover:bg-green-600">
              <MessageCircle className="h-5 w-5" />
              WhatsApp Support
            </Button>
            <Button onClick={() => quickContact('phone')} className="w-full flex items-center gap-3 h-14 bg-blue-500 hover:bg-blue-600">
              <Phone className="h-5 w-5" />
              Call Us
            </Button>
            <Button onClick={() => quickContact('email')} className="w-full flex items-center gap-3 h-14 border bg-white hover:bg-gray-50">
              <Mail className="h-5 w-5 text-orange-500" />
              Email Support
            </Button>
            <div className="text-center pt-6 border-t text-sm text-gray-500 space-y-1">
              <div>📧 {supportEmail}</div>
              <div>📞 {supportPhone}</div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <HelpCircle className="h-6 w-6" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">How do I book a PG?</h3>
              <p className="text-sm text-gray-600">Search for PGs, contact owner using call/WhatsApp credits, discuss availability, then use "Book Now" to create booking.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">How to contact PG owner?</h3>
              <p className="text-sm text-gray-600">Purchase call/WhatsApp credits and use the contact buttons. Free first contact for premium users.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">What is the refund policy?</h3>
              <p className="text-sm text-gray-600">Full refund within 24 hours of booking. 50% refund up to 7 days before move-in. No refunds after that.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Is EasyToRent safe?</h3>
              <p className="text-sm text-gray-600">All PGs are verified, owners background checked, secure payments, 24/7 support.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Contact Support</CardTitle>
          <CardDescription>Describe your issue and we'll help you resolve it</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Booking issue, payment problem, etc."
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={5}
                placeholder="Tell us more about your issue..."
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-12 text-lg">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;

