import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
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

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 2rem;
          text-align: center;
          letter-spacing: -0.02em;
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

        .card-custom {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 174, 239, 0.15);
          transition: transform 0.3s ease;
        }

        .card-custom:hover {
          transform: translateY(-5px);
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

        .icon-box {
          width: 60px;
          height: 60px;
          background: #020024;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00aeef;
          font-size: 1.5rem;
          margin: 0 auto 1rem;
        }

        .stats-section {
          background: linear-gradient(135deg, #f9fafb, #e5e7eb);
          padding: 4rem 0;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(90deg, #020024, #00aeef);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 6rem 0 3rem;
          }
          .section-title {
            font-size: 2rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container position-relative">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-4">
                About <span className="text-theme-cyan">BCEL</span>
              </h1>
              <p className="lead text-white opacity-90">
                Powering Karnataka's growth with reliable, sustainable electricity solutions since 2010.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="section-title text-theme-primary position-relative">Our Story</h2>
              <p className="lead text-muted mb-4">
                Founded in 2010, Bengaluru City Electricity Limited has been at the forefront of 
                Karnataka's energy transformation, serving over 50,000 customers across the state.
              </p>
              <p className="text-muted">
                We've consistently invested in modern infrastructure, renewable energy, and 
                customer-centric solutions to ensure reliable power supply for homes and businesses.
              </p>
            </div>
            <div className="col-lg-6 text-center">
              <i className="fas fa-history text-theme-primary" style={{fontSize: '8rem', opacity: '0.6'}}></i>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title text-theme-primary position-relative">Our Values</h2>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card-custom text-center">
                <div className="icon-box">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h4 className="fw-bold mb-3">Reliability</h4>
                <p className="text-muted">
                  Ensuring consistent power supply with 99.9% uptime and robust infrastructure.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-custom text-center">
                <div className="icon-box">
                  <i className="fas fa-leaf"></i>
                </div>
                <h4 className="fw-bold mb-3">Sustainability</h4>
                <p className="text-muted">
                  Committed to green energy solutions and environmental responsibility.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-custom text-center">
                <div className="icon-box">
                  <i className="fas fa-users"></i>
                </div>
                <h4 className="fw-bold mb-3">Customer Focus</h4>
                <p className="text-muted">
                  Putting customers first with 24/7 support and innovative service solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-number">50K+</div>
              <h5 className="text-muted">Customers Served</h5>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-number">15+</div>
              <h5 className="text-muted">Years Experience</h5>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-number">30%</div>
              <h5 className="text-muted">Renewable Energy</h5>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-number">99.9%</div>
              <h5 className="text-muted">Uptime</h5>
            </div>
          </div>
        </div>
      </section>
    <Footer/>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default About;