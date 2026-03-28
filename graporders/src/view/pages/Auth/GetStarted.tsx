import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Luxury car slides data
const slidesData = [
  {
    image: 'https://images.unsplash.com/photo-1633650915954-dafa15a419e4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop', // Lamborghini Aventador
    title: 'Lamborghini',
    description: 'Aventador · 770 HP · 217 mph',
  },
  {
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=1000&auto=format&fit=crop', // Rolls-Royce Ghost
    title: 'Rolls-Royce',
    description: 'Ghost · handcrafted · serenity',
  },
  {
    image: 'https://images.unsplash.com/photo-1730110206438-84d983766aa1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ferrari F8 Tributo
    title: 'Ferrari',
    description: 'F8 Tributo · Italian passion · 710 HP',
  },
  {
    image: 'https://images.unsplash.com/photo-1618642542397-ef97a739f1d7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1000&auto=format&fit=crop', // Bentley Continental GT
    title: 'Bentley',
    description: 'Continental GT · luxury · performance',
  },
  {
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop', // Porsche 911
    title: 'Porsche',
    description: '911 · precision · timeless',
  },
];

const GetStarted: React.FC = () => {
  // Duplicate first and last slides for infinite loop
  const extendedSlides = [
    slidesData[slidesData.length - 1], // last slide at beginning
    ...slidesData,
    slidesData[0], // first slide at end
  ];

  const [currentIndex, setCurrentIndex] = useState(1); // start at first real slide
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Helper to get original slide index (0‑based) from extended index
  const getOriginalIndex = (extendedIndex: number): number => {
    if (extendedIndex === 0) return slidesData.length - 1; // last slide
    if (extendedIndex === extendedSlides.length - 1) return 0; // first slide
    return extendedIndex - 1; // real slides
  };

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
    },
    [isTransitioning]
  );

  // Handle transition end – perform instant jumps at clone boundaries
  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);

    // If we are at the cloned first slide (last element), jump to real first slide
    if (currentIndex === extendedSlides.length - 1) {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        setCurrentIndex(1); // real first slide
        setTimeout(() => {
          if (trackRef.current) {
            trackRef.current.style.transition = '';
          }
        }, 50);
      }
    }

    // If we are at the cloned last slide (first element), jump to real last slide
    if (currentIndex === 0) {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        setCurrentIndex(extendedSlides.length - 2); // real last slide
        setTimeout(() => {
          if (trackRef.current) {
            trackRef.current.style.transition = '';
          }
        }, 50);
      }
    }
  }, [currentIndex, extendedSlides.length]);

  // Auto‑play: advance to next slide every 4 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Pause on hover
  const pauseAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resumeAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000);
  };

  // Update transform when currentIndex changes
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  // Dot click handler
  const handleDotClick = (dotIndex: number) => {
    const targetIndex = dotIndex + 1; // real slides start at index 1
    goToSlide(targetIndex);
  };

  const activeDotIndex = getOriginalIndex(currentIndex);

  return (
    <>
      <style>{`
        .app-getstarted {
          width: 100%;
          max-width: 400px;
          height: 100vh;
          background-color: #0a0a0a; /* deep black base */
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          position: relative;
        }

        .slider-container {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .carousel {
          display: flex;
          height: 100%;
          width: 100%;
          transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .slide {
          flex: 0 0 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .slide::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(145deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 90%);
          pointer-events: none;
        }

        .slide-content {
          position: absolute;
          bottom: 120px;
          left: 24px;
          right: 24px;
          color: white;
          text-shadow: 0 4px 20px rgba(0,0,0,0.6);
          z-index: 2;
        }

        .slide-content h2 {
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 6px;
          letter-spacing: 0.5px;
          font-family: 'Playfair Display', serif; /* elegant serif */
        }

        .slide-content p {
          font-size: 16px;
          font-weight: 300;
          opacity: 0.9;
          max-width: 80%;
          font-family: 'Inter', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .dots {
          position: absolute;
          bottom: 100px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          z-index: 5;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 20px;
          background-color: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
        }

        .dot.active {
          width: 30px;
          background-color: #d4af37; /* gold */
          box-shadow: 0 0 12px #d4af37;
        }

        .get-started-btn {
          position: absolute;
          bottom: 20px;
          left: 16px;
          right: 16px;
          background-color: #d4af37 !important; /* rich gold */
          border: none;
          border-radius: 40px;
          padding: 14px 16px;
          color: #0a0a0a;
          font-size: 17px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-align: center;
          cursor: pointer;
          box-shadow: 0 15px 30px rgba(212, 175, 55, 0.5), 0 4px 12px rgba(0,0,0,0.3);
          transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
          line-height: 1.2;
          border: 1px solid rgba(255,255,255,0.2);
          z-index: 10;
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-decoration: none;
        }

        .get-started-btn:hover {
          transform: scale(1.02);
          background-color: #e0b84d !important;
          box-shadow: 0 20px 40px rgba(212, 175, 55, 0.7);
        }

        .get-started-btn:active {
          transform: scale(0.98);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.6);
        }

        .get-started-btn i {
          font-size: 16px;
          color: #0a0a0a;
        }

        /* Optional: add a subtle texture to the background */
        .app-getstarted::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 30% 40%, rgba(212, 175, 55, 0.03) 0%, transparent 60%);
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <div className="app-getstarted">
        <div
          className="slider-container"
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >
          <div
            className="carousel"
            ref={trackRef}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((slide, idx) => (
              <div
                key={idx}
                className="slide"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="slide-content">
                  <h2>{slide.title}</h2>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="dots">
            {slidesData.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${activeDotIndex === idx ? 'active' : ''}`}
                onClick={() => handleDotClick(idx)}
              />
            ))}
          </div>

          <Link className="get-started-btn" to="/auth/signin">
            Get Started <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </>
  );
};

export default GetStarted;