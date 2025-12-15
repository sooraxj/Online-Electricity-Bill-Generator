import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const StaffProfile = () => {
  const [staffDetails, setStaffDetails] = useState(null);
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
    if (user.role !== 'staff') {
      navigate('/');
      return;
    }

    const fetchStaffDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/staff/${user.staff_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch staff details');
        }
        const data = await response.json();
        setStaffDetails({
          name: data.name || 'N/A',
          username: data.username || 'N/A',
          contact: data.contact || 'N/A',
          staff_id: data.staff_id || 'N/A',
          login_status: data.login_status || 'N/A',
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch staff details');
        setLoading(false);
      }
    };

    fetchStaffDetails();
  }, [navigate]);

  const profileFields = [
    { key: 'username', label: 'Username', icon: 'fas fa-user' },
    { key: 'name', label: 'Full Name', icon: 'fas fa-id-badge' },
    { key: 'contact', label: 'Contact', icon: 'fas fa-phone' },
    { key: 'login_status', label: 'Status', icon: 'fas fa-signal' },
  ];

  if (loading) {
    return (
      <div className="readings-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading staff profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="readings-container">
        <div className="content-area">
          <div className="message" style={{ background: 'linear-gradient(135deg, #b91c1c, #991b1b)' }}>
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              <i className="fas fa-sync-alt"></i> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="readings-container">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeInScale {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }

        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .readings-container {
          background: #f8fafc;
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          width: 100%;
          max-width: 100%;
          margin: 0;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .readings-header {
          background: #020024;
          color: white;
          padding: 2.5rem;
          text-align: center;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .readings-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: -50%;
          width: 200%;
          height: 100%;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          animation: shimmer 4s infinite;
        }

        .readings-title {
          font-size: 2.25rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.025em;
          position: relative;
          z-index: 1;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .content-area {
          padding: 2.5rem;
        }

        .message {
          padding: 1rem 1.5rem;
          margin: 0 2rem 2rem;
          border-radius: 8px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          text-align: center;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
          animation: slideInUp 0.5s ease-out;
          border-left: 4px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .info-card {
          background: linear-gradient(145deg, #ffffff, #f1f5f9);
          padding: 1.75rem;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          animation: fadeInScale 0.5s ease-out;
          animation-fill-mode: both;
          position: relative;
          overflow: hidden;
        }

        .info-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(180deg, #020024, #1e40af);
          transition: width 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06);
          border-color: #020024;
        }

        .info-card:hover::before {
          width: 12px;
        }

        .info-label {
          font-weight: 500;
          color: #4b5563;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-value {
          color: #1f2a44;
          font-size: 1.25rem;
          font-weight: 600;
          word-break: break-word;
          line-height: 1.4;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          min-width: fit-content;
        }

        .status-active {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          box-shadow: 0 2px 6px rgba(34, 197, 94, 0.3);
        }

        .status-inactive {
          background: linear-gradient(135deg, #b91c1c, #991b1b);
          color: white;
          box-shadow: 0 2px 6px rgba(185, 28, 28, 0.3);
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #2563eb, #1e3a8a);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          color: #4b5563;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .loading-text {
          font-size: 1.125rem;
          font-weight: 500;
        }

        @media (max-width: 1200px) {
          .readings-container {
            margin: 0;
          }
        }

        @media (max-width: 1024px) {
          .info-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .readings-header {
            padding: 1.5rem 1rem;
          }
          
          .readings-title {
            font-size: 1.75rem;
          }
          
          .content-area {
            padding: 1.5rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .info-card {
            padding: 1.25rem;
          }

          .btn-primary {
            width: 100%;
            max-width: 300px;
          }
        }

        .info-card:nth-child(1) { animation-delay: 0.1s; }
        .info-card:nth-child(2) { animation-delay: 0.2s; }
        .info-card:nth-child(3) { animation-delay: 0.3s; }
        .info-card:nth-child(4) { animation-delay: 0.4s; }
      `}</style>

      <div className="readings-header">
        <h1 className="readings-title">
          <i className="fas fa-user-circle" style={{ marginRight: '0.75rem' }}></i>
          Staff Profile
        </h1>
      </div>

      <div className="content-area">
        {error && (
          <div className="message" style={{ background: 'linear-gradient(135deg, #b91c1c, #991b1b)' }}>
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        {staffDetails && (
          <>
            <div className="info-grid">
              {profileFields.map((field, index) => (
                <div key={field.key} className="info-card">
                  <div className="info-label">
                    <i className={field.icon}></i>
                    {field.label}
                  </div>
                  <div className="info-value">
                    {field.key === 'login_status' ? (
                      <span className={`status-badge ${staffDetails[field.key] === 'active' ? 'status-active' : 'status-inactive'}`}>
                        <i className={`fas ${staffDetails[field.key] === 'active' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                        {staffDetails[field.key] || 'N/A'}
                      </span>
                    ) : (
                      staffDetails[field.key] || 'Not Provided'
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffProfile;