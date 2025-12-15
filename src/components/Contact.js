import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
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

        .hero-section {
          background: linear-gradient(135deg, #020024 0%, #1a1a3d 100%);
          padding: 8rem 0 4rem;
          position: relative;
          overflow: hidden;
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

        .contact-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 174, 239, 0.15);
          position: relative;
          overflow: hidden;
        }

        .contact-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #020024, #00aeef);
        }

        .location-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 174, 239, 0.15);
          height: 100%;
          text-align: center;
          transition: all 0.3s ease;
        }

        .location-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(0, 174, 239, 0.15);
        }

        .contact-info-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 174, 239, 0.15);
          height: 100%;
          transition: all 0.3s ease;
        }

        .contact-info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(0, 174, 239, 0.15);
        }

        .contact-icon {
          width: 60px;
          height: 60px;
          background: #020024;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00aeef;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .location-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #020024, #00aeef);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
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

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 2rem;
          text-align: center;
          letter-spacing: -0.02em;
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #020024, #00aeef);
          border-radius: 2px;
        }

        .map-container {
          height: 400px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 174, 239, 0.15);
        }

        .map-placeholder {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-size: 1.1rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 6rem 0 3rem;
          }
          .section-title {
            font-size: 2rem;
          }
          .map-container {
            height: 300px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container position-relative">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-4">
                Contact <span className="text-theme-cyan">Us</span>
              </h1>
              <p className="lead text-white opacity-90">
                We're here to help. Get in touch with our team for any queries or support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-theme-primary">Contact Information</h2>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="contact-info-card text-center">
                <div className="contact-icon mx-auto">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h5 className="fw-bold">Address</h5>
                <p className="text-muted">
                  BCEL Headquarters<br />
                  Bengaluru, Karnataka 560001<br />
                  India
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="contact-info-card text-center">
                <div className="contact-icon mx-auto">
                  <i className="fas fa-phone"></i>
                </div>
                <h5 className="fw-bold">Phone</h5>
                <p className="text-muted">
                  +91 80 1234 5678<br />
                  +91 80 1234 5679 (Emergency)
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="contact-info-card text-center">
                <div className="contact-icon mx-auto">
                  <i className="fas fa-envelope"></i>
                </div>
                <h5 className="fw-bold">Email</h5>
                <p className="text-muted">
                  support@bcel.co.in<br />
                  info@bcel.co.in
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="contact-info-card text-center">
                <div className="contact-icon mx-auto">
                  <i className="fas fa-clock"></i>
                </div>
                <h5 className="fw-bold">Support Hours</h5>
                <p className="text-muted">
                  24/7 Emergency Support<br />
                  Mon-Fri: 9 AM - 6 PM (General)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-theme-primary">Our Office Locations</h2>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="location-card">
                <div className="location-icon">
                  <i className="fas fa-building"></i>
                </div>
                <h4 className="fw-bold mb-3">Headquarters</h4>
                <p className="text-muted">
                  BCEL Headquarters<br />
                  Bengaluru, Karnataka<br />
                  India
                </p>
                <small className="text-theme-cyan fw-semibold">Main Operations Center</small>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="location-card">
                <div className="location-icon">
                  <i className="fas fa-industry"></i>
                </div>
                <h4 className="fw-bold mb-3">Manufacturing Unit</h4>
                <p className="text-muted">
                  Industrial Area<br />
                  Bengaluru, Karnataka<br />
                  India
                </p>
                <small className="text-theme-cyan fw-semibold">Production Facility</small>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="location-card">
                <div className="location-icon">
                  <i className="fas fa-cogs"></i>
                </div>
                <h4 className="fw-bold mb-3">R&D Center</h4>
                <p className="text-muted">
                  Tech Park<br />
                  Bengaluru, Karnataka<br />
                  India
                </p>
                <small className="text-theme-cyan fw-semibold">Innovation Hub</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    <Footer/>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default Contact;