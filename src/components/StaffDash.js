import React from 'react';

const StaffDash = () => {
  // Get staff details from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const staffName = user.name || 'Staff';

  return (
    <div className="dashboard-container">
      <style jsx>{`
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          background: #ffffff;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          width: 100%;
          max-width: 100%;
          margin: 0;
          overflow: hidden;
        }

        .dashboard-header {
          background: #020024;
          color: white;
          padding: 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .dashboard-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: -50%;
          width: 200%;
          height: 100%;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.025em;
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .welcome-message {
          font-size: 1.25rem;
          color: #475569;
          text-align: center;
          margin: 2rem 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
          border: 1px solid #e2e8f0;
        }

        .stat-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .stat-card p {
          font-size: 1.75rem;
          font-weight: 700;
          color: #3b82f6;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 1.5rem 1rem;
          }

          .dashboard-title {
            font-size: 1.8rem;
          }

          .welcome-message {
            font-size: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            padding: 1rem;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <i className="fas fa-chart-pie" style={{ marginRight: '0.75rem' }}></i>
            Staff Dashboard
          </h1>
        </div>
        <div className="welcome-message">
          Welcome, {staffName}! Manage your tasks and view your profile from the sidebar.
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Readings Taken</h3>
            <p>0</p>
          </div>
          <div className="stat-card">
            <h3>Pending Tasks</h3>
            <p>0</p>
          </div>
          <div className="stat-card">
            <h3>Customers Assigned</h3>
            <p>0</p>
          </div>
        </div>
      </div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default StaffDash;