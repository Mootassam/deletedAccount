import React, { useState, useEffect, useRef } from 'react';
import SubHeader from 'src/view/shared/Header/SubHeader';
import { i18n } from '../../../i18n';

function Activities() {
  const images = [
    '/images/news/1.png',
    '/images/news/2.png',
    '/images/news/3.png',
    '/images/news/4.png',
    '/images/news/5.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetInterval();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetInterval();
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetInterval();
  };

  // Auto-slide function
  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000); // 3 seconds
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetInterval = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  return (
    <div className="activities-page">
      <SubHeader title={i18n('pages.activities.title')} path="/profile" />

      <p className="activities-page__subtitle">
        {i18n('pages.activities.subtitle')}
      </p>

      <div className="slider-container">
        {/* Main slider image */}
        <div className="slider-image-wrapper">
          <img
            src={images[currentIndex]}
            alt={`Activity ${currentIndex + 1}`}
            className="slider-image"
          />
        </div>

        {/* Navigation buttons */}
        <button className="slider-btn prev" onClick={goToPrevious}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="slider-btn next" onClick={goToNext}>
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* Dots */}
        <div className="dots-container">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      <style>{`
        .activities-page {
          background-color: #ffffff;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding-bottom: 2rem;
        }

        .activities-page__subtitle {
          font-size: 14px;
          color: #333333;
          margin: 2rem 1rem 1.5rem;
          font-weight: 400;
        }

        .slider-container {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .slider-image-wrapper {
          width: 100%;
          height: auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .slider-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        .slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          z-index: 10;
          font-size: 1.2rem;
          backdrop-filter: blur(2px);
        }

        .slider-btn:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .slider-btn.prev {
          left: 5px;  /* Slightly inside the image edge */
        }

        .slider-btn.next {
          right: 5px;
        }

        .dots-container {
          display: flex;
          justify-content: center;
          margin-top: 1.5rem;
          gap: 12px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #cccccc;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.2s;
        }

        .dot.active {
          background-color: rgb(0, 157, 254);
          transform: scale(1.2);
        }

        .dot:hover {
          background-color: #888888;
        }

        @media (max-width: 768px) {
          .slider-btn {
            width: 36px;
            height: 36px;
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .activities-page__subtitle {
            font-size: 1rem;
            margin: 1.5rem 1rem 1rem;
          }
          .slider-btn {
            width: 32px;
            height: 32px;
          }
          .slider-btn.prev {
            left: 2px;
          }
          .slider-btn.next {
            right: 2px;
          }
          .dot {
            width: 10px;
            height: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default Activities;
