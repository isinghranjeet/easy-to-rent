import { useState, useRef, useEffect } from "react";
import { footerStyles } from "./footer/footerStyles";
import { FooterMainContent, type FooterLocation } from "./footer/FooterMainContent";
import { FooterChatWidget } from "./footer/FooterChatWidget";

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
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // State for popular locations
  const [popularLocations, setPopularLocations] = useState<FooterLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Fetch popular locations from API
  useEffect(() => {
    const fetchPopularLocations = async () => {
      try {
        setLoadingLocations(true);
        
        // Try to fetch from API first
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eassy-to-rent-backend.onrender.com/api';
        const response = await fetch(`${API_BASE_URL}/locations/popular?limit=8`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            setPopularLocations(data.data);
            return;
          }
        }
        
        // Fallback to real database data (from your MongoDB)
        setPopularLocations([
          { _id: '1', name: 'Chandigarh', slug: 'chandigarh', pgCount: 7 },
          { _id: '2', name: 'kharar', slug: 'kharar', pgCount: 2 },
          { _id: '3', name: 'chandigarh university gate no 3', slug: 'chandigarh-university-gate-3', pgCount: 1 },
          { _id: '4', name: 'Ropar', slug: 'ropar', pgCount: 1 },
        ]);
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Use real database data as fallback
        setPopularLocations([
          { _id: '1', name: 'Chandigarh', slug: 'chandigarh', pgCount: 7 },
          { _id: '2', name: 'kharar', slug: 'kharar', pgCount: 2 },
          { _id: '3', name: 'chandigarh university gate no 3', slug: 'chandigarh-university-gate-3', pgCount: 1 },
          { _id: '4', name: 'Ropar', slug: 'ropar', pgCount: 1 },
        ]);
      } finally {
        setLoadingLocations(false);
      }
    };
    
    fetchPopularLocations();
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Knowledge base for responses
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
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showChat) {
        setShowChat(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showChat]);

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  const generateResponse = (message: string) => {
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

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Message copied to clipboard.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🤔", "😢", "🔥", "✨", "🏠", "💰", "📍", "📞", "✅"];
  const propertyTypes = ["Single Room", "Sharing Room", "Full Flat", "Girls PG", "Boys PG"];

  return (
    <>
      <style>{footerStyles}</style>

      <footer className="footer-gradient mt-auto text-white">
        <FooterMainContent
          email={email}
          setEmail={setEmail}
          handleNewsletterSubmit={handleNewsletterSubmit}
          loadingLocations={loadingLocations}
          popularLocations={popularLocations}
        />
        <FooterChatWidget
          showChat={showChat}
          unreadCount={unreadCount}
          isMinimized={isMinimized}
          showSettings={showSettings}
          showEmojiPicker={showEmojiPicker}
          isTyping={isTyping}
          isMuted={isMuted}
          userMessage={userMessage}
          searchTerm={searchTerm}
          attachments={attachments}
          chatMessages={chatMessages}
          propertyTypes={propertyTypes}
          emojis={emojis}
          isMobile={isMobile}
          chatRef={chatRef}
          chatEndRef={chatEndRef}
          inputRef={inputRef}
          fileInputRef={fileInputRef}
          settingsRef={settingsRef}
          handleLiveChat={handleLiveChat}
          toggleMinimize={toggleMinimize}
          clearChat={clearChat}
          handleCopyMessage={handleCopyMessage}
          handleFileUpload={handleFileUpload}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
          setShowSettings={setShowSettings}
          setIsMuted={setIsMuted}
          setShowEmojiPicker={setShowEmojiPicker}
          setUserMessage={setUserMessage}
          setSearchTerm={setSearchTerm}
        />
      </footer>
    </>
  );
}