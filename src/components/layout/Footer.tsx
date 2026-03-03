import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Shield,
  Wifi,
  Users,
  DollarSign,
  Home,
  Clock,
  MessageSquare,
  ChevronRight,
  Award,
  CreditCard,
  ShieldCheck,
  UserCheck,
  HelpCircle,
  Calendar,
  Building,
  CheckCircle,
  X,
  Send,
  User,
  Smartphone,
  Bed,
  Bath,
  Key,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      text: "Hello! Welcome to EasyToRent. I'm Riya, your rental assistant. How can I help you find your perfect home today?", 
      isAgent: true, 
      time: "Just now",
      agentName: "Riya (Support Agent)"
    }
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState("online"); // online, away, offline
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Simulate unread messages when chat is closed
  useEffect(() => {
    if (!showChat && chatMessages.length > 1) {
      setUnreadCount(prev => prev + 1);
    }
  }, [chatMessages, showChat]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Newsletter subscription:", email);
      alert("✅ Thank you for subscribing! You'll receive property updates and tips.");
      setEmail("");
    }
  };

  const handleLiveChat = () => {
    setShowChat(!showChat);
    if (unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  const simulateTyping = () => {
    setIsTyping(true);
    return new Promise(resolve => setTimeout(resolve, 1500));
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    
    // Add user message
    const newUserMessage = {
      id: chatMessages.length + 1,
      text: userMessage,
      isAgent: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentName: "You"
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage("");
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate agent typing delay
    await simulateTyping();
    
    setIsTyping(false);
    
    // Add agent response
    const agentResponse = {
      id: chatMessages.length + 2,
      text: getAutoResponse(userMessage),
      isAgent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentName: "Riya (Support Agent)"
    };
    
    setChatMessages(prev => [...prev, agentResponse]);
  };

  const getAutoResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes("available") || msg.includes("vacant") || msg.includes("empty")) {
      return "We have several verified properties available right now! 🏠 I can filter by your preferences:\n• Budget range\n• Location preference\n• Room type (single/sharing)\n• Required amenities\n\nWhat's your priority?";
    } 
    else if (msg.includes("price") || msg.includes("cost") || msg.includes("rent") || msg.includes("₹")) {
      return "💰 Rent varies by location and amenities:\n• Basic rooms: ₹4,000 - ₹6,000/month\n• Standard rooms: ₹6,000 - ₹9,000/month\n• Premium rooms: ₹9,000 - ₹15,000/month\n\nMost include WiFi, electricity, and cleaning. Security deposit is usually one month's rent.";
    } 
    else if (msg.includes("visit") || msg.includes("tour") || msg.includes("see")) {
      return "📍 Property visits can be scheduled:\n📅 Days: Monday to Saturday\n⏰ Time: 10 AM - 6 PM\n\nI can help you book a slot! Please provide:\n1. Preferred date\n2. Time slot\n3. Property reference (if any)\n\nWould you like me to check availability?";
    }
    else if (msg.includes("deposit") || msg.includes("security") || msg.includes("advance")) {
      return "🔐 Security deposit guidelines:\n• Typically one month's rent\n• Fully refundable upon vacating\n• Proper receipt provided\n• No hidden charges\n\n💡 Tip: Always get a written agreement and payment receipt!";
    }
    else if (msg.includes("contact") || msg.includes("owner") || msg.includes("landlord")) {
      return "👤 Owner contact is shared after:\n1. You express serious interest\n2. Visit is scheduled\n3. Basic verification is done\n\nWe ensure only genuine inquiries reach our verified owners. Your privacy is protected!";
    }
    else if (msg.includes("wifi") || msg.includes("internet") || msg.includes("amenit")) {
      return "📶 Common amenities included:\n✓ High-speed WiFi\n✓ Electricity & water\n✓ Cleaning service\n✓ Security\n✓ Furniture (bed, wardrobe)\n✓ Some include meals\n\nAny specific amenity you're looking for?";
    }
    else if (msg.includes("girl") || msg.includes("ladies") || msg.includes("female")) {
      return "👩‍🎓 We have verified girls' PGs with:\n• 24/7 security & CCTV\n• Female wardens\n• Separate entry/exit\n• Hygienic facilities\n• Curfew flexibility\n\nWould you like to see available options?";
    }
    else if (msg.includes("boy") || msg.includes("male") || msg.includes("guys")) {
      return "👨‍🎓 Boys' PGs available with:\n• Sports facilities nearby\n• Study rooms\n• Gym access (some)\n• Food options\n• Transport connectivity\n\nShall I show you the listings?";
    }
    else if (msg.includes("thank") || msg.includes("thanks")) {
      return "You're welcome! 😊 Happy to help. Is there anything else you'd like to know about finding your perfect rental?";
    }
    else if (msg.includes("help") || msg.includes("assistance") || msg.includes("support")) {
      return "I'm here to help! I can assist with:\n• Finding available properties\n• Price comparison\n• Visit scheduling\n• Owner contact\n• Rental agreement guidance\n• Amenities information\n\nWhat do you need help with?";
    }
    else {
      return "Thanks for your message! I'll connect you with a specialized agent who can help with this. Meanwhile, here are quick options:\n1️⃣ View available properties\n2️⃣ Check rent ranges\n3️⃣ Schedule property visit\n4️⃣ Speak with owner\n\nWhich would you prefer?";
    }
  };

  const handleQuickQuestion = async (question) => {
    setUserMessage(question);
    // Auto-send after a brief delay
    setTimeout(() => {
      if (userMessage === question) {
        handleSendMessage();
      }
    }, 500);
  };

  const quickQuestions = [
    { text: "Show available properties", icon: "🏠" },
    { text: "What's the rent range?", icon: "💰" },
    { text: "Schedule property visit", icon: "📅" },
    { text: "Girls PG options?", icon: "👩" },
    { text: "Boys PG options?", icon: "👨" },
    { text: "Amenities included?", icon: "✅" }
  ];

  const propertyTypes = [
    { icon: <Bed className="h-4 w-4" />, text: "Single Room" },
    { icon: <Users className="h-4 w-4" />, text: "Sharing Room" },
    { icon: <Home className="h-4 w-4" />, text: "Full Flat" },
    { icon: <Bath className="h-4 w-4" />, text: "Attached Bath" }
  ];

  return (
    <>
      {/* ================= CUSTOM CSS ================= */}
      <style>
        {`
        .footer-gradient {
          background: linear-gradient(
            135deg,
            hsl(220 15% 12%) 0%,
            hsl(220 15% 8%) 100%
          );
        }

        .footer-link {
          position: relative;
          display: inline-block;
          transition: color 0.3s ease;
        }

        .footer-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0%;
          height: 2px;
          background: #f97316;
          transition: width 0.3s ease;
        }

        .footer-link:hover::after {
          width: 100%;
        }

        .footer-social {
          transition: all 0.3s ease;
        }

        .footer-social:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 18px rgba(249, 115, 22, 0.6);
        }

        .footer-title {
          position: relative;
          padding-bottom: 8px;
        }

        .footer-title::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 40px;
          height: 3px;
          background: #f97316;
          border-radius: 999px;
        }

        .footer-bottom {
          backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.03);
        }

        /* Trust badges */
        .trust-badge {
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.08) 100%);
          border: 1px solid rgba(249, 115, 22, 0.3);
        }
        
        /* Newsletter input */
        .newsletter-input {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }
        
        /* Feature badges */
        .feature-badge {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Enhanced Live Chat Window */
        .chat-window {
          position: fixed;
          bottom: 90px;
          right: 16px;
          width: calc(100vw - 32px);
          max-width: 380px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(249, 115, 22, 0.25);
          z-index: 1000;
          overflow: hidden;
          animation: slideUp 0.3s ease;
          border: 2px solid #fb923c;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .chat-header {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          padding: 18px 20px;
        }
        
        .chat-body {
          padding: 20px;
          max-height: 500px;
          overflow-y: auto;
          background: #fffaf5;
        }
        
        /* Message bubbles */
        .message-bubble {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 18px;
          margin-bottom: 12px;
          word-wrap: break-word;
          line-height: 1.5;
          position: relative;
        }
        
        .agent-message {
          background: #fed7aa;
          color: #7c2d12;
          border-bottom-left-radius: 4px;
          align-self: flex-start;
          border-left: 4px solid #f97316;
        }
        
        .user-message {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          border-bottom-right-radius: 4px;
          align-self: flex-end;
          margin-left: auto;
          border-right: 4px solid #ea580c;
        }
        
        .agent-name {
          font-size: 12px;
          font-weight: 600;
          color: #9a3412;
          margin-bottom: 4px;
        }
        
        .message-time {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 6px;
          text-align: right;
        }
        
        /* Quick questions */
        .quick-question-btn {
          background: white;
          border: 2px solid #fdba74;
          border-radius: 24px;
          padding: 10px 16px;
          margin: 6px 4px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }
        
        .quick-question-btn:hover {
          background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
          border-color: #f97316;
          color: #7c2d12;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
        }
        
        /* Chat input */
        .chat-input-container {
          background: white;
          border: 2px solid #fdba74;
          border-radius: 24px;
          padding: 6px 6px 6px 16px;
          display: flex;
          align-items: center;
          margin-top: 16px;
        }
        
        .chat-input {
          border: none;
          padding: 8px 0;
          font-size: 14px;
          width: 100%;
          resize: none;
          background: transparent;
          outline: none;
        }
        
        .send-btn {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        
        .send-btn:hover {
          background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(234, 88, 12, 0.4);
        }
        
        /* Typing indicator */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          background: #fed7aa;
          border-radius: 18px;
          width: fit-content;
          margin-bottom: 12px;
        }
        
        .typing-dot {
          width: 8px;
          height: 8px;
          background: #9a3412;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
          40% { transform: scale(1); opacity: 1; }
        }
        
        /* Property type chips */
        .property-chip {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border: 1px solid #fdba74;
          border-radius: 20px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #7c2d12;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .property-chip:hover {
          background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
        }
        
        /* Status indicator */
        .status-indicator {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 6px;
          background-color: #22c55e;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
        
        /* Unread badge */
        .unread-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          animation: bounce 0.5s ease;
        }
        
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        /* Payment method */
        .payment-method {
          transition: all 0.3s ease;
        }
        
        .payment-method:hover {
          filter: brightness(1.2);
          transform: translateY(-2px);
        }
      `}
      </style>

      {/* ================= FOOTER ================= */}
      <footer className="footer-gradient mt-auto text-white">
        <div className="container mx-auto px-4 py-14">
          
          {/* TRUST BADGES/VERIFICATION SECTION */}
          <div className="mb-10 rounded-2xl trust-badge p-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-orange-400" />
                <div>
                  <h4 className="font-semibold">Verified Properties</h4>
                  <p className="text-sm text-gray-400">All listings are physically verified</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <UserCheck className="h-8 w-8 text-orange-400" />
                <div>
                  <h4 className="font-semibold">Trusted Owners</h4>
                  <p className="text-sm text-gray-400">Background verified property owners</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-orange-400" />
                <div>
                  <h4 className="font-semibold">Easy Booking Process</h4>
                  <p className="text-sm text-gray-400">Simple and transparent rental process</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            {/* BRAND */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 font-bold text-lg shadow-lg">
                  EZ
                </div>
                <span className="text-xl font-bold text-orange-400">EasyToRent</span>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed">
                Your trusted platform for finding safe, verified, and affordable rental properties near educational institutions.
              </p>

              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="footer-social flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-orange-500"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Connecting to our ${Icon.name} page...`);
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="footer-title text-lg font-semibold text-orange-400">
                Quick Links
              </h4>
              <ul className="mt-5 space-y-2 text-sm text-gray-400">
                {["Find Properties", "List Property", "How It Works", "Contact Us", "FAQs", "Blog"].map((item) => (
                  <li key={item}>
                    <Link 
                      to={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="footer-link hover:text-orange-400"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Navigating to ${item} section...`);
                      }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* PROPERTY FEATURES */}
              <div className="mt-6">
                <h5 className="mb-3 text-sm font-medium text-gray-300">Popular Amenities</h5>
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Wifi, label: "High-Speed WiFi" },
                    { icon: Users, label: "Room Sharing" },
                    { icon: DollarSign, label: "Affordable" },
                    { icon: Home, label: "Fully Furnished" },
                    { icon: Clock, label: "24/7 Security" },
                    { icon: Shield, label: "Safe & Secure" }
                  ].map((feature, idx) => (
                    <div key={idx} className="feature-badge flex items-center gap-1 rounded-full px-3 py-1 text-xs">
                      <feature.icon className="h-3 w-3 text-orange-400" />
                      <span>{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* POPULAR LOCATIONS */}
            <div>
              <h4 className="footer-title text-lg font-semibold text-orange-400">
                Popular Locations
              </h4>
              <ul className="mt-5 space-y-2 text-sm text-gray-400">
                {["University Area", "City Center", "Library Road", "Sports Complex", "Girls PG Zone", "Boys PG Zone", "Food Street", "Market Area"].map((area) => (
                  <li key={area} className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-orange-400" />
                    <Link 
                      to={`/location/${area.toLowerCase().replace(/\s+/g, '-')}`}
                      className="footer-link hover:text-orange-400"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Showing properties in ${area}...`);
                      }}
                    >
                      {area}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT & NEWSLETTER */}
            <div>
              <h4 className="footer-title text-lg font-semibold text-orange-400">
                Contact Information
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-gray-400">
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 text-orange-400" />
                  <span>Head Office: Chandigarh University Area, Punjab</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 text-orange-400" />
                  <a href="tel:+919315058665" className="hover:text-orange-400">
                    +91 9315058665 (Support)
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 text-orange-400" />
                  <a href="mailto:support@easytorent.com" className="hover:text-orange-400">
                    support@easytorent.com
                  </a>
                </li>
                <li className="flex gap-3">
                  <Calendar className="h-5 w-5 text-orange-400" />
                  <span>Mon-Sat: 9 AM - 8 PM</span>
                </li>
              </ul>
              
              {/* NEWSLETTER SIGNUP */}
              <div className="mt-6">
                <h5 className="mb-3 text-sm font-medium text-gray-300">
                  Stay Updated
                </h5>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="newsletter-input w-full rounded-lg border border-white/10 px-4 py-2 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 font-medium text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/25"
                  >
                    <Mail className="h-4 w-4" />
                    Subscribe to Newsletter
                  </button>
                </form>
                <p className="mt-2 text-xs text-gray-500">
                  Get property alerts and rental tips
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="mt-10 border-t border-white/10 pt-8">
            <h5 className="mb-4 text-center text-sm font-medium text-gray-300">
              Payment Options
            </h5>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="payment-method flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2">
                <CreditCard className="h-5 w-5 text-orange-400" />
                <span className="text-sm">Cash/Cheque Accepted</span>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-gray-500">
              We recommend meeting in person for transactions and obtaining proper receipts
            </p>
          </div>

          {/* BOTTOM BAR */}
          <div className="footer-bottom mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-5 text-sm text-gray-400 md:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <p>&copy; {new Date().getFullYear()} EasyToRent. All rights reserved.</p>
              
              {/* LEGAL LINKS */}
              <div className="flex gap-4">
                <Link 
                  to="/privacy" 
                  className="hover:text-orange-400"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Privacy Policy - We value your privacy and protect your data.");
                  }}
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms" 
                  className="hover:text-orange-400"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Terms of Service - Please read our terms carefully.");
                  }}
                >
                  Terms of Service
                </Link>
                <Link 
                  to="/refund" 
                  className="hover:text-orange-400"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Refund Policy - Our policies ensure fair transactions.");
                  }}
                >
                  Refund Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="status-indicator"></span>
              <span className="text-sm">24/7 Support Available</span>
            </div>
          </div>
          
          {/* VISITOR COUNTER */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Over 2,500 successful rentals facilitated this year</span>
            </span>
          </div>
        </div>

        {/* ENHANCED LIVE CHAT SUPPORT */}
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={handleLiveChat}
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-500/30"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="hidden sm:inline">Live Support</span>
            <span className="status-indicator ml-1"></span>
          </button>
          
          {/* Unread message badge */}
          {unreadCount > 0 && (
            <div className="unread-badge">
              {unreadCount}
            </div>
          )}
        </div>

        {/* ENHANCED CHAT WINDOW */}
        {showChat && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">EasyToRent Support</h3>
                    <div className="flex items-center">
                      <span className="status-indicator"></span>
                      <span className="text-sm opacity-90">Riya is online • 2 min response</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowChat(false)}
                  className="text-white hover:text-orange-200 text-2xl transition-transform hover:scale-110"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="chat-body" ref={chatContainerRef}>
              {/* Welcome message */}
              <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 text-sm text-orange-800">
                  <span className="font-medium">💬 How can we help you find your perfect home?</span>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="flex flex-col space-y-3 mb-4">
                {chatMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message-bubble ${message.isAgent ? 'agent-message' : 'user-message'}`}
                  >
                    {message.isAgent && message.agentName && (
                      <div className="agent-name">{message.agentName}</div>
                    )}
                    <div className="whitespace-pre-line">{message.text}</div>
                    <div className="message-time">{message.time}</div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="typing-indicator">
                    <span className="agent-name">Riya is typing</span>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>
              
              {/* Property Type Chips */}
              <div className="mb-4">
                <p className="mb-3 text-sm font-medium text-gray-700">Looking for:</p>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map((type, idx) => (
                    <div 
                      key={idx}
                      className="property-chip"
                      onClick={() => handleQuickQuestion(type.text)}
                    >
                      {type.icon}
                      <span>{type.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Questions */}
              <div className="mb-4">
                <p className="mb-3 text-sm font-medium text-gray-700">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(question.text)}
                      className="quick-question-btn"
                    >
                      <span>{question.icon}</span>
                      <span>{question.text}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="mt-4">
                <div className="chat-input-container">
                  <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message here... (Press Enter to send)"
                    className="chat-input"
                    rows={2}
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="send-btn"
                    disabled={!userMessage.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Quick Tips */}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <Key className="h-3 w-3" />
                  <span>Tip: Be specific about budget, location, and preferences</span>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="mt-6 pt-4 border-t border-orange-200">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-orange-500" />
                  <a href="tel:+919315058665" className="font-medium text-orange-600 hover:text-orange-700">
                    +91 9315058665
                  </a>
                  <span className="text-gray-400">•</span>
                  <Mail className="h-4 w-4 text-orange-500" />
                  <a href="mailto:support@easytorent.com" className="font-medium text-orange-600 hover:text-orange-700">
                    support@easytorent.com
                  </a>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Need immediate assistance? Call us directly for faster response.
                </p>
              </div>
            </div>
          </div>
        )}
      </footer>
    </>
  );
}