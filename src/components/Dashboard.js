import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from './Navbar';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
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
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
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

  const { totalCustomers, activeCustomers, totalStaff, totalIncome, recentBills, monthlyIncome, customerGrowth } = dashboardData;

  // Bar chart for monthly income
  const incomeChartData = {
    labels: monthlyIncome.map(item => `${item.month}/${item.year}`),
    datasets: [
      {
        label: 'Monthly Income (₹)',
        data: monthlyIncome.map(item => item.total_amount),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: '#1e40af',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart for customer growth by tariff type
  const customerGrowthChartData = {
    labels: customerGrowth.map(item => item.tariff_type),
    datasets: [
      {
        data: customerGrowth.map(item => item.count),
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 12, family: 'Inter' } },
      },
      tooltip: {
        backgroundColor: '#1f2a44',
        titleFont: { size: 14, family: 'Inter' },
        bodyFont: { size: 12, family: 'Inter' },
      },
    },
  };

  return (
    <div className="dashboard-container">
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
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .dashboard-container {
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

        .dashboard-header {
          background: linear-gradient(135deg, #1e3a8a, #1e40af);
          color: white;
          padding: 2.5rem;
          text-align: center;
          position: relative;
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
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          animation: shimmer 4s infinite;
        }

        .dashboard-title {
          font-size: 2.25rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.025em;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .content-area {
          padding: 2.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: linear-gradient(145deg, #ffffff, #f1f5f9);
          padding: 1.75rem;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          animation: fadeInScale 0.5s ease-out;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(180deg, #020024, #1e40af);
          transition: width 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06);
          border-color: #020024;
        }

        .stat-card:hover::before {
          width: 12px;
        }

        .stat-label {
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

        .stat-value {
          color: #1f2a44;
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .chart-container {
          background: #ffffff;
          padding: 1.75rem;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
          height: 300px;
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
          .dashboard-container {
            margin: 0;
          }
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 1.5rem 1rem;
          }

          .dashboard-title {
            font-size: 1.75rem;
          }

          .content-area {
            padding: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .chart-container {
            height: 250px;
          }

        
      `}</style>

    

      <div className="content-area">
        {error && (
          <div className="message" style={{ background: 'linear-gradient(135deg, #b91c1c, #991b1b)' }}>
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        {dashboardData && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">
                  <i className="fas fa-users"></i>
                  Total Customers
                </div>
                <div className="stat-value">{totalCustomers}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">
                  <i className="fas fa-user-check"></i>
                  Active Customers
                </div>
                <div className="stat-value">{activeCustomers}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">
                  <i className="fas fa-user-tie"></i>
                  Total Staff
                </div>
                <div className="stat-value">{totalStaff}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">
                  <i className="fas fa-rupee-sign"></i>
                  Total Income
                </div>
                <div className="stat-value">₹{totalIncome.toFixed(2)}</div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="chart-container">
                <Bar data={incomeChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'Monthly Income', font: { size: 16, family: 'Inter' } } } }} />
              </div>
              <div className="chart-container">
                <Pie data={customerGrowthChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'Customer Distribution by Tariff', font: { size: 16, family: 'Inter' } } } }} />
              </div>
            </div>

            
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;