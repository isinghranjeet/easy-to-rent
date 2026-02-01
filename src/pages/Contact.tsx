import { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  MapPin, Phone, Mail, Clock, Send, MessageSquare, 
  HelpCircle, Building, UserCheck, Shield, FileText,
  Map, Globe, Facebook, Twitter, Instagram, Linkedin,
  CheckCircle, AlertCircle, Loader2, Copy, Calendar,
  X, Upload, MessageCircle, ExternalLink,
  Navigation, Maximize2, Minimize2, MessageCircleMore,
  Route, Navigation2, MapPinned, PhoneCall, MessageSquareText
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

// Mock contact form submission function
const mockSubmitContactForm = async (data: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log('Contact Form Submission:', data);
  
  return {
    success: true,
    message: 'Message sent successfully',
    submissionId: `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
};

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  phone: z.string().trim().min(10, 'Valid phone number is required').max(15, 'Phone number is too long'),
  subject: z.string().trim().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().trim().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
  enquiryType: z.string().min(1, 'Please select enquiry type'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to our privacy policy',
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Mock CAPTCHA component
const MockCAPTCHA = ({ onChange }: { onChange: (token: string | null) => void }) => {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    const token = `mock-captcha-token-${Date.now()}`;
    setIsVerified(true);
    onChange(token);
    toast.success('Security verification completed');
  };

  const handleReset = () => {
    setIsVerified(false);
    onChange(null);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-gray-900">Security Verification</span>
        </div>
        <span className="text-xs text-gray-500">Privacy • Terms</span>
      </div>
      <div className="border-t pt-3">
        {!isVerified ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-400 rounded-sm"></div>
              <span className="text-sm text-gray-700">Confirm you are not a robot</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-orange-600 rounded"></div>
              <div className="w-5 h-5 bg-red-600 rounded"></div>
              <div className="w-5 h-5 bg-yellow-500 rounded"></div>
              <div className="w-5 h-5 bg-green-600 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-900">Verified</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-600">
              Reset
            </Button>
          </div>
        )}
        {!isVerified && (
          <Button
            variant="outline"
            className="w-full mt-3 border-gray-300 hover:border-orange-400 hover:text-orange-600"
            onClick={handleVerify}
          >
            Verify Security Check
          </Button>
        )}
      </div>
    </div>
  );
};

// WhatsApp Button Component
const WhatsAppButton = () => {
  const whatsappNumber = '9315058665';
  const defaultMessage = encodeURIComponent('Hello, I need assistance with PG accommodation near Chandigarh University.');
  
  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-40"
      title="Contact via WhatsApp"
    >
      <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.52 3.49C18.18 1.13 15.19 0 12 0A12 12 0 0 0 0 12c0 2.07.55 4.06 1.59 5.77L0 24l6.33-1.55A12 12 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.25-6.19-3.48-8.51zM12 22c-1.92 0-3.78-.55-5.38-1.58l-.39-.24-3.95 1 1.06-3.85-.25-.39A10 10 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.53-14.2c-.15-.25-.54-.27-.77-.15-2.1 1.04-4.87 1.3-6.85.48-2.02-.83-3.69-2.96-3.8-3.1-.1-.14-.3-.2-.5-.2-.2 0-.4.1-.5.2-.1.14-.8 1.1-.8 2.64 0 1.54 1.1 3.06 1.25 3.27.15.2 2.16 3.24 5.26 4.5 3.1 1.26 3.1.84 3.65.78.56-.07 1.8-.73 2.05-1.44.25-.7.25-1.3.18-1.44-.08-.14-.23-.22-.38-.27z"/>
      </svg>
    </a>
  );
};

// Distance Calculator Component
const DistanceCalculator = () => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // Chandigarh University Coordinates
  const cuCoords = { lat: 30.7067, lng: 76.7180 };

  const calculateDistance = () => {
    if (!userLocation) {
      getCurrentLocation();
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const R = 6371; // Earth's radius in km
      const dLat = (cuCoords.lat - userLocation.lat) * Math.PI / 180;
      const dLon = (cuCoords.lng - userLocation.lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(cuCoords.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const calculatedDistance = R * c;
      
      setDistance(calculatedDistance.toFixed(1));
      setIsLoading(false);
      
      toast.success('Distance calculated successfully');
    }, 1500);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        toast.success('Location detected successfully');
        calculateDistance();
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLoading(false);
        toast.error('Unable to retrieve your location. Please enable location services.');
      }
    );
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${cuCoords.lat},${cuCoords.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
            <Route className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Distance from Chandigarh University</h3>
            <p className="text-sm text-sky-600">Calculate your current distance</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMapExpanded(!isMapExpanded)}
          className="text-gray-600 hover:text-orange-600"
        >
          {isMapExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className={`transition-all duration-300 ${isMapExpanded ? 'h-64' : 'h-48'} mb-4`}>
        <div className="h-full bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg overflow-hidden border border-gray-200 relative">
          {/* Map Placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <MapPinned className="h-12 w-12 text-orange-600/30 mb-4" />
            <div className="text-center mb-4">
              <p className="font-medium text-gray-900 mb-1">Chandigarh University</p>
              <p className="text-sm text-sky-600">Gharuan, Mohali, Punjab</p>
            </div>
            
            {userLocation && (
              <div className="flex items-center gap-2 text-sm text-sky-600 bg-white/80 px-3 py-2 rounded-lg">
                <Navigation2 className="h-4 w-4 text-green-600" />
                <span>Your location detected</span>
              </div>
            )}
          </div>
          
          {/* Distance Indicator */}
          {distance && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <Navigation className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-sky-600">Distance to CU</p>
                  <p className="text-lg font-semibold text-gray-900">{distance} km</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {distance ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Distance Calculated</p>
                <p className="text-sm text-sky-600 mt-1">
                  You are approximately {distance} km from Chandigarh University.
                  {parseFloat(distance) < 5 && " You're in the immediate vicinity."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Location Detection Required</p>
                <p className="text-sm text-sky-600 mt-1">
                  Enable location services to calculate distance and find nearby PG accommodations.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={calculateDistance}
            disabled={isLoading}
            className="flex-1 min-w-[140px] gap-2 bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Navigation2 className="h-4 w-4" />
                {distance ? 'Recalculate' : 'Calculate Distance'}
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={openGoogleMaps}
            className="flex-1 min-w-[140px] gap-2 border-orange-300 hover:border-orange-400 hover:bg-orange-50 text-gray-700 hover:text-orange-600"
          >
            <Map className="h-4 w-4" />
            View on Maps
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-sky-600 mb-3">Nearby PG Accommodations</p>
          <div className="flex flex-wrap gap-2">
            {['Within 1km', '1-3km', '3-5km', '5-10km'].map((range) => (
              <Button
                key={range}
                variant="ghost"
                size="sm"
                className="text-xs text-sky-600 hover:bg-orange-50 hover:text-orange-600"
                onClick={() => toast.info(`Searching for PGs ${range} from CU`)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    enquiryType: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [estimatedResponseTime, setEstimatedResponseTime] = useState('1-2 business hours');
  const [contactPreferences, setContactPreferences] = useState({
    email: true,
    phone: false,
    whatsapp: true,
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const validateField = (field: keyof ContactFormData, value: any) => {
    try {
      contactSchema.shape[field].parse(value);
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0].message }));
      }
    }
  };

  const handleChange = (field: keyof ContactFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + uploadedFiles.length > 3) {
      toast.error('Maximum 3 files allowed');
      return;
    }

    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Files must be less than 5MB each');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.error('Only PDF, JPG, PNG, and DOC files are allowed');
      return;
    }

    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.info('File removed');
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success(`${label} copied to clipboard`);
    }
  };

  const handleScheduleCallback = () => {
    toast.success('Callback scheduled successfully', {
      description: 'Our representative will contact you tomorrow between 10:00 AM - 12:00 PM.',
      duration: 5000,
    });
  };

  // WhatsApp Send Function
  const sendViaWhatsApp = () => {
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      
      const firstError = Object.keys(fieldErrors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus();
      }
      
      toast.error('Please correct the errors in the form before sending');
      return;
    }

    const phoneNumber = '9315058665';
    const message = encodeURIComponent(
      `*New Inquiry from CU PG Finder Website*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Inquiry Type:* ${formData.enquiryType}\n` +
      `*Subject:* ${formData.subject}\n\n` +
      `*Message:*\n${formData.message}\n\n` +
      `*Contact Preferences:*\n` +
      `- Email: ${contactPreferences.email ? 'Yes' : 'No'}\n` +
      `- Phone: ${contactPreferences.phone ? 'Yes' : 'No'}\n` +
      `- WhatsApp: ${contactPreferences.whatsapp ? 'Yes' : 'No'}\n\n` +
      `*Submitted:* ${new Date().toLocaleString()}`
    );

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    toast.success('Opening WhatsApp to send your inquiry', {
      description: 'Your message has been prepared for WhatsApp.',
      duration: 5000,
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      enquiryType: '',
      consent: false,
    });
    setUploadedFiles([]);
    setCaptchaToken(null);
  };

  const faqTopics = [
    { title: 'Booking Process', icon: MessageSquare, id: 'booking' },
    { title: 'Payment Methods', icon: FileText, id: 'payment' },
    { title: 'PG Verification', icon: Shield, id: 'verification' },
    { title: 'Refund Policy', icon: CheckCircle, id: 'refund' },
  ];

  const handleFAQClick = (id: string) => {
    toast.info(`Redirecting to FAQ: ${faqTopics.find(f => f.id === id)?.title}`, {
      description: 'Opening relevant FAQ section...',
      action: {
        label: 'View',
        onClick: () => window.open(`/faq#${id}`, '_blank'),
      },
    });
  };

  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'bot', message: 'Welcome to CU PG Finder Support. How may I assist you today?', time: '10:00 AM' },
    { id: 2, sender: 'bot', message: 'I can help with PG listings, bookings, payments, or any accommodation-related queries.', time: '10:00 AM' },
  ]);

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    const userMessage = {
      id: chatHistory.length + 1,
      sender: 'user',
      message: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    
    setTimeout(() => {
      const responses = [
        "Thank you for your message. Our support team will review your query and respond shortly.",
        "I have noted your enquiry. Could you provide more specific details about your PG accommodation requirements?",
        "For detailed information on this topic, please refer to our FAQ section or contact our support team directly.",
        "Your query has been forwarded to a specialist who will assist with your specific accommodation needs.",
      ];
      
      const botResponse = {
        id: chatHistory.length + 2,
        sender: 'bot',
        message: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory(prev => [...prev, botResponse]);
    }, 1000);
  };

  const socialLinks = [
    { platform: 'Facebook', icon: Facebook, url: 'https://facebook.com', color: 'hover:bg-orange-50 hover:text-orange-600' },
    { platform: 'Twitter', icon: Twitter, url: 'https://twitter.com', color: 'hover:bg-orange-50 hover:text-orange-600' },
    { platform: 'Instagram', icon: Instagram, url: 'https://instagram.com', color: 'hover:bg-orange-50 hover:text-orange-600' },
    { platform: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com', color: 'hover:bg-orange-50 hover:text-orange-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      
      const firstError = Object.keys(fieldErrors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus();
      }
      
      toast.error('Please correct the errors in the form');
      return;
    }

    if (!captchaToken) {
      toast.error('Please complete the security verification');
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        contactPreferences,
        uploadedFiles: uploadedFiles.map(f => f.name),
        captchaToken,
        timestamp: new Date().toISOString(),
      };

      const response = await mockSubmitContactForm(submissionData);

      if (response.success) {
        setShowSuccessModal(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          enquiryType: '',
          consent: false,
        });
        setUploadedFiles([]);
        setCaptchaToken(null);

        toast.success('Message sent successfully', {
          description: `Reference ID: ${response.submissionId}`,
          duration: 5000,
        });

        setTimeout(() => {
          toast.info('Confirmation email sent', {
            description: 'Please check your email for submission confirmation.',
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateResponseTime = (type: string) => {
    const times: Record<string, string> = {
      'general': '24 hours',
      'booking': '2-4 hours',
      'urgent': '1-2 hours',
      'support': '4-6 hours',
      'listing': '12 hours',
    };
    setEstimatedResponseTime(times[type] || '24 hours');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const event = {
        target: {
          files: e.dataTransfer.files
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleFileUpload(event);
      e.dataTransfer.clearData();
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Corporate Office',
      content: 'Chandigarh University Campus, Gharuan, Mohali, Punjab - 140413',
      action: () => {
        window.open('https://www.google.com/maps/place/Chandigarh+University/', '_blank');
      },
      actionText: 'View Location',
    },
    {
      icon: Phone,
      title: 'Support Helpline',
      content: '+91 93150 58665',
      action: () => copyToClipboard('+919315058665', 'Support number'),
      actionText: 'Copy Number',
    },
    {
      icon: Mail,
      title: 'Email Support',
      content: 'support@cupgfinder.com',
      action: () => copyToClipboard('support@cupgfinder.com', 'Email address'),
      actionText: 'Copy Email',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Monday - Sunday: 8:00 AM - 10:00 PM',
      subcontent: 'Emergency support available 24/7',
    },
    {
      icon: UserCheck,
      title: 'Personal Consultation',
      content: 'Schedule one-on-one consultation',
      action: handleScheduleCallback,
      actionText: 'Schedule Now',
    },
  ];

  const LiveChatWidget = () => (
    <div className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <MessageSquareText className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Support Assistant</h3>
              <p className="text-xs text-sky-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online - Quick response
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChatOpen(false)}
            className="h-8 w-8 p-0 text-gray-500 hover:text-orange-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-lg p-3 ${
              msg.sender === 'user'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs opacity-70 mt-1">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Type your message here..."
            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            className="flex-1 focus:border-orange-400 focus:ring-orange-400"
          />
          <Button 
            onClick={sendChatMessage}
            disabled={!chatMessage.trim()}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 hero-gradient opacity-95" />
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Floating Elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />

          <div className="container relative mx-auto px-4">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-orange-400/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-up border border-orange-400/20">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse-soft" />
                <span className="text-orange-600 text-sm font-medium">
                  #1 PG Finder for CU Students
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Contact Our Professional Team
              </h1>
              <p className="text-gray-700 text-lg mb-8">
                We provide comprehensive support for PG accommodation needs near Chandigarh University. 
                Our dedicated team is available to assist you with bookings, inquiries, and personalized consultations.
              </p>
              <div className="flex flex-wrap gap-3">
                {faqTopics.map((topic) => (
                  <Button
                    key={topic.id}
                    variant="secondary"
                    className="bg-white/10 backdrop-blur-sm border-orange-400/20 text-gray-700 hover:bg-orange-50 hover:text-orange-600 gap-2"
                    onClick={() => handleFAQClick(topic.id)}
                  >
                    <topic.icon className="h-4 w-4" />
                    {topic.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Contact Info & Distance Calculator */}
              <div className="space-y-8">
                {/* Contact Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b">
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    {contactInfo.map((item) => (
                      <div key={item.title} className="p-3 hover:bg-orange-50 rounded-lg transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                            <item.icon className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                            <p className="text-sky-600 text-sm mb-1 truncate">{item.content}</p>
                            {item.subcontent && (
                              <p className="text-sky-500 text-xs">{item.subcontent}</p>
                            )}
                            {item.action && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-orange-600 hover:text-orange-700 mt-2 -ml-2"
                                onClick={item.action}
                              >
                                {item.actionText}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Social Media */}
                  <div className="mt-8 pt-6 border-t">
                    <h4 className="font-medium text-gray-900 mb-4">Connect With Us</h4>
                    <div className="flex gap-2">
                      {socialLinks.map((social) => (
                        <Button
                          key={social.platform}
                          variant="outline"
                          size="icon"
                          className={`w-9 h-9 rounded-lg border-gray-300 ${social.color}`}
                          onClick={() => window.open(social.url, '_blank')}
                          title={social.platform}
                        >
                          <social.icon className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Distance Calculator */}
                <DistanceCalculator />
              </div>

              {/* Right Column - Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Send Your Inquiry
                      </h2>
                      <p className="text-sky-600">
                        We typically respond within{' '}
                        <span className="font-semibold text-orange-600">{estimatedResponseTime}</span>
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm text-sky-600 bg-orange-50 px-3 py-1 rounded-full">
                      <Shield className="h-4 w-4" />
                      <span>Secure & Confidential</span>
                    </div>
                  </div>
                  
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="mb-2 block text-gray-700">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          className={`focus:border-orange-400 focus:ring-orange-400 ${errors.name ? 'border-red-500' : ''}`}
                          disabled={isSubmitting}
                        />
                        {errors.name && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email" className="mb-2 block text-gray-700">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="Enter your email address"
                          className={`focus:border-orange-400 focus:ring-orange-400 ${errors.email ? 'border-red-500' : ''}`}
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone" className="mb-2 block text-gray-700">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+91 12345 67890"
                          className={`focus:border-orange-400 focus:ring-orange-400 ${errors.phone ? 'border-red-500' : ''}`}
                          disabled={isSubmitting}
                        />
                        {errors.phone && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="enquiryType" className="mb-2 block text-gray-700">
                          Inquiry Type *
                        </Label>
                        <select
                          id="enquiryType"
                          value={formData.enquiryType}
                          onChange={(e) => {
                            handleChange('enquiryType', e.target.value);
                            calculateResponseTime(e.target.value);
                          }}
                          className={`w-full px-3 py-2 border rounded-md bg-white focus:border-orange-400 focus:ring-orange-400 ${
                            errors.enquiryType ? 'border-red-500' : 'border-gray-300'
                          } disabled:opacity-50`}
                          disabled={isSubmitting}
                        >
                          <option value="">Select inquiry type</option>
                          <option value="general">General Inquiry</option>
                          <option value="booking">Booking Assistance</option>
                          <option value="urgent">Urgent Support</option>
                          <option value="support">Technical Support</option>
                          <option value="listing">List Your PG</option>
                        </select>
                        {errors.enquiryType && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.enquiryType}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="mb-2 block text-gray-700">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        placeholder="Enter subject of your inquiry"
                        className={`focus:border-orange-400 focus:ring-orange-400 ${errors.subject ? 'border-red-500' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.subject && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message" className="mb-2 block text-gray-700">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="Please provide detailed information about your inquiry..."
                        rows={5}
                        className={`min-h-[120px] focus:border-orange-400 focus:ring-orange-400 ${errors.message ? 'border-red-500' : ''}`}
                        disabled={isSubmitting}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.message ? (
                          <p className="text-red-600 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.message}
                          </p>
                        ) : (
                          <p className="text-sky-600 text-sm">
                            {formData.message.length}/1000 characters
                          </p>
                        )}
                      </div>
                    </div>

                    {/* File Upload */}
                    <div>
                      <Label className="mb-2 block text-gray-700">Attachments (Optional)</Label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          uploadedFiles.length > 0 ? 'border-orange-200 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          id="file-upload"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          ref={fileInputRef}
                          disabled={isSubmitting}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer block">
                          <div className="space-y-3">
                            <Upload className="h-10 w-10 mx-auto text-gray-400" />
                            <div>
                              <p className="text-sm text-sky-600">
                                <span className="text-orange-600 font-medium">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-sky-600/80 mt-1">
                                Maximum 3 files, 5MB each (PDF, JPG, PNG, DOC)
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-sky-600">Uploaded files:</p>
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                              <div className="flex items-center gap-3 min-w-0">
                                <FileText className="h-4 w-4 text-sky-600 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-sm truncate text-gray-900">{file.name}</p>
                                  <p className="text-xs text-sky-600/80">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="h-8 w-8 p-0 text-sky-600 hover:text-red-600"
                                disabled={isSubmitting}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contact Preferences */}
                    <div>
                      <Label className="mb-3 block text-gray-700">Preferred Contact Method</Label>
                      <div className="flex flex-wrap gap-4">
                        {Object.entries(contactPreferences).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <Checkbox
                              id={`pref-${key}`}
                              checked={value}
                              onCheckedChange={(checked) =>
                                setContactPreferences(prev => ({
                                  ...prev,
                                  [key]: checked as boolean,
                                }))
                              }
                              disabled={isSubmitting}
                              className="text-orange-600 border-gray-300"
                            />
                            <Label 
                              htmlFor={`pref-${key}`} 
                              className="capitalize text-sky-600 cursor-pointer text-sm"
                            >
                              {key === 'whatsapp' ? 'WhatsApp' : key}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CAPTCHA */}
                    <div>
                      <MockCAPTCHA onChange={setCaptchaToken} />
                    </div>

                    {/* Consent Checkbox */}
                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => handleChange('consent', checked)}
                        disabled={isSubmitting}
                        className="mt-1 text-orange-600 border-gray-300"
                      />
                      <div>
                        <Label htmlFor="consent" className="text-gray-700 text-sm">
                          I agree to the processing of my personal data in accordance with your privacy policy
                        </Label>
                        <p className="text-xs text-sky-600 mt-1">
                          By submitting this form, you acknowledge that your information will be used to respond to 
                          your inquiry and may be stored in accordance with our{' '}
                          <a 
                            href="/privacy" 
                            className="text-orange-600 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Privacy Policy
                          </a>.
                        </p>
                      </div>
                    </div>
                    {errors.consent && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.consent}
                      </p>
                    )}

                    {/* Submit Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting || !captchaToken || !formData.consent}
                        className="w-full gap-2 h-12 bg-orange-600 hover:bg-orange-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing Submission...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Send Inquiry (Email)
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        size="lg"
                        onClick={sendViaWhatsApp}
                        disabled={!formData.consent}
                        className="w-full gap-2 h-12 bg-[#25D366] hover:bg-[#128C7E]"
                      >
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.52 3.49C18.18 1.13 15.19 0 12 0A12 12 0 0 0 0 12c0 2.07.55 4.06 1.59 5.77L0 24l6.33-1.55A12 12 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.25-6.19-3.48-8.51zM12 22c-1.92 0-3.78-.55-5.38-1.58l-.39-.24-3.95 1 1.06-3.85-.25-.39A10 10 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.53-14.2c-.15-.25-.54-.27-.77-.15-2.1 1.04-4.87 1.3-6.85.48-2.02-.83-3.69-2.96-3.8-3.1-.1-.14-.3-.2-.5-.2-.2 0-.4.1-.5.2-.1.14-.8 1.1-.8 2.64 0 1.54 1.1 3.06 1.25 3.27.15.2 2.16 3.24 5.26 4.5 3.1 1.26 3.1.84 3.65.78.56-.07 1.8-.73 2.05-1.44.25-.7.25-1.3.18-1.44-.08-.14-.23-.22-.38-.27z"/>
                        </svg>
                        Send via WhatsApp
                      </Button>
                    </div>
                  </form>

                  {/* Additional Information */}
                  <div className="mt-8 pt-6 border-t space-y-3">
                    <p className="flex items-center gap-2 text-sm text-sky-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      All communications are encrypted and secure
                    </p>
                    <p className="flex items-center gap-2 text-sm text-sky-600">
                      <Clock className="h-4 w-4 text-orange-600" />
                      Average response time: {estimatedResponseTime}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-sky-600">
                      <PhoneCall className="h-4 w-4 text-purple-600" />
                      Immediate assistance: +91 93150 58665
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating Buttons */}
      <WhatsAppButton />
      
      {/* Live Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-24 w-14 h-14 bg-orange-600 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-40"
        title="Live Chat Support"
      >
        <MessageCircleMore className="h-6 w-6 text-white" />
      </button>

      {/* Live Chat Widget */}
      {isChatOpen && <LiveChatWidget />}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6 border border-green-200">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Inquiry Submitted Successfully
              </h3>
              <p className="text-sky-600 mb-6">
                Thank you for contacting CU PG Finder. We have received your inquiry and will 
                respond within{' '}
                <span className="font-semibold text-orange-600">{estimatedResponseTime}</span>.
              </p>
              <div className="space-y-4">
                <div className="text-sm text-sky-600 bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4" />
                    Confirmation email has been sent to your registered email address
                  </p>
                  <p className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    We will contact you via your preferred communication method
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-sky-600 hover:text-orange-600 hover:border-orange-400"
                    onClick={() => setShowSuccessModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                    onClick={() => {
                      setShowSuccessModal(false);
                      window.location.href = '/';
                    }}
                  >
                    Return to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;