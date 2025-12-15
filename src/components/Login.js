import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      const { role, username: returnedUsername, name, staff_id, customer_id } = res.data;

      const userData = {
        username: returnedUsername,
        role: role,
        name: name || '',
        staff_id: staff_id || null, // Include staff_id for staff
        customer_id: customer_id || null, // Include customer_id for customers
        isLoggedIn: true
      };
      localStorage.setItem('user', JSON.stringify(userData));

      // Navigate based on role
      if (role === 'customer') navigate('/Home');
      else if (role === 'admin') navigate('/admin');
      else if (role === 'staff') navigate('/staff');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Reusable Navbar Component */}
      <Navbar />
      
      {/* Bootstrap CSS */}
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

        .login-container {
          max-width: 500px;
          margin: 4rem auto;
          padding: 2.5rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 174, 239, 0.15);
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #020024, #00aeef);
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2rem;
          position: relative;
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

        .form-control {
          border: 1px solid rgba(0, 174, 239, 0.3);
          border-radius: 8px;
          padding: 0.8rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .form-control:focus {
          border-color: #00aeef;
          box-shadow: 0 0 8px rgba(0, 174, 239, 0.3);
          background: white;
          outline: none;
        }

        .form-control::placeholder {
          color: #6b7280;
          opacity: 0.8;
        }

        .btn-primary-custom {
          background: #020024;
          border: 2px solid #00aeef;
          padding: 0.9rem 2.2rem;
          border-radius: 50px;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 174, 239, 0.2);
          width: 100%;
          text-align: center;
          position: relative;
        }

        .btn-primary-custom:hover:not(:disabled) {
          background: #00aeef;
          color: #020024;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 174, 239, 0.4);
        }

        .btn-primary-custom:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-right: 8px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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

        h3 {
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .forgot-password {
          color: #00aeef;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .forgot-password:hover {
          color: #020024;
        }

        .login-form {
          position: relative;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 6rem 0 3rem;
          }

          .login-container {
            margin: 3rem 1rem;
            padding: 1.5rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .btn-primary-custom {
            padding: 0.7rem 1.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <section className="hero-section">
        <div className="container position-relative">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-4">
                Welcome <span className="text-theme-cyan">Back</span>
              </h1>
              <p className="lead text-white opacity-90">
                Sign in to your account to access your electricity services and manage your connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="login-container">
        <h3 className="section-title text-theme-primary">Login</h3>
        <div className="login-form">
          <input
            type="text"
            className="form-control my-3"
            placeholder="Enter your username/email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <input
            type="password"
            className="form-control my-3"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button 
            className="btn btn-primary-custom" 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt me-2"></i>
                Login
              </>
            )}
          </button>
          
          <div className="text-center mt-4">
            <p className="text-muted">
              Don't have an account? 
              <a href="/signup" className="text-theme-cyan ms-2 text-decoration-none fw-semibold">
                Apply Now
              </a>
            </p>
          </div>
        </div>
      </div>
    <Footer/>
      {/* Bootstrap JS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
}