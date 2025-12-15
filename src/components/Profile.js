import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [profileDetails, setProfileDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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

    const fetchProfileDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/customer/fetch-profile/${user.customer_id}`);
        setProfileDetails(response.data);
        setFormData({
          name: response.data.name,
          address: response.data.address,
          phone_number: response.data.phone_number,
          place: response.data.place || '',
          pin_code: response.data.pin_code || '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err.response || err);
        setError(err.response?.data?.error || 'Failed to fetch profile details');
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    const validations = [
      { condition: formData.name.length < 3, message: 'Name must be at least 3 characters long' },
      { condition: formData.address.length < 5, message: 'Address must be at least 5 characters long' },
      { condition: !/^[0-9]{10}$/.test(formData.phone_number), message: 'Phone number must be a valid 10-digit number' },
      { condition: formData.place.length < 3, message: 'Place must be at least 3 characters long' },
      { condition: !/^[1-9][0-9]{5}$/.test(formData.pin_code), message: 'Pin code must be a valid 6-digit number' },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        setError(validation.message);
        return;
      }
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/customer/update-profile/${userData.customer_id}`,
        formData
      );
      setProfileDetails({ ...profileDetails, ...formData });
      setIsEditing(false);
      setSuccessMessage(response.data.message || 'Profile updated successfully');
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Update error:', err.response || err);
      setError(err.response?.data?.error || err.response?.data?.details || 'Failed to update profile');
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError(null);
    setSuccessMessage(null);
  };

  const profileFields = [
    { key: 'username', label: 'Username', icon: 'fas fa-user', editable: false },
    { key: 'name', label: 'Full Name', icon: 'fas fa-id-badge', editable: true },
    { key: 'address', label: 'Address', icon: 'fas fa-map-marker-alt', editable: true },
    { key: 'phone_number', label: 'Phone Number', icon: 'fas fa-phone', editable: true },
    { key: 'place', label: 'Place', icon: 'fas fa-city', editable: true },
    { key: 'pin_code', label: 'Pin Code', icon: 'fas fa-mail-bulk', editable: true },
    { key: 'ration_card', label: 'Ration Card', icon: 'fas fa-receipt', editable: false },
    { key: 'aadhar_number', label: 'Aadhar Number', icon: 'fas fa-id-card', editable: false },
    { key: 'consumer_number', label: 'Consumer Number', icon: 'fas fa-plug', editable: false },
    { key: 'meter_id', label: 'Meter ID', icon: 'fas fa-tachometer-alt', editable: false },
    { key: 'tariff_type', label: 'Tariff Type', icon: 'fas fa-bolt', editable: false },
    { key: 'status', label: 'Account Status', icon: 'fas fa-signal', editable: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner mb-3"></div>
          <p className="text-muted">Loading profile information...</p>
        </div>
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="alert alert-danger shadow-sm">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <i className="fas fa-refresh me-2"></i>Retry
          </button>
        </div>
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

        .main-content {
          background: #f8fafc;
          padding: 3rem 0;
          min-height: 60vh;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .profile-header {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .profile-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: center; 
        }

        .profile-subtitle {
          color: #64748b;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          line-height: 1.5;
          text-align:center;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center; 
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .info-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        }

        .info-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .card-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #020024 0%, #00aeef 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: white;
          flex-shrink: 0;
        }

        .card-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          margin: 0;
        }

        .card-value {
          font-size: 1rem;
          font-weight: 500;
          color: #0f172a;
          line-height: 1.4;
          word-break: break-word;
          min-height: 1.5rem;
        }

        .form-container {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-group {
          position: relative;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          display: block;
        }

        .form-label .required {
          color: #dc2626;
          margin-left: 0.25rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.925rem;
          color: #0f172a;
          background: #fefefe;
          transition: all 0.2s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: #00aeef;
          box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.1);
          background: white;
        }

        .form-input:invalid {
          border-color: #dc2626;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.925rem;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          white-space: nowrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, #020024 0%, #00aeef 100%);
          color: white;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #1a1a3d 0%, #0094cc 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 174, 239, 0.3);
        }

        .btn-secondary {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        .btn-outline {
          background: transparent;
          color: #0f172a;
          border: 1.5px solid #000000ff;
        }

        .btn-outline:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .alert {
          border: none;
          border-radius: 8px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .alert-success {
          background: #f0fdf4;
          color: #15803d;
          border-left: 4px solid #22c55e;
        }

        .alert-danger {
          background: #fef2f2;
          color: #dc2626;
          border-left: 4px solid #ef4444;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid transparent;
          border-top: 3px solid #00aeef;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .text-theme-cyan {
          background: linear-gradient(135deg, #00aeef 0%, #0094cc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .status-active {
          background: #dcfce7;
          color: #166534;
        }

        .status-inactive {
          background: #fef2f2;
          color: #991b1b;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .content-container {
            padding: 0 1rem;
          }

          .main-content {
            padding: 2rem 0;
          }

          .profile-header {
            padding: 1.5rem;
          }

          .form-container {
            padding: 1.5rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            justify-content: center;
          }

          .form-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .btn {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .profile-title {
            font-size: 1.5rem;
          }

          .info-card {
            padding: 1.25rem;
          }
        }
      `}</style>

      {/* Hero Section - Kept as requested */}
      <section className="hero-section">
        <div className="container position-relative">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-4">
                Your <span className="text-theme-cyan">Profile</span>
              </h1>
              <p className="lead text-white opacity-90">
                Manage your personal information and account details
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="main-content">
        <div className="content-container">
          {/* Notification Messages */}
          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle"></i>
              {successMessage}
            </div>
          )}

          {profileDetails && (
            <>
              {/* Profile Header */}
              <div className="profile-header">
                <h2 className="profile-title">
                  <i className="fas fa-user-circle"></i>
                  Account Information
                </h2>
                <p className="profile-subtitle">
                  {isEditing 
                    ? 'Update your personal information below. All fields marked with * are required.'
                    : 'View your registered personal details and account information. Click Edit Profile to make changes.'
                  }
                </p>
                <div className="action-buttons">
                  {!isEditing ? (
                    <button className="btn btn-primary" onClick={toggleEdit}>
                      <i className="fas fa-edit"></i>
                      Edit Profile
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={toggleEdit}>
                      <i className="fas fa-times"></i>
                      Cancel Changes
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Content */}
              {!isEditing ? (
                <div className="info-grid">
                  {profileFields.map((field) => (
                    <div key={field.key} className="info-card">
                      <div className="card-header">
                        <div className="card-icon">
                          <i className={field.icon}></i>
                        </div>
                        <h6 className="card-title">{field.label}</h6>
                      </div>
                      <div className="card-value">
                        {field.key === 'status' ? (
                          <span className={`status-badge ${profileDetails[field.key] === 'active' ? 'status-active' : 'status-inactive'}`}>
                            {profileDetails[field.key] || 'N/A'}
                          </span>
                        ) : (
                          profileDetails[field.key] || 'Not Provided'
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="form-container">
                  <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">
                          Full Name <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your full name"
                          required
                          minLength={3}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Phone Number <span className="required">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter 10-digit phone number"
                          pattern="[0-9]{10}"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Address <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your complete address"
                          required
                          minLength={5}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Place <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="place"
                          value={formData.place}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your city/place"
                          required
                          minLength={3}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Pin Code <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="pin_code"
                          value={formData.pin_code}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter 6-digit PIN code"
                          pattern="[1-9][0-9]{5}"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-save"></i>
                        Save Changes
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={toggleEdit}>
                        <i className="fas fa-times"></i>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer/>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
}