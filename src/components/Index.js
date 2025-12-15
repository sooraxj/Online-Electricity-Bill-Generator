import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style jsx>{`
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          scroll-behavior: smooth;
        }

        .navbar-custom {
          background: #020024;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          padding: 1rem 0;
          border-bottom: 1px solid #fff;

        }

        .navbar-scrolled {
          background: rgba(2, 0, 36, 0.95);
          backdrop-filter: blur(12px);
        }

        .hero-section {
          background: linear-gradient(135deg, #020024 0%, #1a1a3d 100%);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 4rem 0;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          opacity: 0.2;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .feature-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          transition: all 0.4s ease;
          border: 1px solid rgba(0, 174, 239, 0.15);
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 50px rgba(0, 174, 239, 0.25);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #00aeef, #020024);
          transition: all 0.3s ease;
        }

        .feature-icon {
          width: 70px;
          height: 70px;
          background: #020024;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: #00aeef;
          font-size: 1.8rem;
          box-shadow: 0 4px 15px rgba(0, 174, 239, 0.3);
        }

        .btn-primary-custom {
          background: #020024;
          border: 2px solid #00aeef;
          padding: 0.9rem 2.2rem;
          border-radius: 50px;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 174, 239, 0.2);
        }

        .btn-primary-custom:hover {
          background: #00aeef;
          color: #020024;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 174, 239, 0.4);
        }

        .btn-secondary-custom {
          background: #020024;
          border: 2px solid #00aeef;
          padding: 0.9rem 2.2rem;
          border-radius: 50px;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 174, 239, 0.2);
        }

        .btn-secondary-custom:hover {
          background: #00aeef;
          color: #020024;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 174, 239, 0.4);
        }

        .btn-outline-cyan {
          border: 2px solid #00aeef;
          color: #00aeef;
          background: transparent;
          padding: 0.9rem 2.2rem;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-outline-cyan:hover {
          background: #00aeef;
          color: #020024;
          box-shadow: 0 6px 20px rgba(0, 174, 239, 0.3);
        }

        .stats-section {
          background: linear-gradient(135deg, #f9fafb, #e5e7eb);
          padding: 6rem 0;
          position: relative;
        }

        .stats-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(0,174,239,0.05)"/></svg>');
          opacity: 0.4;
        }

        .stat-card {
          text-align: center;
          padding: 2.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-number {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(90deg, #020024, #00aeef);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.75rem;
        }

        .cta-section {
          background: linear-gradient(135deg, #020024 0%, #1a1a3d 100%);
          position: relative;
          overflow: hidden;
          padding: 6rem 0;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>');
          opacity: 0.3;
        }

        .footer-custom {
          background: #020024;
          color: white;
          padding: 4rem 0;
        }

        .nav-link-custom {
          color: white !important;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          padding-bottom: 0.5rem;
        }

        .nav-link-custom:hover {
          color: #00aeef !important;
        }

        .nav-link-custom::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #00aeef;
          transition: width 0.3s ease;
        }

        .nav-link-custom:hover::after {
          width: 100%;
        }

        .section-title {
          font-size: 2.8rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 3rem;
          position: relative;
          text-align: center;
          letter-spacing: -0.02em;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 5px;
          background: linear-gradient(90deg, #020024, #00aeef);
          border-radius: 3px;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .floating-element {
          position: absolute;
          background: rgba(0, 174, 239, 0.15);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
          box-shadow: 0 4px 15px rgba(0, 174, 239, 0.2);
        }

        .floating-element:nth-child(1) {
          width: 90px;
          height: 90px;
          top: 15%;
          left: 8%;
          animation-delay: 0s;
        }

        .floating-element:nth-child(2) {
          width: 70px;
          height: 70px;
          top: 65%;
          right: 8%;
          animation-delay: 2.5s;
        }

        .floating-element:nth-child(3) {
          width: 50px;
          height: 50px;
          top: 45%;
          right: 15%;
          animation-delay: 5s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        .service-highlight {
          background: linear-gradient(135deg, rgba(0, 174, 239, 0.05), rgba(2, 0, 36, 0.05));
          border-radius: 16px;
          padding: 3.5rem;
          margin: 3.5rem 0;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0, 174, 239, 0.15);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
        }

        .service-highlight::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(45deg, transparent 30%, rgba(0, 174, 239, 0.15) 50%, transparent 70%);
          animation: shimmer 4s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .text-theme-primary {
          background: linear-gradient(90deg, #020024, #00aeef);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .text-theme-cyan {
          color: #00aeef;
        }

        h1, h2, h3, h4, h5, h6 {
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        p, li {
          line-height: 1.7;
          color: #4b5563;
        }

        .hero-section h1 {
          font-size: 4rem;
          line-height: 1.1;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .hero-section p {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .footer-custom a {
          transition: color 0.3s ease;
        }

        .footer-custom a:hover {
          color: #00aeef;
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem;
          }
          .section-title {
            font-size: 2rem;
          }
          .stat-number {
            font-size: 2.5rem;
          }
        }
      `}</style>

      {/* Enhanced Navigation */}
      <nav className={`navbar navbar-expand-lg navbar-custom fixed-top ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          <Link to="/" className="navbar-brand text-white fw-bold fs-2">
            <i className="fas fa-bolt text-theme-cyan me-2"></i>
            BCEL
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item me-3">
                <Link to="/" className="nav-link nav-link-custom">Home</Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/about" className="nav-link nav-link-custom">About</Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/tariffs" className="nav-link nav-link-custom">Tariffs</Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/contact" className="nav-link nav-link-custom">Contact</Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/login" className="btn btn-outline-cyan rounded-pill px-4">
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="btn btn-secondary-custom rounded-pill px-4 fw-semibold">
                  <i className="fas fa-user-plus me-2"></i>
                  Apply
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="hero-section">
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>
        <div className="container hero-content">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold text-white mb-4">
                Powering Bengaluru with 
                <span className="text-theme-cyan"> Excellence</span>
              </h1>
              <p className="lead text-white mb-5">
                Bengaluru City Electricity Limited (BCEL) - Your trusted partner for reliable, 
                sustainable, and innovative electricity services across Karnataka.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/signup" className="btn btn-secondary-custom">
                  <i className="fas fa-credit-card me-2"></i>
                  Pay Bill Now
                </Link>
                <Link to="/about" className="btn btn-outline-cyan rounded-pill px-4">
                  <i className="fas fa-info-circle me-2"></i>
                  Learn More
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="position-relative">
                <i className="fas fa-city text-white" style={{fontSize: '15rem', opacity: '0.15'}}></i>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <i className="fas fa-bolt text-theme-cyan" style={{fontSize: '8rem'}}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <div className="stat-number">50K+</div>
                <h5 className="text-muted">Happy Customers</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <div className="stat-number">99.9%</div>
                <h5 className="text-muted">Uptime</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <div className="stat-number">24/7</div>
                <h5 className="text-muted">Support</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <div className="stat-number">15+</div>
                <h5 className="text-muted">Years Experience</h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-center">Why Choose BCEL?</h2>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="h4 text-center mb-3 fw-bold">Reliable Service</h3>
                <p className="text-muted text-center">
                  Uninterrupted power supply with 99.9% uptime and 24/7 emergency support 
                  to meet all your electricity needs.
                </p>
                <div className="text-center mt-4">
                  <small className="text-theme-primary fw-semibold">
                    <i className="fas fa-check me-2"></i>
                    ISO Certified
                  </small>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <h3 className="h4 text-center mb-3 fw-bold">Smart Billing</h3>
                <p className="text-muted text-center">
                  Digital-first approach with mobile app, online payments, and 
                  transparent billing with detailed usage analytics.
                </p>
                <div className="text-center mt-4">
                  <small className="text-theme-primary fw-semibold">
                    <i className="fas fa-star me-2"></i>
                    4.8/5 Rating
                  </small>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-leaf"></i>
                </div>
                <h3 className="h4 text-center mb-3 fw-bold">Green Energy</h3>
                <p className="text-muted text-center">
                  Committed to sustainable energy solutions with 30% renewable energy 
                  integration and carbon-neutral operations.
                </p>
                <div className="text-center mt-4">
                  <small className="text-success fw-semibold">
                    <i className="fas fa-seedling me-2"></i>
                    Eco-Friendly
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Highlight */}
      <section className="py-5">
        <div className="container">
          <div className="service-highlight">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h3 className="h2 fw-bold text-theme-primary mb-4">
                  <i className="fas fa-lightning-bolt me-3"></i>
                  Smart Grid Technology
                </h3>
                <p className="lead text-muted mb-4">
                  Experience the future of electricity distribution with our advanced smart grid 
                  infrastructure that automatically detects and resolves power issues.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <i className="fas fa-check text-theme-cyan me-2"></i>
                    Real-time power monitoring
                  </li>
                  <li className="mb-3">
                    <i className="fas fa-check text-theme-cyan me-2"></i>
                    Automated fault detection
                  </li>
                  <li className="mb-3">
                    <i className="fas fa-check text-theme-cyan me-2"></i>
                    Predictive maintenance
                  </li>
                </ul>
              </div>
              <div className="col-lg-6 text-center">
                <i className="fas fa-network-wired text-theme-primary" style={{fontSize: '8rem', opacity: '0.6'}}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="cta-section py-5">
        <div className="container position-relative">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold text-white mb-4">
                Ready to Experience Better Power?
              </h2>
              <p className="lead text-white mb-5 opacity-90">
                Join thousands of satisfied customers who trust BCEL for their electricity needs. 
                Get started today with our seamless registration process.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/login" className="btn btn-primary-custom">
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Login to Account
                </Link>
                <Link to="/signup" className="btn btn-secondary-custom">
                  <i className="fas fa-user-plus me-2"></i>
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="footer-custom py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h5 className="fw-bold mb-4">
                <i className="fas fa-bolt text-theme-cyan me-2"></i>
                About BCEL
              </h5>
              <p className="text-light opacity-75 mb-4">
                Bengaluru City Electricity Limited is Karnataka's leading electricity distribution company, 
                committed to delivering reliable, sustainable, and innovative power solutions.
              </p>
              <div className="d-flex gap-3">
                <a href="#" className="text-light">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-light">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-light">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="text-light">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-2">
              <h5 className="fw-bold mb-4">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/" className="text-light opacity-75 text-decoration-none">
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/about" className="text-light opacity-75 text-decoration-none">
                    About
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/tariffs" className="text-light opacity-75 text-decoration-none">
                    Tariffs
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/contact" className="text-light opacity-75 text-decoration-none">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h5 className="fw-bold mb-4">Services</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-light opacity-75 text-decoration-none">
                    Bill Payment
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-light opacity-75 text-decoration-none">
                    New Connection
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-light opacity-75 text-decoration-none">
                    Load Enhancement
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-light opacity-75 text-decoration-none">
                    Customer Support
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h5 className="fw-bold mb-4">Contact Info</h5>
              <div className="text-light opacity-75">
                <p className="mb-2">
                  <i className="fas fa-envelope me-2"></i>
                  support@bcel.co.in
                </p>
                <p className="mb-2">
                  <i className="fas fa-phone me-2"></i>
                  +91 80 1234 5678
                </p>
                <p className="mb-2">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  BCEL Headquarters, Bengaluru, Karnataka 560001
                </p>
              </div>
            </div>
          </div>
          <hr className="my-4 opacity-25" />
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-light opacity-75 mb-0">
                © 2025 Bengaluru City Electricity Limited. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex justify-content-md-end gap-3">
                <a href="#" className="text-light opacity-75 text-decoration-none small">
                  Privacy Policy
                </a>
                <a href="#" className="text-light opacity-75 text-decoration-none small">
                  Terms of Service
                </a>
                <a href="#" className="text-light opacity-75 text-decoration-none small">
                  Cookies Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bootstrap JS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default Index;