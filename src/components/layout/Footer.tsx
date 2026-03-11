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
  Users,
  Home,
  Clock,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  CheckCircle,
  X,
  Send,
  Bot,
  Star,
  AlertCircle,
  Copy,
  Paperclip,
  Smile,
  Settings,
  LogOut,
  Maximize2,
  Minimize2,
  Search,
  Volume2,
  VolumeX,
  Trash2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Welcome to EasyToRent Support. How may we assist you with your rental needs today?",
      isAgent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentName: "Riya Sharma | Senior Support",
      status: "online",
      read: true
    }
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const settingsRef = useRef(null);

  // Knowledge base for responses (keeping your existing knowledgeBase object)
  const knowledgeBase = {
    properties: {
      available: "We currently have 156 verified properties available across 8 locations:\n\n• University Area: 42 properties\n• City Center: 38 properties\n• Library Road: 25 properties\n• Sports Complex: 18 properties\n• Girls PG Zone: 15 properties\n• Boys PG Zone: 12 properties\n\nPlease specify your preferences for a refined list.",
      singleRoom: "Single rooms are available from ₹4,500/month. Premium units with attached bathrooms range from ₹8,000 to ₹12,000/month. Standard furnishings include a study table, wardrobe, bed, and Wi-Fi connectivity.",
      sharingRoom: "Shared accommodations (2-4 persons) start from ₹3,500/month per person. These include bunk beds, individual storage, and shared common areas.",
      fullFlat: "Full flats (1BHK to 3BHK) are available from ₹15,000 to ₹35,000/month. Options include fully furnished units with modular kitchens and private balconies."
    },
    pricing: {
      range: "**Price Ranges by Property Type:**\n\n**Single Room:** ₹4,000-15,000/month\n**Sharing Room:** ₹3,000-8,000/month\n**Full Flat:** ₹12,000-40,000/month\n\nSecurity deposit is generally equivalent to one month's rent.",
      deposit: "**Security Deposit Information:**\n\n• Standard: 1 month's rent\n• Premium properties: 2 months\n• Fully refundable with proper notice\n• Official receipt provided"
    },
    locations: {
      university: "**University Area Properties:**\n\nWithin 1km radius:\n• 25 PGs (12 for women, 13 for men)\n• 10 Flats\n• 7 Independent rooms\n\nNearby amenities include library, cafeterias, and medical store.",
      cityCenter: "**City Center Properties:**\n\nCommercial hub with 38 total properties. Features include 24/7 security, shopping access, and metro connectivity. Premium properties start at ₹8,000."
    },
    amenities: {
      included: "**Standard Amenities Included:**\n\n✓ High-speed Wi-Fi\n✓ Electricity & Water\n✓ Weekly Cleaning\n✓ 24/7 Security (CCTV)\n✓ Furniture (bed, wardrobe)\n✓ RO Water\n✓ Power Backup",
      wifi: "**Wi-Fi Specifications:**\n\n• Speed: 50-100 Mbps\n• Unlimited data\n• Router in each room\n• 24/7 technical support"
    },
    booking: {
      visit: "**Property Visit Process:**\n\n1. Select property\n2. Choose date & time\n3. Confirm booking\n4. Visit with agent\n\n**Available Slots:** Mon-Sat, 10 AM - 6 PM",
      process: "**Booking Process:**\n\n1. Shortlist properties\n2. Schedule visit(s)\n3. Meet owners\n4. Finalize selection\n5. Pay booking amount\n6. Sign rental agreement"
    },
    support: {
      contact: "**Contact Options:**\n\n• Phone: +91 93150 58665 (9 AM - 8 PM, Mon-Sat)\n• Email: supporteasytorent@gmail.com (Response within 2 hours)\n• Office: CU Area, Punjab (Prior appointment preferred)"
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Unread messages
  useEffect(() => {
    if (!showChat && chatMessages.length > 1) {
      const unreadAgentMessages = chatMessages.filter(m => m.isAgent && !m.read).length;
      setUnreadCount(unreadAgentMessages);
    }
  }, [chatMessages, showChat]);

  // Close settings when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert("Thank you for subscribing. You will receive property updates and rental insights.");
      setEmail("");
    }
  };

  const handleLiveChat = () => {
    setShowChat(!showChat);
    if (unreadCount > 0) {
      setUnreadCount(0);
      setChatMessages(prev =>
        prev.map(msg => ({ ...msg, read: true }))
      );
    }
    if (!showChat) {
      setIsMinimized(false);
      setShowSettings(false);
    }
  };

  const generateResponse = (message) => {
    const msg = message.toLowerCase();

    if (msg.includes("available") || msg.includes("property") || msg.includes("have")) {
      return knowledgeBase.properties.available;
    }
    else if (msg.includes("single") || msg.includes("alone")) {
      return knowledgeBase.properties.singleRoom;
    }
    else if (msg.includes("sharing") || msg.includes("shared") || msg.includes("roommate")) {
      return knowledgeBase.properties.sharingRoom;
    }
    else if (msg.includes("flat") || msg.includes("apartment") || msg.includes("full")) {
      return knowledgeBase.properties.fullFlat;
    }
    else if (msg.includes("price") || msg.includes("cost") || msg.includes("rent")) {
      return knowledgeBase.pricing.range;
    }
    else if (msg.includes("deposit") || msg.includes("security")) {
      return knowledgeBase.pricing.deposit;
    }
    else if (msg.includes("university") || msg.includes("campus")) {
      return knowledgeBase.locations.university;
    }
    else if (msg.includes("city") || msg.includes("center")) {
      return knowledgeBase.locations.cityCenter;
    }
    else if (msg.includes("amenities") || msg.includes("facilities") || msg.includes("included")) {
      return knowledgeBase.amenities.included;
    }
    else if (msg.includes("wifi") || msg.includes("internet")) {
      return knowledgeBase.amenities.wifi;
    }
    else if (msg.includes("visit") || msg.includes("tour") || msg.includes("view")) {
      return knowledgeBase.booking.visit;
    }
    else if (msg.includes("book") || msg.includes("process") || msg.includes("procedure")) {
      return knowledgeBase.booking.process;
    }
    else if (msg.includes("contact") || msg.includes("call") || msg.includes("phone") || msg.includes("email")) {
      return knowledgeBase.support.contact;
    }
    else if (msg.includes("girl") || msg.includes("women") || msg.includes("female")) {
      return "**Women's PG & Hostel Options:**\n\n• 24/7 Security & CCTV\n• Female Wardens\n• Separate Entry/Exit\n\n**Popular Areas:** University Girls Zone (15 PGs), Library Road (8 PGs)\n**Rent:** ₹4,500 - ₹12,000/month";
    }
    else if (msg.includes("boy") || msg.includes("men") || msg.includes("male")) {
      return "**Men's PG & Hostel Options:**\n\n• Sports Facilities Nearby\n• Study Rooms\n• Gym Access (select properties)\n\n**Popular Areas:** University Area (18 PGs), Sports Complex (12 PGs)\n**Rent:** ₹4,000 - ₹15,000/month";
    }
    else if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
      return "Hello. Thank you for contacting EasyToRent Support. Please specify your requirements such as budget, preferred location, and room type.";
    }
    else if (msg.includes("thank")) {
      return "You are welcome. Please let us know if you require further assistance.";
    }
    else if (msg.includes("help") || msg.includes("assist")) {
      return "I can assist you with property availability, pricing, site visits, amenities, and the booking process. How may I help you today?";
    }
    else {
      return "Thank you for your message. To provide you with accurate information, please specify your budget, preferred location, and room type (single/sharing).";
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newUserMessage = {
      id: chatMessages.length + 1,
      text: userMessage,
      isAgent: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentName: "You",
      read: true
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage("");

    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTyping(false);

    const response = generateResponse(userMessage);

    const agentResponse = {
      id: chatMessages.length + 2,
      text: response,
      isAgent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentName: "Riya Sharma | Senior Support",
      status: "online",
      read: false
    };

    setChatMessages(prev => [...prev, agentResponse]);
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    alert("Message copied to clipboard.");
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
    const fileMessage = {
      id: chatMessages.length + 1,
      text: `📎 Uploaded ${files.length} file(s)`,
      isAgent: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentName: "You",
      isSystem: true
    };
    setChatMessages(prev => [...prev, fileMessage]);
  };

  const clearChat = () => {
    if (window.confirm("Clear all chat messages?")) {
      setChatMessages([
        {
          id: 1,
          text: "Chat history cleared. How may I assist you today?",
          isAgent: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentName: "Riya Sharma | Senior Support",
          status: "online",
          read: true
        }
      ]);
      setAttachments([]);
      setShowSettings(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setShowSettings(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🤔", "😢", "🔥", "✨", "🏠", "💰", "📍", "📞", "✅"];

  const propertyTypes = [
    "Single Room", "Sharing Room", "Full Flat", "Girls PG", "Boys PG"
  ];

  return (
    <>
      <style>
        {`
        .footer-gradient {
          background: linear-gradient(135deg, #0b1120 0%, #0a0f1a 100%);
        }

        .footer-link {
          position: relative;
          display: inline-block;
          transition: all 0.3s ease;
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
          background: rgba(255,255,255,0.02);
        }

        .trust-badge {
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.2);
        }
        
        .newsletter-input {
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        
        .newsletter-input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: #f97316;
        }
        
        /* Chat Window */
        .chat-window {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 400px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
          z-index: 1000;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        
        .chat-window.minimized {
          height: 70px;
          overflow: hidden;
        }
        
        .chat-header {
          background: #1a1f2e;
          color: white;
          padding: 16px 20px;
          cursor: pointer;
          border-bottom: 2px solid #f97316;
        }
        
        .chat-body {
          padding: 20px;
          max-height: 450px;
          overflow-y: auto;
          background: #f8fafc;
        }
        
        /* Message bubbles */
        .message-wrapper {
          margin-bottom: 16px;
        }
        
        .message-bubble {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 12px;
          word-wrap: break-word;
          line-height: 1.5;
          position: relative;
        }
        
        .agent-message {
          background: #ffffff;
          color: #1e293b;
          border-left: 4px solid #f97316;
        }
        
        .user-message {
          background: #f97316;
          color: white;
          margin-left: auto;
        }
        
        .system-message {
          background: #f1f5f9;
          color: #64748b;
          font-style: italic;
          font-size: 12px;
          text-align: center;
          max-width: 100%;
        }
        
        .agent-name {
          font-size: 12px;
          font-weight: 600;
          color: #f97316;
          margin-bottom: 4px;
        }
        
        .agent-status {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          margin-left: 6px;
        }
        
        .message-time {
          font-size: 10px;
          color: #94a3b8;
          margin-top: 6px;
          text-align: right;
        }
        
        .user-message .message-time {
          color: #fef9c3;
        }
        
        .message-actions {
          position: absolute;
          top: -8px;
          right: 0;
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s ease;
          background: white;
          padding: 4px;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .message-bubble:hover .message-actions {
          opacity: 1;
        }
        
        .message-action-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: white;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .message-action-btn:hover {
          background: #f97316;
          color: white;
        }
        
        /* Property chips */
        .property-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 16px 0;
        }
        
        .property-chip {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 13px;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .property-chip:hover {
          background: #f97316;
          border-color: #f97316;
          color: white;
        }
        
        /* Search bar */
        .search-bar {
          margin-bottom: 16px;
          position: relative;
        }
        
        .search-input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 14px;
          background: white;
          color: #1e293b;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #f97316;
        }
        
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        
        /* Typing indicator */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          background: white;
          border-radius: 12px;
          width: fit-content;
          border-left: 4px solid #f97316;
        }
        
        .typing-dot {
          width: 8px;
          height: 8px;
          background: #f97316;
          border-radius: 50%;
          animation: typingBounce 1.4s infinite;
        }
        
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
          40% { transform: scale(1); opacity: 1; }
        }
        
        /* Chat input */
        .chat-input-area {
          padding: 16px 20px;
          background: white;
          border-top: 1px solid #e2e8f0;
          position: relative;
        }
        
        .chat-input-container {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 30px;
          padding: 4px 4px 4px 20px;
          display: flex;
          align-items: center;
          transition: border-color 0.2s ease;
        }
        
        .chat-input-container:focus-within {
          border-color: #f97316;
        }
        
        .chat-input {
          border: none;
          padding: 10px 0;
          font-size: 14px;
          width: 100%;
          background: transparent;
          outline: none;
          color: #0f172a;
          resize: none;
          max-height: 100px;
          font-family: inherit;
        }
        
        .chat-input::placeholder {
          color: #94a3b8;
        }
        
        .input-actions {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        
        .input-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .input-action-btn:hover {
          background: #f1f5f9;
          color: #f97316;
        }
        
        .send-btn {
          background: #f97316;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin-left: 8px;
          transition: all 0.2s ease;
        }
        
        .send-btn:hover:not(:disabled) {
          background: #ea580c;
        }
        
        .send-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }
        
        /* Attachments preview */
        .attachments-preview {
          display: flex;
          gap: 8px;
          padding: 8px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        
        .attachment-badge {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 4px 10px;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        /* Emoji picker */
        .emoji-picker {
          position: absolute;
          bottom: 80px;
          left: 20px;
          background: white;
          border-radius: 16px;
          padding: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 1px solid #e2e8f0;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          z-index: 30;
        }
        
        .emoji-item {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .emoji-item:hover {
          background: #fff7ed;
          transform: scale(1.1);
        }
        
        /* Status indicator */
        .status-indicator {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        
        /* Unread badge */
        .unread-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid white;
        }
        
        /* Live support button */
        .live-support-btn {
          background: #f97316;
          border: none;
          color: white;
          padding: 14px 24px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 25px rgba(249, 115, 22, 0.4);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .live-support-btn:hover {
          background: #ea580c;
          transform: translateY(-2px);
        }
        
        /* Contact panel */
        .contact-panel {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
          border: 1px solid #e2e8f0;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          color: #334155;
          font-size: 13px;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .contact-item:last-child {
          border-bottom: none;
        }
        
        .contact-item a {
          color: #334155;
          text-decoration: none;
        }
        
        .contact-item a:hover {
          color: #f97316;
        }
        
        /* Settings menu - FIXED POSITIONING */
        .settings-menu {
          position: absolute;
          top: 50px;
          right: 20px;
          background: white;
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 1px solid #e2e8f0;
          z-index: 40;
          min-width: 180px;
        }
        
        .settings-item {
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          border-radius: 8px;
          color: #334155;
          font-size: 13px;
          transition: all 0.2s ease;
        }
        
        .settings-item:hover {
          background: #fff7ed;
          color: #f97316;
        }
        
        .settings-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 8px 0;
        }
        
        /* Chat header buttons */
        .header-btn {
          background: transparent;
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        
        .header-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        
        .header-btn.active {
          background: rgba(249, 115, 22, 0.3);
        }
        `}
      </style>

      <footer className="footer-gradient mt-auto text-white">
        <div className="container mx-auto px-4 py-12">

          {/* Trust Badges */}
          <div className="mb-10 rounded-xl trust-badge p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-orange-400" />
                <div>
                  <h4 className="font-semibold">Verified Properties</h4>
                  <p className="text-sm text-gray-400">All listings physically verified</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <UserCheck className="h-8 w-8 text-orange-400" />
                <div>
                  <h4 className="font-semibold">Trusted Owners</h4>
                  <p className="text-sm text-gray-400">Background verified</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-orange-400" />
                <div>
                  <h4 className="font-semibold">Easy Booking</h4>
                  <p className="text-sm text-gray-400">Simple rental process</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 font-bold">
                  EZ
                </div>
                <span className="text-xl font-bold text-orange-400">EasyToRent</span>
              </div>
              <p className="text-sm text-gray-400">
                Verified rental properties near educational institutions.
              </p>
              <div className="flex gap-2">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-orange-500 footer-social"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add your social media links here
                      const socialLinks = [
                        "https://facebook.com/easytorent",
                        "https://twitter.com/easytorent",
                        "https://instagram.com/easytorent",
                        "https://youtube.com/easytorent"
                      ];
                      window.open(socialLinks[i], '_blank');
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links - FIXED WITH CORRECT ROUTES */}
            <div>
              <h4 className="footer-title text-lg font-semibold text-orange-400">Quick Links</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/pg-list" className="footer-link hover:text-orange-400">
                    Find Properties
                  </Link>
                </li>
                <li>
                  <Link to="/register-property" className="footer-link hover:text-orange-400">
                    List Property
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works-page" className="footer-link hover:text-orange-400">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-link hover:text-orange-400">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="footer-link hover:text-orange-400">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="footer-link hover:text-orange-400">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Locations - FIXED WITH FILTER ROUTES */}
            <div>
              <h4 className="footer-title text-lg font-semibold text-orange-400">Popular Locations</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 text-orange-400" />
                  <Link to="/pg-list?location=university-area" className="footer-link hover:text-orange-400">
                    University Area
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 text-orange-400" />
                  <Link to="/pg-list?location=city-center" className="footer-link hover:text-orange-400">
                    City Center
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 text-orange-400" />
                  <Link to="/pg-list?location=library-road" className="footer-link hover:text-orange-400">
                    Library Road
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 text-orange-400" />
                  <Link to="/pg-list?location=sports-complex" className="footer-link hover:text-orange-400">
                    Sports Complex
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 text-orange-400" />
                  <Link to="/pg-list?type=girls-pg" className="footer-link hover:text-orange-400">
                    Girls PG Zone
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 text-orange-400" />
                  <Link to="/pg-list?type=boys-pg" className="footer-link hover:text-orange-400">
                    Boys PG Zone
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact - KEPT SAME BUT ADDED ROUTES */}
            <div>
              <h4 className="footer-title text-lg font-semibold text-orange-400">Contact</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-400">
                <li className="flex gap-2">
                  <MapPin className="h-4 w-4 text-orange-400 flex-shrink-0 mt-1" />
                  <span>Chandigarh University Area, Punjab</span>
                </li>
                <li className="flex gap-2">
                  <Phone className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <a href="tel:+919315058665" className="hover:text-orange-400">+91 93150 58665</a>
                </li>
                <li className="flex gap-2">
                  <Mail className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <a href="mailto:supporteasytorent@gmail.com" className="hover:text-orange-400 break-all">supporteasytorent@gmail.com</a>
                </li>
                <li className="flex gap-2">
                  <Clock className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <span>Mon-Sat: 9 AM - 8 PM</span>
                </li>
              </ul>

              {/* Newsletter */}
              <div className="mt-6">
                <h5 className="mb-2 text-sm font-medium">Stay Updated</h5>
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="newsletter-input w-full rounded-lg border border-white/10 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                    required
                  />
                  <button type="submit" className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium hover:bg-orange-600 transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom Bar - FIXED WITH CORRECT ROUTES */}
          <div className="footer-bottom mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-4 text-sm text-gray-400 md:flex-row">
            <p>&copy; {new Date().getFullYear()} EasyToRent. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-orange-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-orange-400 transition-colors">Terms</Link>
              <Link to="/refund" className="hover:text-orange-400 transition-colors">Refund</Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-indicator"></span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Live Chat Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button onClick={handleLiveChat} className="live-support-btn">
            <MessageSquare className="h-5 w-5" />
            <span>Live Support</span>
          </button>
          {unreadCount > 0 && (
            <div className="unread-badge">{unreadCount}</div>
          )}
        </div>

        {/* Chat Window */}
        {showChat && (
          <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
            <div className="chat-header" onClick={() => setIsMinimized(!isMinimized)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">EasyToRent Support</h3>
                    <div className="flex items-center gap-1 text-xs opacity-90">
                      <span className="status-indicator"></span>
                      <span>Riya Sharma</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setShowSettings(!showSettings);
                      setShowEmojiPicker(false);
                    }} 
                    className={`header-btn ${showSettings ? 'active' : ''}`}
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleMinimize(); }} className="header-btn">
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleLiveChat(); }} className="header-btn">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="chat-body">
                  {/* Search */}
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    <Search className="search-icon h-4 w-4" />
                  </div>

                  {/* Attachments Preview */}
                  {attachments.length > 0 && (
                    <div className="attachments-preview">
                      {attachments.map((file, idx) => (
                        <span key={idx} className="attachment-badge">
                          <Paperclip className="h-3 w-3" />
                          {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Messages */}
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="message-wrapper">
                        <div className="agent-name">
                          {message.agentName}
                          {message.isAgent && <span className="agent-status"></span>}
                        </div>
                        <div className={`message-bubble ${message.isAgent ? 'agent-message' : 'user-message'} ${message.isSystem ? 'system-message' : ''}`}>
                          <div className="whitespace-pre-line text-sm">{message.text}</div>
                          <div className="message-time">{message.time}</div>
                          {message.isAgent && (
                            <div className="message-actions">
                              <button className="message-action-btn" onClick={() => handleCopyMessage(message.text)}>
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="typing-indicator">
                        <span className="text-xs mr-2">Agent is typing</span>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick Options */}
                  <div className="property-chips">
                    {propertyTypes.map((type, idx) => (
                      <button key={idx} className="property-chip" onClick={() => {
                        setUserMessage(type);
                        inputRef.current?.focus();
                      }}>
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Contact Panel */}
                  <div className="contact-panel">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-orange-500" />
                      Direct Contact
                    </h4>
                    <div className="contact-item">
                      <Phone className="h-4 w-4" />
                      <a href="tel:+919315058665">+91 93150 58665</a>
                    </div>
                    <div className="contact-item">
                      <Mail className="h-4 w-4" />
                      <a href="mailto:supporteasytorent@gmail.com">supporteasytorent@gmail.com</a>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="chat-input-area">
                  {/* Settings Menu - FIXED POSITIONING */}
                  {showSettings && (
                    <div className="settings-menu" ref={settingsRef}>
                      <div className="settings-item" onClick={() => setIsMuted(!isMuted)}>
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        <span>{isMuted ? 'Unmute Notifications' : 'Mute Notifications'}</span>
                      </div>
                      <div className="settings-item" onClick={clearChat}>
                        <Trash2 className="h-4 w-4" />
                        <span>Clear Chat History</span>
                      </div>
                      <div className="settings-divider"></div>
                      <div className="settings-item" onClick={handleLiveChat}>
                        <LogOut className="h-4 w-4" />
                        <span>Close Chat</span>
                      </div>
                    </div>
                  )}

                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="emoji-picker">
                      {emojis.map((emoji, idx) => (
                        <button
                          key={idx}
                          className="emoji-item"
                          onClick={() => {
                            setUserMessage(prev => prev + emoji);
                            setShowEmojiPicker(false);
                            inputRef.current?.focus();
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="chat-input-container">
                    <textarea
                      ref={inputRef}
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      className="chat-input"
                      rows={1}
                    />
                    <div className="input-actions">
                      <button 
                        className="input-action-btn"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <Smile className="h-4 w-4" />
                      </button>
                      <button 
                        className="input-action-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        multiple
                      />
                    </div>
                    <button 
                      onClick={handleSendMessage} 
                      className="send-btn" 
                      disabled={!userMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </footer>
    </>
  );
}