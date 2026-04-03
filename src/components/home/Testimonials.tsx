import { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

// Only PG Owner Testimonials
const userTestimonials = [
  {
    name: 'Sneha Patel',
    rating: 5,
    text: 'This platform saved me a lot of time while searching for rentals. The filters, listings, and clear information made the entire experience smooth and stress free. I especially liked how quickly I could compare options and shortlist properties without confusion.',
  },
  {
    name: 'Aman Gupta',
    rating: 5,
    text: 'Everything worked smoothly from start to end. From browsing properties to shortlisting options, the entire flow felt well planned and easy to understand. I did not face any technical issues or unnecessary steps during usage.',
  },
  {
    name: 'Neha Singh',
    rating: 5,
    text: 'A trustworthy platform with real and verified listings. I felt confident using it because the details were accurate and the process was completely transparent. It gave me peace of mind while searching for a rental.',
  },
  {
    name: 'Vikas Mehra',
    rating: 5,
    text: 'The app is very user friendly and well designed. Navigation is simple, pages load quickly, and all important information is easy to find. Even first time users can understand the layout without help.',
  },
  {
    name: 'Pooja Rani',
    rating: 5,
    text: 'The entire process was simple with clear property details. I did not face any confusion and everything was explained in a very easy manner. This made decision making much faster for me.',
  },
  {
    name: 'Saurabh Jain',
    rating: 5,
    text: 'One of the best rental platforms I have used so far. The experience was smooth, reliable, and much better than other similar apps. It feels more organized and trustworthy overall.',
  },
  {
    name: 'Kiran Malhotra',
    rating: 5,
    text: 'The search feature is fast and results are genuine. I was able to find suitable rental options without wasting time on irrelevant listings. This saved me a lot of unnecessary effort.',
  },
  {
    name: 'Nitin Chauhan',
    rating: 5,
    text: 'Overall a very smooth experience. The platform feels reliable and well organized, making rental searching much easier for users. I would definitely use it again in the future.',
  },
  {
    name: 'Simran Kaur',
    rating: 5,
    text: 'I really loved the clean user interface and easy flow. Everything is well structured and even first time users can use it comfortably without any learning curve.',
  },
  {
    name: 'Rahul Yadav',
    rating: 5,
    text: 'This platform helped me finalize a rental much faster than expected. The clear information and simple process made decision making easier and less stressful.',
  },
  {
    name: 'Shivam Mishra',
    rating: 5,
    text: 'A reliable app with updated and accurate listings. I liked how frequently properties are refreshed, which improves trust in the platform and avoids outdated information.',
  },
  {
    name: 'Priya Arora',
    rating: 5,
    text: 'The experience was good and very easy to understand. All steps are clear, and the platform does not feel complicated at any point during usage.',
  },
  {
    name: 'Mohit Bansal',
    rating: 5,
    text: 'The rental search process was smooth and completely stress free. I did not face any unnecessary issues while using the app at any stage.',
  },
  {
    name: 'Nisha Kapoor',
    rating: 5,
    text: 'Everything was clear and transparent throughout the experience. Property details, pricing, and information were properly explained without hidden confusion.',
  },
  {
    name: 'Arjun Khanna',
    rating: 5,
    text: 'A fast and efficient rental platform that actually delivers results. Searching and filtering properties works very well and saves a lot of time.',
  },
  {
    name: 'Ritu Saxena',
    rating: 5,
    text: 'The platform helped me find the right place easily. I liked how organized the listings were and how simple the overall journey felt.',
  },
  {
    name: 'Yash Thakur',
    rating: 5,
    text: 'The steps are simple and the information provided is reliable. Even without prior experience, using the platform felt comfortable and smooth.',
  },
  {
    name: 'Kavita Joshi',
    rating: 5,
    text: 'A very helpful and easy to use app. It simplifies rental searching and removes unnecessary complexity from the process completely.',
  },
  {
    name: 'Aditya Rana',
    rating: 5,
    text: 'My experience was great due to accurate details and clean presentation. The platform feels professional, polished, and well maintained.',
  },
  {
    name: 'Mehul Shah',
    rating: 5,
    text: 'One of the best platforms for rental search. It combines simplicity, speed, and reliable information in a single place for users.',
  },
  {
    name: 'Ayesha Khan',
    rating: 5,
    text: 'The journey from searching to finalizing a rental was smooth. Everything worked as expected without unnecessary delays or confusion.',
  },
  {
    name: 'Harshit Aggarwal',
    rating: 5,
    text: 'This platform saved a lot of effort and time for me. The process is straightforward, clean, and completely user focused.',
  },
  {
    name: 'Riya Choudhary',
    rating: 5,
    text: 'The design is very clean and the features are genuinely useful. It feels modern, simple, and easy to navigate on all devices.',
  },
  {
    name: 'Tarun Malviya',
    rating: 5,
    text: 'I would highly recommend this platform for rental search. It provides a smooth experience with trustworthy and well presented information.',
  },
];

// YouTube Video Data (only one) - Using your provided video
const youtubeVideo = {
  id: 'owner_testimonial',
  title: 'What user say about  EasytoRent',
  youtubeId: 'yYl2oi-fZx0', // Extracted ID from the URL
  youtubeUrl: 'https://youtube.com/shorts/yYl2oi-fZx0',
  thumbnail: 'https://img.youtube.com/vi/yYl2oi-fZx0/maxresdefault.jpg',
  duration: '0:58',
  views: '1.2K',
};

// Main Testimonials Component
export function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const updateSlidesPerView = () => {
    if (window.innerWidth < 640) {
      setSlidesPerView(1);
    } else if (window.innerWidth < 1024) {
      setSlidesPerView(2);
    } else {
      setSlidesPerView(3);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev + slidesPerView >= userTestimonials.length) { // Changed from ownerTestimonials
        return 0;
      }
      return prev + 1;
    });
  }, [slidesPerView]);

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      if (prev === 0) {
        return Math.max(0, userTestimonials.length - slidesPerView); // Changed from ownerTestimonials
      }
      return prev - 1;
    });
  };

  // Auto slide functionality
  useEffect(() => {
    if (!isAutoPlaying || isHovering) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovering, nextSlide]);

  useEffect(() => {
    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowVideoModal(false);
      }
    };

    if (showVideoModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [showVideoModal]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`} 
          />
        ))}
      </div>
    );
  };

  const totalSlides = Math.ceil(userTestimonials.length / slidesPerView); // Changed from ownerTestimonials
  const currentSlideGroup = Math.floor(currentSlide / slidesPerView) + 1;

  // Function to handle YouTube video click
  const handleVideoClick = () => {
    setShowVideoModal(true);
  };

  // YouTube embed URL
const embedUrl = `https://www.youtube.com/embed/X2yjpkoOQDo?rel=0&modestbranding=1&controls=1&disablekb=1`;

  return (
    <>
      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors"
              aria-label="Close video"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                title={youtubeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            
            <div className="p-6 bg-black">
              <h3 className="text-xl font-bold text-white mb-2">{youtubeVideo.title}</h3>
              <div className="flex items-center gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                  <span>YouTube Short</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  {youtubeVideo.views} views
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What students say about easytorent.
            </h2>
          </div>

          {/* Single YouTube Video */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
              <div className="md:flex" onClick={handleVideoClick}>
                <div className="md:w-2/3 relative group">
                  <div className="aspect-video">
                    <img
                      src={youtubeVideo.thumbnail}
                      alt={youtubeVideo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-4 right-4 bg-black/80 text-white text-sm px-3 py-1 rounded z-10">
                      {youtubeVideo.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-red-700 transition-all duration-300 shadow-2xl">
                        <Play className="h-10 w-10 text-white ml-1" />
                      </div>
                    </div>
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="md:w-1/3 p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {youtubeVideo.title}
                  </h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                      <span className="font-medium">YouTube Short</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      {youtubeVideo.views} views
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Watch real users share honest feedback and experiences with our platform, highlighting
                    ease of use, reliability, and how it helped them find better rental solutions faster.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Testimonials Slider */}
          <div 
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)` }}
              >
                {userTestimonials.map((testimonial, index) => ( // Changed from ownerTestimonials
                  <div
                    key={index}
                    className="flex-shrink-0 px-3"
                    style={{ width: `${100 / slidesPerView}%` }}
                  >
                    <div className="bg-white rounded-xl p-6 h-full shadow-lg hover:shadow-xl transition-shadow duration-200">
                      <div className="mb-4">
                        {renderStars(testimonial.rating)}
                      </div>

                      <p className="text-gray-700 mb-6">"{testimonial.text}"</p>

                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button 
                onClick={prevSlide} 
                aria-label="Previous testimonial" 
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index * slidesPerView)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentSlideGroup - 1 
                        ? 'bg-primary scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextSlide} 
                aria-label="Next testimonial" 
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}