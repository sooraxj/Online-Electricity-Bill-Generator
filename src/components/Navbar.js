import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [customerId, setCustomerId] = useState('');

  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is logged in

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    setIsLoggedIn(true);
    setUserRole(userData.role);
    setUsername(userData.username);
    setName(userData.name); 
    setStaffId(userData.staff_id || null);
    setCustomerId(userData.customer_id || null);
    console.log("Loaded user name:", userData.name); // Debug
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole('');
    setUsername('');
    setShowDropdown(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
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
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
             <li className="nav-item me-3">
              <Link to={isLoggedIn ? "/Home" : "/"} className="nav-link nav-link-custom">
                Home
              </Link>
            </li>
              <li className="nav-item me-3">
                <Link to="/about" className="nav-link nav-link-custom">About</Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/tariffs" className="nav-link nav-link-custom">Tariffs</Link>
              </li>
               {isLoggedIn && (
                <>
                  <li className="nav-item me-3">
                    <Link to="/Plan" className="nav-link nav-link-custom">My Plan</Link>
                  </li>
                  <li className="nav-item me-3">
                    <Link to="/bills" className="nav-link nav-link-custom">Bills</Link>
                  </li>
                </>
              )}
              <li className="nav-item me-3">
                <Link to="/contact" className="nav-link nav-link-custom">Contact</Link>
              </li>
              
              
              {/* Conditional rendering based on login status */}
              {!isLoggedIn ? (
                // Show Login and Apply buttons when not logged in
                <>
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
                </>
              ) : (
                // Show Profile dropdown when logged in
                <li className="nav-item dropdown">
                  <button 
                    className="btn btn-profile-custom rounded-pill px-4 fw-semibold dropdown-toggle"
                    onClick={toggleDropdown}
                    aria-expanded={showDropdown}
                  >
                    <i className="fas fa-user-circle me-2"></i>
                {name } 
                  </button>
                  {showDropdown && (
                    <div className="dropdown-menu dropdown-menu-end show profile-dropdown">
                      <div className="dropdown-header">
                        <i className="fas fa-user-circle me-2"></i>
                        <strong>{username}</strong>
                        <br />
                      </div>
                      <div className="dropdown-divider"></div>
                      {userRole === 'customer' && (
                        <>
                          <Link to="/profile" className="dropdown-item">
                            <i className="fas fa-user me-2"></i>
                            My Profile
                          </Link>
                        </>
                      )}
                
                      <div className="dropdown-divider"></div>
                      <button 
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>

        <style jsx>{`
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            scroll-behavior: smooth;
          }

          .navbar-custom {
            background: #020024 !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
            transition: all 0.3s ease !important;
            padding: 1rem 0 !important;
            border-bottom: 1px solid #fff;
          }

          .navbar-scrolled {
            background: rgba(2, 0, 36, 0.95) !important;
            backdrop-filter: blur(12px) !important;
          }

          .navbar-brand {
            color: white !important;
            font-weight: 700 !important;
            font-size: 2rem !important;
          }

          .nav-link-custom {
            color: white !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            padding-bottom: 0.5rem !important;
          }

          .nav-link-custom:hover {
            color: #00aeef !important;
          }

          .nav-link-custom::after {
            content: '';
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 0 !important;
            height: 2px !important;
            background: #00aeef !important;
            transition: width 0.3s ease !important;
          }

          .nav-link-custom:hover::after {
            width: 100% !important;
          }

          .btn-primary-custom {
            background: #020024 !important;
            border: 2px solid #00aeef !important;
            padding: 0.9rem 2.2rem !important;
            border-radius: 50px !important;
            font-weight: 600 !important;
            color: white !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(0, 174, 239, 0.2) !important;
            display: inline-block !important;
            text-align: center !important;
          }

          .btn-primary-custom:hover {
            background: #00aeef !important;
            color: #020024 !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 20px rgba(0, 174, 239, 0.4) !important;
          }

          .btn-secondary-custom {
            background: #020024 !important;
            border: 2px solid #00aeef !important;
            padding: 0.9rem 2.2rem !important;
            border-radius: 50px !important;
            font-weight: 600 !important;
            color: white !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(0, 174, 239, 0.2) !important;
            display: inline-block !important;
            text-align: center !important;
          }

          .btn-secondary-custom:hover {
            background: #00aeef !important;
            color: #020024 !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 20px rgba(0, 174, 239, 0.4) !important;
          }

          .btn-outline-cyan {
            border: 2px solid #00aeef !important;
            color: #00aeef !important;
            background: transparent !important;
            padding: 0.9rem 2.2rem !important;
            border-radius: 50px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: inline-block !important;
            text-align: center !important;
          }

          .btn-outline-cyan:hover {
            background: #00aeef !important;
            color: #020024 !important;
            box-shadow: 0 6px 20px rgba(0, 174, 239, 0.3) !important;
          }

          .btn-profile-custom {
            background: #00aeef !important;
            border: 2px solid #00aeef !important;
            padding: 0.9rem 2.2rem !important;
            border-radius: 50px !important;
            font-weight: 600 !important;
            color: #020024 !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(0, 174, 239, 0.3) !important;
            position: relative !important;
          }

          .btn-profile-custom:hover {
            background: #020024 !important;
            color: #00aeef !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(0, 174, 239, 0.4) !important;
          }

          .dropdown-menu {
            background: white !important;
            border: 1px solid rgba(0, 174, 239, 0.15) !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
            padding: 0.5rem 0 !important;
            margin-top: 0.5rem !important;
            min-width: 250px !important;
          }

          .profile-dropdown {
            position: absolute !important;
            top: 100% !important;
            right: 0 !important;
            z-index: 1000 !important;
          }

          .dropdown-header {
            padding: 0.75rem 1rem !important;
            background: rgba(0, 174, 239, 0.05) !important;
            border-bottom: 1px solid rgba(0, 174, 239, 0.1) !important;
            font-size: 0.9rem !important;
          }

          .dropdown-item {
            padding: 0.6rem 1rem !important;
            transition: all 0.2s ease !important;
            color: #374151 !important;
            font-weight: 500 !important;
            text-decoration: none !important;
            border: none !important;
            background: none !important;
            width: 100% !important;
            text-align: left !important;
          }

          .dropdown-item:hover {
            background: rgba(0, 174, 239, 0.1) !important;
            color: #020024 !important;
          }

          .dropdown-item.text-danger {
            color: #dc2626 !important;
          }

          .dropdown-item.text-danger:hover {
            background: rgba(220, 38, 38, 0.1) !important;
            color: #dc2626 !important;
          }

          .dropdown-divider {
            margin: 0.5rem 0 !important;
            border-color: rgba(0, 174, 239, 0.15) !important;
          }

          .dropdown-toggle::after {
            margin-left: 0.5rem !important;
            border-top: 0.3em solid !important;
            border-right: 0.3em solid transparent !important;
            border-left: 0.3em solid transparent !important;
          }

          .text-theme-cyan {
            color: #00aeef !important;
          }

          @media (max-width: 768px) {
            .navbar-brand {
              font-size: 1.5rem !important;
            }

            .btn-primary-custom,
            .btn-secondary-custom,
            .btn-outline-cyan,
            .btn-profile-custom {
              padding: 0.7rem 1.5rem !important;
              font-size: 0.9rem !important;
            }

            .dropdown-menu {
              min-width: 220px !important;
            }
          }
        `}</style>
      </nav>
    </>
  );
}