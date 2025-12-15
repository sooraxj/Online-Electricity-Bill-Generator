import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Tariffs = () => {
  const [tariffs, setTariffs] = useState([]);
  const [extraCharges, setExtraCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTariffData = async () => {
      try {
        // Fetch tariffs
        const tariffResponse = await fetch('http://localhost:5000/api/tariffs');
        if (!tariffResponse.ok) throw new Error('Failed to fetch tariffs');
        const tariffData = await tariffResponse.json();

        // Fetch extra charges
        const chargesResponse = await fetch('http://localhost:5000/api/extra-charges');
        if (!chargesResponse.ok) throw new Error('Failed to fetch extra charges');
        const chargesData = await chargesResponse.json();

        setTariffs(tariffData);
        setExtraCharges(chargesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTariffData();
  }, []);

  const getTariffDetails = (type) => {
    const tariffDetails = tariffs.filter(t => t.tariff_type === type);
    const chargeDetails = extraCharges.find(c => c.tariff_type === type) || {};
    return { tariffDetails, chargeDetails };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <p>Loading tariffs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

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
          height: 100%;
        }

        .card-custom:hover {
          transform: translateY(-5px);
        }

        .tariff-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 174, 239, 0.15);
          transition: transform 0.3s ease;
          height: 100%;
          position: relative;
        }

        .tariff-card:hover {
          transform: translateY(-5px);
        }

        .tariff-card.featured {
          border: 2px solid #00aeef;
          transform: scale(1.05);
        }

        .tariff-card.featured::before {
          content: 'MOST POPULAR';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #00aeef;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
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

        .price-display {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(90deg, #020024, #00aeef);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-primary-custom {
          background: linear-gradient(90deg, #020024, #00aeef);
          border: none;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-primary-custom:hover {
          background: linear-gradient(90deg, #00aeef, #020024);
          transform: translateY(-2px);
        }

        .feature-list {
          list-style: none;
          padding: 0;
        }

        .feature-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
        }

        .feature-list li:last-child {
          border-bottom: none;
        }

        .feature-list i {
          color: #00aeef;
          margin-right: 0.5rem;
        }

        .info-section {
          background: linear-gradient(135deg, #f9fafb, #e5e7eb);
          padding: 4rem 0;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 6rem 0 3rem;
          }
          .section-title {
            font-size: 2rem;
          }
          .tariff-card.featured {
            transform: none;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container position-relative">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-4">
                Electricity <span className="text-theme-cyan">Tariffs</span>
              </h1>
              <p className="lead text-white opacity-90">
                Transparent pricing plans designed to meet your energy needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tariff Plans */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-theme-primary position-relative">Our Tariff Plans</h2>
          <div className="row g-4">
            {/* Residential Plan */}
            <div className="col-lg-4">
              <div className="tariff-card">
                <div className="icon-box">
                  <i className="fas fa-home"></i>
                </div>
                <h4 className="fw-bold mb-3 text-center">Residential</h4>
                <div className="price-display text-center mb-3">
                  {getTariffDetails('Domestic').tariffDetails[0]?.rate || 'N/A'}
                </div>
                <p className="text-center text-muted mb-4">per kWh</p>
                <ul className="feature-list">
                  {getTariffDetails('Domestic').tariffDetails.map((tariff, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i>
                      {tariff.unit_to
                        ? `${tariff.unit_from}-${tariff.unit_to} units: ₹${tariff.rate}/kWh`
                        : `Above ${tariff.unit_from} units: ₹${tariff.rate}/kWh`}
                    </li>
                  ))}
                  {getTariffDetails('Domestic').chargeDetails.fixed_charge && (
                    <li>
                      <i className="fas fa-check"></i>
                      Fixed monthly charge: ₹{getTariffDetails('Domestic').chargeDetails.fixed_charge}
                    </li>
                  )}
                  <li><i className="fas fa-check"></i> 24/7 customer support</li>
                </ul>
                <div className="text-center mt-4">
                  <button className="btn btn-primary-custom">Choose Plan</button>
                </div>
              </div>
            </div>

            {/* Commercial Plan */}
            <div className="col-lg-4">
              <div className="tariff-card featured">
                <div className="icon-box">
                  <i className="fas fa-building"></i>
                </div>
                <h4 className="fw-bold mb-3 text-center">Commercial</h4>
                <div className="price-display text-center mb-3">
                  {getTariffDetails('Commercial').tariffDetails[0]?.rate || 'N/A'}
                </div>
                <p className="text-center text-muted mb-4">per kWh</p>
                <ul className="feature-list">
                  {getTariffDetails('Commercial').tariffDetails.map((tariff, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i>
                      {tariff.unit_to
                        ? `${tariff.unit_from}-${tariff.unit_to} units: ₹${tariff.rate}/kWh`
                        : `Above ${tariff.unit_from} units: ₹${tariff.rate}/kWh`}
                    </li>
                  ))}
                  {getTariffDetails('Commercial').chargeDetails.fixed_charge && (
                    <li>
                      <i className="fas fa-check"></i>
                      Fixed monthly charge: ₹{getTariffDetails('Commercial').chargeDetails.fixed_charge}
                    </li>
                  )}
                  <li><i className="fas fa-check"></i> Priority technical support</li>
                  <li><i className="fas fa-check"></i> Online billing & payments</li>
                </ul>
                <div className="text-center mt-4">
                  <button className="btn btn-primary-custom">Choose Plan</button>
                </div>
              </div>
            </div>

            {/* Industrial Plan */}
            <div className="col-lg-4">
              <div className="tariff-card">
                <div className="icon-box">
                  <i className="fas fa-industry"></i>
                </div>
                <h4 className="fw-bold mb-3 text-center">Industrial</h4>
                <div className="price-display text-center mb-3">
                  {getTariffDetails('Industrial').tariffDetails[0]?.rate || 'N/A'}
                </div>
                <p className="text-center text-muted mb-4">per kWh</p>
                <ul className="feature-list">
                  {getTariffDetails('Industrial').tariffDetails.map((tariff, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i>
                      {tariff.unit_to
                        ? `${tariff.unit_from}-${tariff.unit_to} units: ₹${tariff.rate}/kWh`
                        : `Above ${tariff.unit_from} units: ₹${tariff.rate}/kWh`}
                    </li>
                  ))}
                  {getTariffDetails('Industrial').chargeDetails.fixed_charge && (
                    <li>
                      <i className="fas fa-check"></i>
                      Fixed monthly charge: ₹{getTariffDetails('Industrial').chargeDetails.fixed_charge}
                    </li>
                  )}
                  <li><i className="fas fa-check"></i> Dedicated account manager</li>
                  <li><i className="fas fa-check"></i> Custom billing solutions</li>
                </ul>
                <div className="text-center mt-4">
                  <button className="btn btn-primary-custom">Choose Plan</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="info-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="card-custom">
                <h4 className="fw-bold mb-3 text-theme-primary">
                  <i className="fas fa-info-circle me-2"></i>
                  Important Information
                </h4>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="fas fa-arrow-right text-theme-cyan me-2"></i>
                    All tariffs are subject to applicable taxes and duties
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-arrow-right text-theme-cyan me-2"></i>
                    Security deposit required for new connections
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-arrow-right text-theme-cyan me-2"></i>
                    Time-of-day tariffs available for large consumers
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-arrow-right text-theme-cyan me-2"></i>
                    Green energy surcharge: ₹0.25/kWh for renewable energy
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-custom">
                <h4 className="fw-bold mb-3 text-theme-primary">
                  <i className="fas fa-calculator me-2"></i>
                  Bill Calculation
                </h4>
                <p className="text-muted mb-3">
                  Your electricity bill includes:
                </p>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="fas fa-arrow-right text-theme-cyan me-2"></i>
                    Energy charges based on consumption
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-arrow-right text-theme-cyan me-2"></i>
                    Fixed monthly charges
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-arrow-right text-theme-cyan me-2"></i>
                    Applicable taxes (CGST, SGST, Electricity Duty)
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-arrow-right text-theme-cyan me-2"></i>
                    Meter reading charges (if applicable)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h3 className="fw-bold mb-4">Need Help Choosing a Plan?</h3>
              <p className="text-muted mb-4">
                Our customer service team is here to help you find the perfect tariff plan for your needs.
              </p>
              <div className="row g-3 justify-content-center">
                <div className="col-auto">
                  <button className="btn btn-primary-custom">
                    <i className="fas fa-phone me-2"></i>
                    Call Us
                  </button>
                </div>
                <div className="col-auto">
                  <button className="btn btn-primary-custom">
                    <i className="fas fa-envelope me-2"></i>
                    Email Support
                  </button>
                </div>
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

export default Tariffs;