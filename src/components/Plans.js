import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Plans() {
  const [userData, setUserData] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [extraCharges, setExtraCharges] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.role !== 'customer') {
      navigate('/');
      return;
    }

    setUserData(user);

    // Fetch plan details
    const fetchPlanDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/customer/plan/${user.customer_id}`);
        setPlanDetails(response.data.customer);
        setExtraCharges(response.data.extraCharges);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch plan details');
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 d-flex justify-content-center align-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 d-flex justify-content-center align-items-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Reusable Navbar Component */}
      <Navbar />

      {/* External Stylesheets */}
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

        .main-content {
          background: #ffffff;
          padding: 4rem 0;
          position: relative;
        }

        .content-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
          margin: 4rem 0;
        }

        .section-wrapper {
          margin-bottom: 5rem;
        }

        .section-wrapper:last-child {
          margin-bottom: 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #020024 0%, #00aeef 100%);
          border-radius: 2px;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: #64748b;
          font-weight: 400;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .professional-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .info-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .info-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #020024 0%, #00aeef 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #00aeef;
        }

        .info-card:hover::before {
          transform: scaleX(1);
        }

        .card-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #020024 0%, #00aeef 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          margin-bottom: 1.5rem;
          box-shadow: 0 8px 16px rgba(0, 174, 239, 0.3);
        }

        .card-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .card-value {
          font-size: 1.375rem;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.4;
          word-break: break-word;
        }

        .status-container {
          margin-top: 1rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          color: #166534;
          border-radius: 25px;
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .charges-section {
          background: #f8fafc;
          padding: 3rem 0;
          margin-top: 2rem;
          border-radius: 20px;
        }

        .charges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .charge-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .charge-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
          border-color: #00aeef;
        }

        .charge-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.25rem;
          color: #64748b;
        }

        .charge-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .charge-amount {
          font-size: 2rem;
          font-weight: 700;
          color: #020024;
          margin-bottom: 0.5rem;
        }

        .text-theme-cyan {
          color: #00aeef;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid transparent;
          border-top: 3px solid #00aeef;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: auto;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 6rem 0 3rem;
          }

          .content-container {
            padding: 0 1rem;
          }

          .main-content {
            padding: 3rem 0;
          }

          .section-title {
            font-size: 2rem;
          }

          .professional-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .charges-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }

          .charges-section {
            padding: 2rem 1rem;
            margin-top: 1rem;
          }

          .section-wrapper {
            margin-bottom: 3rem;
          }
        }

        @media (max-width: 480px) {
          .charges-grid {
            grid-template-columns: 1fr;
          }

          .professional-grid {
            grid-template-columns: 1fr;
          }

          .info-card {
            padding: 1.5rem;
          }

          .charge-card {
            padding: 1.5rem;
          }
        }
      `}</style>

      <section className="hero-section">
        <div className="container position-relative">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-4">
                Your <span className="text-theme-cyan">Plan</span> Details
              </h1>
              <p className="lead text-white opacity-90">
                View your electricity plan details, including tariff type and associated charges.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="main-content">
        <div className="content-container">
          {planDetails && (
            <>
              {/* Personal Information Section */}
              <div className="section-wrapper">
                <div className="section-header">
                  <h2 className="section-title">Personal Information</h2>
                  <p className="section-subtitle">
                    Your registered personal details and contact information
                  </p>
                </div>
                <div className="professional-grid">
                  <div className="info-card">
                    <div className="card-icon">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="card-title">Full Name</div>
                    <div className="card-value">{planDetails.name}</div>
                  </div>
                  <div className="info-card">
                    <div className="card-icon">
                      <i className="fas fa-at"></i>
                    </div>
                    <div className="card-title">Username</div>
                    <div className="card-value">{planDetails.username}</div>
                  </div>
                  <div className="info-card">
                    <div className="card-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="card-title">Contact Number</div>
                    <div className="card-value">{planDetails.phone_number}</div>
                  </div>
                  <div className="info-card">
                    <div className="card-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="card-title">Registered Address</div>
                    <div className="card-value">{planDetails.address}</div>
                  </div>
                  <div className="info-card">
                    <div className="card-icon">
                      <i className="fas fa-id-card"></i>
                    </div>
                    <div className="card-title">Aadhar Number</div>
                    <div className="card-value">{planDetails.aadhar_number}</div>
                  </div>
                  <div className="info-card">
                    <div className="card-icon">
                      <i className="fas fa-receipt"></i>
                    </div>
                    <div className="card-title">Ration Card</div>
                    <div className="card-value">{planDetails.ration_card || 'Not Provided'}</div>
                  </div>
                </div>
              </div>

              <div className="section-divider"></div>

              {/* Connection Details Section */}
              <div className="section-wrapper">
                <div className="section-header">
                  <h2 className="section-title">Connection Details</h2>
                  <p className="section-subtitle">
                    Your electricity connection and meter information
                  </p>
                </div>
                <div className="professional-grid">
                  <div className="info-card">
                    <div className="card-icon">
                      <i className="fas fa-hashtag"></i>
                    </div>
                    <div className="card-title">Consumer Number</div>
                    <div className="card-value">{planDetails.consumer_number || 'Pending Assignment'}</div>
                  </div>
                  <div className="info-card">
                    <div className="card-icon">
                      <i className="fas fa-tachometer-alt"></i>
                    </div>
                    <div className="card-title">Meter Identification</div>
                    <div className="card-value">{planDetails.meter_id || 'Pending Installation'}</div>
                  </div>
                  <div className="info-card">
                    <div className="card-icon">
                      <i className="fas fa-bolt"></i>
                    </div>
                    <div className="card-title">Tariff Category</div>
                    <div className="card-value">
                      {planDetails.tariff_type}
                      <div className="status-container">
                        <span className="status-badge">
                          <i className="fas fa-check-circle me-1"></i>
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {extraCharges && (
                <>
                  <div className="charges-section">
                    <div className="section-header">
                      <h2 className="section-title">Billing Components</h2>
                      <p className="section-subtitle">
                        Breakdown of charges applicable to your electricity bill
                      </p>
                    </div>
                    <div className="charges-grid">
                      <div className="charge-card">
                        <div className="charge-icon">
                          <i className="fas fa-coins"></i>
                        </div>
                        <div className="charge-label">Fixed Charge</div>
                        <div className="charge-amount">₹{extraCharges.fixed_charge.toFixed(2)}</div>
                      </div>
                      <div className="charge-card">
                        <div className="charge-icon">
                          <i className="fas fa-tachometer-alt"></i>
                        </div>
                        <div className="charge-label">Meter Rent</div>
                        <div className="charge-amount">₹{extraCharges.meter_rent.toFixed(2)}</div>
                      </div>
                      <div className="charge-card">
                        <div className="charge-icon">
                          <i className="fas fa-zap"></i>
                        </div>
                        <div className="charge-label">Electricity Duty</div>
                        <div className="charge-amount">₹{extraCharges.electricity_duty.toFixed(2)}</div>
                      </div>
                      <div className="charge-card">
                        <div className="charge-icon">
                          <i className="fas fa-fire"></i>
                        </div>
                        <div className="charge-label">Fuel Surcharge</div>
                        <div className="charge-amount">₹{extraCharges.fuel_charge.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    <Footer/>
      {/* Bootstrap JS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
}