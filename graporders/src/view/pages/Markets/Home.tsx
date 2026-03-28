import { Link } from 'react-router-dom'
// import { i18n } from '../../../i18n'  // uncomment and update keys when ready

function Home() {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        body {
          background-color: #0a0a0a;
        }

        .app-home {
          width: 100%;
          background: #0a0a0a;
          border-radius: 0;
          box-shadow: none;
        }

        /* --- hero with dramatic car background --- */
        .hero {
          position: relative;
          height: 320px;
          background-image: url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&auto=format&fit=crop'); /* red sports car */
          background-size: cover;
          background-position: center 30%;
          isolation: isolate;
        }

        .hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 90%);
          z-index: 1;
        }

        .hero-content {
          position: absolute;
          top: 24px;
          left: 20px;
          right: 20px;
          z-index: 2;
          color: white;
          text-shadow: 0 4px 15px rgba(0,0,0,0.7);
        }

        .hero-content h3 {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 0.5px;
          line-height: 1.2;
          margin-bottom: 6px;
          font-family: 'Playfair Display', serif;
        }

        .hero-content p {
          font-size: 16px;
          font-weight: 300;
          opacity: 0.95;
          letter-spacing: 0.3px;
        }

        /* --- floating search card (glassmorphism, gold accents) --- */
        .search-card {
          background: rgba(10, 10, 10, 0.7);
          backdrop-filter: blur(16px);
          margin: -28px 16px 24px 16px;
          padding: 22px 18px 26px 18px;
          border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.3);
          border: 1px solid rgba(212,175,55,0.3);
        }

        .form-row {
          margin-bottom: 16px;
        }

        .form-row.double {
          display: flex;
          gap: 12px;
        }

        .input-group {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 30px;
          padding: 10px 18px;
          border: 1px solid rgba(212,175,55,0.3);
          transition: border 0.2s, box-shadow 0.2s;
        }

        .input-group:focus-within {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.2);
        }

        .input-group i {
          color: #d4af37;
          font-size: 16px;
          width: 24px;
          text-align: center;
          margin-right: 6px;
        }

        .input-group input {
          border: none;
          background: transparent;
          padding: 8px 0;
          font-size: 15px;
          font-weight: 400;
          width: 100%;
          outline: none;
          color: white;
        }

        .input-group input::placeholder {
          color: rgba(255,255,255,0.5);
          font-weight: 300;
        }

        .search-btn {
          display: block;
          width: 100%;
          background: linear-gradient(145deg, #d4af37, #b8960f);
          border: none;
          border-radius: 34px;
          padding: 16px 20px;
          margin-top: 24px;
          color: #0a0a0a;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-align: center;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(212,175,55,0.4);
          transition: transform 0.15s, box-shadow 0.2s;
          line-height: 1.2;
          border: 1px solid rgba(255,255,255,0.2);
          text-decoration: none;
        }

        .search-btn:hover {
          transform: scale(1.02);
          background: linear-gradient(145deg, #e0b84d, #c9a227);
          box-shadow: 0 14px 30px rgba(212,175,55,0.6);
        }

        .search-btn:active {
          transform: scale(0.98);
          box-shadow: 0 6px 16px rgba(212,175,55,0.5);
        }

        .search-btn i {
          font-size: 15px;
          margin-left: 6px;
        }

        .helper-note {
          display: flex;
          justify-content: flex-end;
          margin-top: 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          padding: 0 6px;
        }

        .helper-note i {
          font-size: 12px;
          margin-right: 4px;
        }

        /* --- sections common --- */
        .section {
          padding: 0 16px 32px 16px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 16px;
        }

        .section-header h4 {
          font-size: 20px;
          font-weight: 600;
          color: white;
          letter-spacing: 0.3px;
          font-family: 'Playfair Display', serif;
        }

        .section-header a {
          font-size: 14px;
          color: #d4af37;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }

        .section-header a:hover {
          color: #e0b84d;
        }

        /* --- exotic car collection (horizontal scroll, hidden scrollbar) --- */
        .photo-scroll {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 8px;
          -webkit-overflow-scrolling: touch;
        }

        .photo-scroll::-webkit-scrollbar {
          display: none;
        }

        .photo-item {
          flex: 0 0 auto;
          width: 220px;
          border-radius: 24px;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(212,175,55,0.3);
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }

        .photo-img {
          height: 160px;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .photo-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
          color: white;
          padding: 30px 12px 14px 12px;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          font-family: 'Playfair Display', serif;
        }

        .photo-label span {
          background: rgba(212,175,55,0.2);
          backdrop-filter: blur(4px);
          padding: 4px 12px;
          border-radius: 40px;
          font-size: 14px;
          font-weight: 500;
          color: #d4af37;
          border: 1px solid rgba(212,175,55,0.5);
        }

        /* --- featured vehicles (grid) --- */
        .card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .rec-card {
          background: rgba(10, 10, 10, 0.6);
          backdrop-filter: blur(8px);
          border-radius: 24px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
          border: 1px solid rgba(212,175,55,0.3);
          overflow: hidden;
          transition: transform 0.2s;
        }

        .rec-card:hover {
          transform: translateY(-4px);
          border-color: #d4af37;
        }

        .card-img {
          height: 160px;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .card-img .price-tag {
          position: absolute;
          bottom: 10px;
          right: 12px;
          background: rgba(10,10,10,0.8);
          backdrop-filter: blur(4px);
          padding: 6px 14px;
          border-radius: 40px;
          font-size: 14px;
          font-weight: 600;
          color: #d4af37;
          border: 1px solid rgba(212,175,55,0.5);
        }

        .card-info {
          padding: 14px 12px 16px 12px;
        }

        .card-info h5 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
          color: white;
        }

        .card-info .location {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .card-info .location i {
          font-size: 11px;
          color: #d4af37;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
        }

        .rating i {
          color: #d4af37;
          font-size: 12px;
        }

        .rating span {
          color: rgba(255,255,255,0.7);
          margin-left: 4px;
        }

        /* --- why rent with us (icon row) --- */
        .features {
          display: flex;
          justify-content: space-between;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 50px;
          padding: 18px 16px;
          margin: 8px 0 20px 0;
        }

        .feature-item {
          text-align: center;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
        }

        .feature-item i {
          font-size: 22px;
          color: #d4af37;
          display: block;
          margin-bottom: 6px;
        }

        /* footer */
        .attribution {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          text-align: center;
          padding: 20px 0 16px 0;
          border-top: 1px solid rgba(212,175,55,0.2);
          margin-top: 8px;
          letter-spacing: 0.3px;
        }

        .remove__blue {
          text-decoration: none;
        }
      `}</style>

      <div className="app-home">
        {/* hero with luxury car */}
        <div className="hero">
          <div className="hero-content">
            <h3>Unleash the thrill</h3>
            <p>Experience the world’s finest automobiles</p>
          </div>
        </div>

        {/* search card - find your dream car */}
        <div className="search-card">
          <div className="form-row">
            <div className="input-group">
              <i className="fas fa-map-pin" />
              <input type="text" placeholder="Pick-up location" />
            </div>
          </div>
          <div className="form-row double">
            <div className="input-group">
              <i className="fas fa-calendar-alt" />
              <input type="text" placeholder="Pick-up date" />
            </div>
            <div className="input-group">
              <i className="fas fa-calendar-check" />
              <input type="text" placeholder="Return date" />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <i className="fas fa-car" />
              <input type="text" placeholder="Car type (e.g. SUV, Convertible)" />
            </div>
          </div>
          <Link className="search-btn remove__blue" to="/search">
            <span>Search Cars</span>
            <i className="fas fa-arrow-right" />
          </Link>
          <div className="helper-note">
            <i className="far fa-clock" /> <span>Flexible dates? We’ll help you find the best deals</span>
          </div>
        </div>

        {/* exotic car collection (horizontal scroll) */}
        <div className="section">
          <div className="section-header">
            <h4>Exotic Collection</h4>
            <a href="#">View all</a>
          </div>
          <div className="photo-scroll">
            <div className="photo-item">
              <div
                className="photo-img"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&h=400&auto=format&fit=crop")' // Lamborghini
                }}
              >
                <div className="photo-label">
                  Aventador <span>$899/day</span>
                </div>
              </div>
            </div>
            <div className="photo-item">
              <div
                className="photo-img"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600&h=400&auto=format&fit=crop")' // Rolls-Royce
                }}
              >
                <div className="photo-label">
                  Ghost <span>$1,200/day</span>
                </div>
              </div>
            </div>
            <div className="photo-item">
              <div
                className="photo-img"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&h=400&auto=format&fit=crop")' // Ferrari
                }}
              >
                <div className="photo-label">
                  F8 Tributo <span>$950/day</span>
                </div>
              </div>
            </div>
            <div className="photo-item">
              <div
                className="photo-img"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1603584173870-7be23a59b2a4?w=600&h=400&auto=format&fit=crop")' // Bentley
                }}
              >
                <div className="photo-label">
                  Continental GT <span>$1,100/day</span>
                </div>
              </div>
            </div>
            <div className="photo-item">
              <div
                className="photo-img"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&auto=format&fit=crop")' // Porsche
                }}
              >
                <div className="photo-label">
                  911 Turbo S <span>$780/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* featured vehicles (grid) */}
        <div className="section">
          <div className="section-header">
            <h4>Featured Vehicles</h4>
            <a href="#">View all</a>
          </div>
          <div className="card-grid">
            <div className="rec-card">
              <div
                className="card-img"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=400&auto=format&fit=crop")' // McLaren
                }}
              >
                <span className="price-tag">$1,050/day</span>
              </div>
              <div className="card-info">
                <h5>McLaren 720S</h5>
                <div className="location">
                  <i className="fas fa-map-marker-alt" /> Miami
                </div>
                <div className="rating">
                  <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                  <span>5.0 (12 reviews)</span>
                </div>
              </div>
            </div>
            <div className="rec-card">
              <div
                className="card-img"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&auto=format&fit=crop")' // BMW i8
                }}
              >
                <span className="price-tag">$640/day</span>
              </div>
              <div className="card-info">
                <h5>BMW i8</h5>
                <div className="location">
                  <i className="fas fa-map-marker-alt" /> Los Angeles
                </div>
                <div className="rating">
                  <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star-half-alt" />
                  <span>4.8 (8 reviews)</span>
                </div>
              </div>
            </div>
            <div className="rec-card">
              <div
                className="card-img"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=600&h=400&auto=format&fit=crop")' // Mercedes-AMG GT
                }}
              >
                <span className="price-tag">$820/day</span>
              </div>
              <div className="card-info">
                <h5>AMG GT R</h5>
                <div className="location">
                  <i className="fas fa-map-marker-alt" /> Dubai
                </div>
                <div className="rating">
                  <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                  <span>5.0 (6 reviews)</span>
                </div>
              </div>
            </div>
            <div className="rec-card">
              <div
                className="card-img"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1603584173870-7be23a59b2a4?w=600&h=400&auto=format&fit=crop")' // Bentley (duplicate? but okay)
                }}
              >
                <span className="price-tag">$1,100/day</span>
              </div>
              <div className="card-info">
                <h5>Bentley Continental</h5>
                <div className="location">
                  <i className="fas fa-map-marker-alt" /> London
                </div>
                <div className="rating">
                  <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                  <span>5.0 (10 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* why rent with us */}
        <div className="section">
          <div className="features">
            <div className="feature-item">
              <i className="fas fa-exchange-alt" /> Free Cancellation
            </div>
            <div className="feature-item">
              <i className="fas fa-headset" /> 24/7 Support
            </div>
            <div className="feature-item">
              <i className="fas fa-shield-alt" /> Insurance Included
            </div>
            <div className="feature-item">
              <i className="fas fa-tag" /> Best Price Guarantee
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="attribution">
          Your journey begins with us – luxury car rentals
        </div>
      </div>
    </>
  )
}

export default Home