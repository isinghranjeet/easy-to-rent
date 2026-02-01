import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Search, HelpCircle, MessageSquare, Phone, Mail, 
  Shield, Star, Users, Home, CreditCard, MapPin,
  Calendar, FileText, ThumbsUp, ChevronRight,
  ChevronDown, ChevronUp, ExternalLink, BookOpen, 
  Filter, TrendingUp, MessageCircle, AlertCircle, X
} from 'lucide-react';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  const [popularFaqs, setPopularFaqs] = useState<number[]>([]);
  const [helpfulCounts, setHelpfulCounts] = useState<{[key: number]: number}>({});

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle, count: 10 },
    { id: 'booking', label: 'Booking Process', icon: Calendar, count: 2 },
    { id: 'verification', label: 'Verification', icon: Shield, count: 3 },
    { id: 'payment', label: 'Payment & Fees', icon: CreditCard, count: 2 },
    { id: 'locations', label: 'Locations', icon: MapPin, count: 1 },
    { id: 'account', label: 'Account & Listings', icon: Users, count: 2 },
  ];

  const faqs = [
    {
      id: 1,
      question: 'How does CU PG Finder verify listings?',
      answer: 'Our team personally visits each property to verify the amenities, safety measures, and overall condition. We also verify the property owner\'s documents and conduct background checks to ensure your safety. Each listing goes through a 20-point verification checklist before being published.',
      category: 'verification',
      tags: ['verification', 'safety', 'trust'],
      related: [2, 7],
      lastUpdated: '2024-01-15',
      helpful: 42,
    },
    {
      id: 2,
      question: 'Is there any fee to use CU PG Finder?',
      answer: 'No, CU PG Finder is completely free for students. We don\'t charge any brokerage or service fees. Our revenue comes from property owners who list their PGs on our platform. You only pay the rent directly to the property owner, with no hidden charges.',
      category: 'payment',
      tags: ['free', 'pricing', 'no-brokerage'],
      related: [1, 9],
      lastUpdated: '2024-01-10',
      helpful: 38,
    },
    {
      id: 3,
      question: 'How can I book a PG through your platform?',
      answer: 'Simply browse our listings, find a PG you like, and click "Contact Owner" to connect directly with the property owner. You can then schedule a visit and finalize the booking directly with them. We recommend viewing the property in person before making any payments.',
      category: 'booking',
      tags: ['booking', 'contact', 'process'],
      related: [2, 4],
      lastUpdated: '2024-01-12',
      helpful: 31,
    },
    {
      id: 4,
      question: 'What if I face issues after moving in?',
      answer: 'We have a dedicated support team to help you resolve any issues. You can contact us through our helpline or email, and we\'ll mediate with the property owner to resolve your concerns. We also provide documentation support for rental agreements.',
      category: 'account',
      tags: ['support', 'issues', 'help'],
      related: [3, 10],
      lastUpdated: '2024-01-05',
      helpful: 29,
    },
    {
      id: 5,
      question: 'Can I compare different PGs?',
      answer: 'Yes! You can add up to 3 PGs to your compare list by clicking the compare icon on any listing. This lets you see a side-by-side comparison of prices, amenities, and features. The comparison tool helps you make informed decisions.',
      category: 'account',
      tags: ['compare', 'features', 'decision'],
      related: [3, 6],
      lastUpdated: '2024-01-08',
      helpful: 35,
    },
    {
      id: 6,
      question: 'How do I save PGs for later?',
      answer: 'Click the heart icon on any PG listing to add it to your wishlist. You can access your saved PGs anytime from the wishlist page. You can also create multiple wishlists for different locations or requirements.',
      category: 'account',
      tags: ['wishlist', 'save', 'bookmark'],
      related: [5, 7],
      lastUpdated: '2024-01-03',
      helpful: 27,
    },
    {
      id: 7,
      question: 'Are the reviews on your platform genuine?',
      answer: 'Yes, all reviews are from verified students who have actually stayed at the PG. We have strict moderation to prevent fake reviews and ensure authenticity. Each review goes through a verification process before being published.',
      category: 'verification',
      tags: ['reviews', 'trust', 'verification'],
      related: [1, 8],
      lastUpdated: '2024-01-14',
      helpful: 41,
    },
    {
      id: 8,
      question: 'How often is the availability updated?',
      answer: 'Property owners update their availability in real-time. However, we recommend contacting the owner to confirm current availability before planning your visit. We also show "Last Updated" timestamps on each listing.',
      category: 'booking',
      tags: ['availability', 'real-time', 'updates'],
      related: [3, 7],
      lastUpdated: '2024-01-09',
      helpful: 24,
    },
    {
      id: 9,
      question: 'Can I list my PG on your platform?',
      answer: 'Yes! If you\'re a property owner, you can contact us to list your PG. Our team will visit your property for verification before it goes live on the platform. We offer different listing packages to suit your needs.',
      category: 'verification',
      tags: ['listing', 'owners', 'verification'],
      related: [1, 2],
      lastUpdated: '2024-01-11',
      helpful: 33,
    },
    {
      id: 10,
      question: 'What areas do you cover?',
      answer: 'We currently cover all areas within 2km of the CU campus, including popular locations like Gate 1 area, Library Road, Sports Complex, and Admin Block vicinity. New areas are added based on student demand.',
      category: 'locations',
      tags: ['locations', 'coverage', 'campus'],
      related: [4, 8],
      lastUpdated: '2024-01-07',
      helpful: 36,
    },
  ];

  // Popular guides and tips
  const guides = [
    {
      title: 'How to Choose the Perfect PG',
      description: 'A step-by-step guide to selecting the right accommodation',
      icon: Home,
      link: '/guides/choosing-pg',
    },
    {
      title: 'Rental Agreement Checklist',
      description: 'Important points to check before signing any agreement',
      icon: FileText,
      link: '/guides/rental-checklist',
    },
    {
      title: 'Safety Tips for Students',
      description: 'Essential safety measures when living in a PG',
      icon: Shield,
      link: '/guides/safety-tips',
    },
    {
      title: 'Budget Planning Guide',
      description: 'How to manage your accommodation budget effectively',
      icon: CreditCard,
      link: '/guides/budget-planning',
    },
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Initialize helpful counts and popular FAQs
  useEffect(() => {
    const initialCounts: {[key: number]: number} = {};
    faqs.forEach(faq => {
      initialCounts[faq.id] = faq.helpful;
    });
    setHelpfulCounts(initialCounts);

    // Set popular FAQs (top 3 by helpful count)
    const popularIds = [...faqs]
      .sort((a, b) => b.helpful - a.helpful)
      .slice(0, 3)
      .map(faq => faq.id);
    setPopularFaqs(popularIds);
  }, []);

  const handleHelpfulClick = (faqId: number) => {
    setHelpfulCounts(prev => ({
      ...prev,
      [faqId]: (prev[faqId] || 0) + 1
    }));
  };

  const toggleFaq = (faqId: number) => {
    setExpandedFaqs(prev =>
      prev.includes(faqId)
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    );
  };

  const handleContactAction = (action: string) => {
    switch (action) {
      case 'call':
        window.location.href = 'tel:+919315058665'; // Updated phone number
        break;
      case 'email':
        window.location.href = 'mailto:support@cupgfinder.com';
        break;
      case 'chat':
        alert('Live chat will open soon!');
        break;
    }
  };

  const supportPhone = '+91-9876543210'; // Kept for display purposes only
  const supportEmail = 'support@cupgfinder.com';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50/50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section with Search */}
        <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-orange-50 via-amber-50/60 to-yellow-50/40">
          <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/15 rounded-full blur-3xl" />
          
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full border border-orange-200 mb-6">
                <HelpCircle className="h-3 w-3" />
                <span className="text-sm font-medium">Help Center</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                How can we help you
                <span className="block text-orange-600 mt-2">today?</span>
              </h1>
              
              <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Find answers to common questions about using CU PG Finder. Search or browse by category.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-12">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for questions, topics, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 bg-white mt-2 rounded-xl shadow-2xl border border-gray-200 z-50 p-2">
                    <div className="text-sm text-gray-500 px-3 py-2">
                      {filteredFaqs.length} results for "{searchQuery}"
                    </div>
                    {filteredFaqs.slice(0, 3).map(faq => (
                      <button
                        key={faq.id}
                        onClick={() => {
                          const element = document.getElementById(`faq-${faq.id}`);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                            setExpandedFaqs(prev => [...prev, faq.id]);
                          }
                        }}
                        className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="font-medium text-gray-900">{faq.question}</div>
                        <div className="text-sm text-gray-500 truncate">{faq.answer.substring(0, 60)}...</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{faqs.length}</div>
                  <div className="text-sm text-gray-500">FAQs Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-gray-500">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">98%</div>
                  <div className="text-sm text-gray-500">Issue Resolution Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">&lt;2h</div>
                  <div className="text-sm text-gray-500">Avg Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/90">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Filter by:</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-200">
                <span className="text-sm font-medium">{filteredFaqs.length} questions found</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                      activeCategory === category.id
                        ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-200'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{category.label}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                      activeCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main FAQ Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left Column - FAQ List */}
              <div className="lg:col-span-2">
                {searchQuery && filteredFaqs.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No results found for "{searchQuery}"
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Try searching with different keywords or browse our categories.
                    </p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Popular FAQs */}
                    {activeCategory === 'all' && popularFaqs.length > 0 && (
                      <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                          <TrendingUp className="h-5 w-5 text-amber-500" />
                          <h2 className="font-display text-2xl font-bold text-gray-900">
                            Most Popular Questions
                          </h2>
                        </div>
                        <div className="space-y-4">
                          {faqs
                            .filter(faq => popularFaqs.includes(faq.id))
                            .map(faq => (
                              <div
                                key={faq.id}
                                className="bg-gradient-to-r from-amber-50 to-amber-50/50 rounded-2xl p-6 border border-amber-100"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full border border-amber-200 text-xs">
                                        <Star className="h-3 w-3 fill-amber-500" />
                                        Popular
                                      </div>
                                      <div className="inline-flex items-center px-2 py-1 bg-white text-gray-600 rounded-full border border-gray-200 text-xs">
                                        {faq.tags[0]}
                                      </div>
                                    </div>
                                    <h3 className="font-display font-semibold text-lg text-gray-900 mb-3">
                                      {faq.question}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                      {faq.answer}
                                    </p>
                                  </div>
                                  <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                                  <div className="flex items-center gap-4">
                                    <button
                                      onClick={() => handleHelpfulClick(faq.id)}
                                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600"
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                      <span>Helpful ({helpfulCounts[faq.id] || faq.helpful})</span>
                                    </button>
                                    <span className="text-sm text-gray-400">
                                      Updated {faq.lastUpdated}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const element = document.getElementById(`faq-${faq.id}`);
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                        setExpandedFaqs(prev => [...prev, faq.id]);
                                      }
                                    }}
                                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                  >
                                    Read Full Answer
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* All FAQs */}
                    <div>
                      <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">
                        {activeCategory === 'all' ? 'All Questions' : 
                         categories.find(c => c.id === activeCategory)?.label}
                      </h2>
                      <div className="space-y-4">
                        {filteredFaqs.map((faq) => (
                          <div
                            key={faq.id}
                            id={`faq-${faq.id}`}
                            className="bg-white rounded-2xl px-6 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                          >
                            <button
                              onClick={() => toggleFaq(faq.id)}
                              className="w-full text-left flex items-center justify-between py-6 group"
                            >
                              <div className="flex-1 text-left">
                                <div className="flex items-center gap-3 mb-2">
                                  {popularFaqs.includes(faq.id) && (
                                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full border border-amber-200 text-xs">
                                      <TrendingUp className="h-3 w-3" />
                                      Popular
                                    </div>
                                  )}
                                  <div className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-200 text-xs">
                                    {faq.category}
                                  </div>
                                </div>
                                <span className="group-hover:text-orange-600 transition-colors text-lg font-semibold">
                                  {faq.question}
                                </span>
                              </div>
                              {expandedFaqs.includes(faq.id) ? (
                                <ChevronUp className="h-5 w-5 text-orange-600" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                            {expandedFaqs.includes(faq.id) && (
                              <div className="pb-6 animate-fade-in">
                                <div className="space-y-6">
                                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                  
                                  {/* Tags */}
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    {faq.tags.map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  {/* Helpful and Actions */}
                                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-6">
                                      <button
                                        onClick={() => handleHelpfulClick(faq.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                      >
                                        <ThumbsUp className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                          Helpful ({helpfulCounts[faq.id] || faq.helpful})
                                        </span>
                                      </button>
                                      <span className="text-sm text-gray-400">
                                        Updated {faq.lastUpdated}
                                      </span>
                                    </div>
                                    
                                    {/* Related Questions */}
                                    {faq.related && faq.related.length > 0 && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Related:</span>
                                        <div className="flex gap-1">
                                          {faq.related.map(relatedId => {
                                            const relatedFaq = faqs.find(f => f.id === relatedId);
                                            return relatedFaq ? (
                                              <button
                                                key={relatedId}
                                                onClick={() => {
                                                  const element = document.getElementById(`faq-${relatedId}`);
                                                  if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth' });
                                                    setExpandedFaqs(prev => [...prev, relatedId]);
                                                  }
                                                }}
                                                className="text-sm text-orange-600 hover:text-orange-700 hover:underline"
                                              >
                                                Q{relatedId}
                                              </button>
                                            ) : null;
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                {/* Quick Contact */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50/60 rounded-2xl p-6 border border-orange-200 mb-8">
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-orange-600" />
                    Need Quick Help?
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: MessageSquare, label: 'Live Chat', description: 'Chat with our support team', action: 'chat' },
                      { icon: Phone, label: 'Call Support', description: 'Click to call our team', action: 'call' }, // Updated description
                      { icon: Mail, label: 'Send Email', description: 'support@cupgfinder.com', action: 'email' },
                    ].map((option, idx) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleContactAction(option.action)}
                          className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
                        >
                          <div className="p-2 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-200 transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.description}</div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-orange-600" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Helpful Guides */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    Helpful Guides
                  </h3>
                  <div className="space-y-3">
                    {guides.map((guide, idx) => {
                      const Icon = guide.icon;
                      return (
                        <a
                          key={idx}
                          href={guide.link}
                          className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all duration-200 group"
                        >
                          <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 group-hover:text-orange-700">
                              {guide.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {guide.description}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* FAQ Stats */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl p-6 border border-blue-200">
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-6">
                    FAQ Statistics
                  </h3>
                  <div className="space-y-4">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{category.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${(category.count / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {category.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-blue-200/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Questions Answered</span>
                      <span className="font-bold text-blue-600">1,250+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-400/90 to-amber-400/80 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <AlertCircle className="h-16 w-16 mx-auto mb-6 text-white/90" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Still have questions?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleContactAction('chat')}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                  Start Live Chat
                </button>
                <button
                  onClick={() => handleContactAction('call')}
                  className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  Call Now
                </button>
              </div>
              <div className="mt-8">
                <a
                  href={`mailto:${supportEmail}`}
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Or email us at {supportEmail}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;