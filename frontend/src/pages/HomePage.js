import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const MagicalParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.6 + 0.2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-orange-400 to-pink-400 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const BookCard = ({ book, index }) => (
  <div 
    className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:rotate-1 overflow-hidden"
    style={{
      animation: `slideInUp 0.8s ease-out ${index * 0.2}s both`,
    }}
  >
    {/* Magical glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    
    <div className="relative p-6">
      <div className="w-16 h-20 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center text-white font-bold text-xl shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
        <span className="animate-bounce">📚</span>
      </div>
      
      <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-orange-600 transition-all duration-500 transform group-hover:scale-105">
        {book.title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-3 group-hover:text-gray-700 transition-colors">
        {book.author}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 transition-all duration-300 ${i < book.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              style={{
                animation: `starTwinkle 2s ease-in-out infinite ${i * 0.2}s`,
              }}
            >
              ⭐
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-500 transform transition-all duration-300 group-hover:scale-110 group-hover:text-orange-600">
          {book.reviews} reviews
        </span>
      </div>
    </div>
  </div>
);

const MagicalButton = ({ href, children, variant = 'primary', onClick }) => {
  const [sparkles, setSparkles] = useState([]);

  const createSparkle = () => {
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 1000);
  };

  const baseClasses = "group relative px-8 py-4 font-bold text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer inline-block";
  const variants = {
    primary: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:shadow-orange-500/25",
    secondary: "border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:shadow-orange-200/50"
  };

  const handleClick = () => {
    createSparkle();
    if (onClick) onClick();
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant]}`}
      onMouseEnter={createSparkle}
      onClick={handleClick}
    >
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-ping"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
        />
      ))}
      
      <span className="relative z-10 flex items-center">
        {children}
      </span>
      
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></div>
      )}
    </div>
  );
};

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showMagic, setShowMagic] = useState(true);
  const [showHero, setShowHero] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);

  const fetchFeaturedBooks = useCallback(async () => {
    try {
      setLoading(true);
      const mockBooks = [
        { _id: '1', title: 'The Mahabharata', author: 'Vyasa', rating: 5, reviews: 1500 },
        { _id: '2', title: 'The God of Small Things', author: 'Arundhati Roy', rating: 4, reviews: 1200 },
        { _id: '3', title: 'Shantaram', author: 'Gregory David Roberts', rating: 5, reviews: 980 },
        { _id: '4', title: 'A Fine Balance', author: 'Rohinton Mistry', rating: 4, reviews: 750 },
        { _id: '5', title: 'Sacred Games', author: 'Vikram Chandra', rating: 4, reviews: 890 },
        { _id: '6', title: 'The Rozabal Line', author: 'Ashwin Sanghi', rating: 4, reviews: 650 },
      ];
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFeaturedBooks(mockBooks);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error loading books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Timeline: Magic (3s) -> Hero (2s) -> Featured Books
    
    // Step 1: End magic show and show hero
    setTimeout(() => {
      setShowMagic(false);
      setShowHero(true);
      setIsVisible(true);
    }, 3000);
    
    // Step 2: Show featured books section
    setTimeout(() => {
      setShowFeatured(true);
    }, 5000);
    
    fetchFeaturedBooks();
  }, [fetchFeaturedBooks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 relative overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes starTwinkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        }
        @keyframes magicSparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes titleReveal {
          0% { 
            opacity: 0; 
            transform: translateY(50px) scale(0.8);
            filter: blur(10px);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes magicWand {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          50% { transform: rotate(-5deg) scale(1.2); }
          75% { transform: rotate(15deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .animate-magic-wand {
          animation: magicWand 2s ease-in-out infinite;
        }
        .animate-title-reveal {
          animation: titleReveal 1.5s ease-out forwards;
        }
      `}</style>

      {/* Magical Background Particles */}
      <MagicalParticles />

      {/* Magic Show Overlay */}
      {showMagic && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-black z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-8 animate-magic-wand">🪄</div>
            <div className="text-4xl text-white font-bold mb-4 animate-pulse">
              ✨ Welcome to the Magic of Books ✨
            </div>
            <div className="text-xl text-purple-300 animate-bounce">
              Preparing your magical journey...
            </div>
            {/* Floating magical elements */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                >
                  {['✨', '⭐', '🌟', '💫', '🔮'][Math.floor(Math.random() * 5)]}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className={`relative overflow-hidden transition-all duration-1000 ${showHero ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-2xl transform rotate-12" style={{animation: 'float 3s ease-in-out infinite'}}>
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl">📖</div>
                </div>
                <div className="absolute -right-8 -top-4 w-16 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg shadow-xl transform -rotate-12" style={{animation: 'float 3s ease-in-out infinite 0.5s'}}>
                  <div className="w-full h-full flex items-center justify-center text-white text-xl">📚</div>
                </div>
                <div className="absolute -left-8 top-2 w-14 h-18 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg shadow-lg transform rotate-6" style={{animation: 'float 3s ease-in-out infinite 1s'}}>
                  <div className="w-full h-full flex items-center justify-center text-white">📜</div>
                </div>
                
                {/* Magical sparkles around books */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-yellow-400 text-lg animate-ping"
                    style={{
                      left: `${-20 + Math.random() * 140}%`,
                      top: `${-20 + Math.random() * 140}%`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: '2s',
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-title-reveal">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-transparent bg-clip-text mb-6 leading-tight">
                भारतीय पुस्तक समीक्षा
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl text-gray-700 block mt-2">
                  Indian Book Reviews
                </span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 delay-300" style={{animation: isVisible ? 'slideInUp 1s ease-out 0.5s both' : ''}}>
              Discover timeless wisdom from ancient texts to contemporary masterpieces. <br />
              <span className="text-orange-600 font-semibold">Join India's largest community of book lovers</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12" style={{animation: isVisible ? 'slideInUp 1s ease-out 0.8s both' : ''}}>
              <Link to="/books">
                <MagicalButton>
                  पुस्तकें देखें - Check Books
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </MagicalButton>
              </Link>

              <MagicalButton variant="secondary" onClick={() => alert('Join Community!')}>
                ❤️ Join Community
              </MagicalButton>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className={`py-16 bg-white/50 backdrop-blur-sm relative transition-all duration-1000 ${showFeatured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold font-serif text-gray-800 mb-4 transform transition-all duration-1000 ${showFeatured ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
                ✨ Featured Books ✨
              </span>
            </h2>
            <p className={`text-lg text-gray-600 max-w-2xl mx-auto transform transition-all duration-1000 delay-300 ${showFeatured ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Discover the most loved books by our community of readers
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl animate-pulse">📚</div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-10 bg-red-50 rounded-xl border border-red-200 transform transition-all duration-500 hover:scale-105">
              <div className="text-red-600 mb-2 text-2xl">⚠️ Failed to load books</div>
              <button 
                onClick={fetchFeaturedBooks}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                🔄 Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBooks.map((book, index) => (
                <BookCard key={book._id} book={book} index={index} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/books">
              <MagicalButton onClick={() => alert('View All Books!')}>
                View All Books 
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </MagicalButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;