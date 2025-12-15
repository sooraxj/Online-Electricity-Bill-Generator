import React, { useState } from 'react';
import Customers from './Customers';
import Dashboard from './Dashboard';
import Astaffs from './Astaffs';
import Atariffs from './Atariffs';
import Charges from './Charges';
import ReadingHistory from './ReadingHistory';
import Fines from './Fines';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'staffs':
        return <Astaffs />;
      case 'Atariffs':
        return <Atariffs />;
      case 'charges':
        return <Charges />;
      case 'fines':
        return <Fines />;
      case 'readingHistory':
        return <ReadingHistory />;
      default:
        return <Dashboard />;
    }
  };

const menuItems = [
  { id: 'dashboard', icon: 'fas fa-chart-pie', label: 'Dashboard' },
  { id: 'customers', icon: 'fas fa-users', label: 'Customers' },
  { id: 'staffs', icon: 'fas fa-user-tie', label: 'Staff' },
  { id: 'Atariffs', icon: 'fas fa-file-invoice-dollar', label: 'Tariffs' },
  { id: 'charges', icon: 'fas fa-dollar-sign', label: 'Charges' },
  { id: 'fines', icon: 'fas fa-exclamation-circle', label: 'Fines' },
  { id: 'readingHistory', icon: 'fas fa-history', label: 'Reading History' }
];

  return (
    <div className="admin-container">
      <style jsx>{`
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-container {
          display: flex;
          height: 100vh;
          background: #f8fafc;
        }

        .sidebar {
          width: ${sidebarCollapsed ? '80px' : '280px'};
          background: linear-gradient(135deg, #020024 0%, #1a1a3d 100%);
          color: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 2px 0 20px rgba(0, 0, 0, 0.15);
          position: fixed;
          height: 100vh;
          z-index: 1000;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          overflow-y: hidden;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: ${sidebarCollapsed ? 'center' : 'space-between'};
          min-height: 80px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          opacity: ${sidebarCollapsed ? '0' : '1'};
          transition: opacity 0.3s ease;
          ${sidebarCollapsed ? 'pointer-events: none; width: 0;' : ''}
        }

        .logo-icon {
          font-size: 1.5rem;
          color: #00aeef;
          background: rgba(0, 174, 239, 0.1);
          padding: 0.5rem;
          border-radius: 8px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .admin-title {
          font-size: 0.75rem;
          opacity: 0.7;
          font-weight: 400;
          color: #94a3b8;
        }

        .sidebar-toggle {
          background: rgba(0, 174, 239, 0.1);
          border: 1px solid rgba(0, 174, 239, 0.3);
          color: #00aeef;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .sidebar-toggle:hover {
          background: rgba(0, 174, 239, 0.2);
          border-color: rgba(0, 174, 239, 0.5);
        }

        .sidebar-menu {
          padding: 1rem 0;
          flex: 1;
          overflow: hidden;
        }

        .menu-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.875rem 1.5rem;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 0;
          margin: 0 0.5rem 0.25rem 0.5rem;
          border-radius: 8px;
          position: relative;
          gap: 0.75rem;
        }

        .menu-item:hover {
          background: rgba(0, 174, 239, 0.1);
          color: #00aeef;
        }

        .menu-item.active {
          background: rgba(0, 174, 239, 0.15);
          color: #00aeef;
          font-weight: 600;
        }

        .menu-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #00aeef;
          border-radius: 0 2px 2px 0;
        }

        .menu-item i {
          width: 20px;
          text-align: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .menu-label {
          opacity: ${sidebarCollapsed ? '0' : '1'};
          transition: opacity 0.3s ease;
          ${sidebarCollapsed ? 'pointer-events: none;' : ''}
        }

        .main-content {
          flex: 1;
          margin-left: ${sidebarCollapsed ? '80px' : '280px'};
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar {
          background: linear-gradient(135deg, #020024 0%, #1a1a3d 100%);
          color: white;
          padding: 1.25rem 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          min-height: 80px;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .navbar-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          text-transform: capitalize;
          margin: 0;
        }

        .breadcrumb {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logout-btn {
          background: transparent;
          color: white;
          border: 2px solid #00aeef;
          padding: 0.625rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logout-btn:hover {
          background: #00aeef;
          color: #020024;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 174, 239, 0.3);
        }

        .logout-btn:active {
          transform: translateY(0);
        }

        .content-area {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background: #f8fafc;
        }

        /* Tooltip for collapsed sidebar */
        .tooltip {
          position: absolute;
          left: 70px;
          background: #374151;
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 1001;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .tooltip::before {
          content: '';
          position: absolute;
          left: -4px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-right: 4px solid #374151;
        }

        ${sidebarCollapsed ? `
          .menu-item:hover .tooltip {
            opacity: 1;
          }
        ` : ''}

        @media (max-width: 768px) {
          .sidebar {
            width: ${sidebarCollapsed ? '0' : '100%'};
            transform: ${sidebarCollapsed ? 'translateX(-100%)' : 'translateX(0)'};
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .navbar {
            padding: 1rem;
          }
          
          .content-area {
            padding: 1rem;
          }

          .navbar-title {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .logout-btn span {
            display: none;
          }
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">
              <i className="fas fa-bolt"></i>
            </div>
            <div className="logo-text">
              <div className="logo">BCEL Admin</div>
              <div className="admin-title">Administration Panel</div>
            </div>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
        
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <i className={item.icon}></i>
              <span className="menu-label">{item.label}</span>
              {sidebarCollapsed && (
                <div className="tooltip">{item.label}</div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <nav className="navbar">
          <div className="navbar-left">
            <h1 className="navbar-title">{activeSection}</h1>
            <div className="breadcrumb">
              <i className="fas fa-home"></i>
              <span>Admin</span>
              <i className="fas fa-chevron-right"></i>
              <span style={{textTransform: 'capitalize'}}>{activeSection}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </nav>
        
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
      
      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default Admin;