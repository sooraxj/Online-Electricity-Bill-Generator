import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
  
      <style jsx>{`
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          scroll-behavior: smooth;
        }

        .footer-custom {
          background: #020024;
          color: white;
          padding: 4rem 0;
        }

        .footer-custom a {
          transition: color 0.3s ease;
        }

        .footer-custom a:hover {
          color: #00aeef;
        }

        .text-theme-cyan {
          color: #00aeef;
        }

        h1, h2, h3, h4, h5, h6 {
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        p, li {
          line-height: 1.7;
          color: #4b5563;
        }

        @media (max-width: 768px) {
          .footer-custom {
            padding: 2rem 0;
          }
        }
      `}</style>

      <footer className="footer-custom py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h5 className="fw-bold mb-4">
                <i className="fas fa-bolt text-theme-cyan me-2"></i>
                About BCEL
              </h5>
              <p className="text-light opacity-75 mb-4">
                Bengaluru City Electricity Limited is Karnataka's leading electricity distribution company, 
                committed to delivering reliable, sustainable, and innovative power solutions.
              </p>
              <div className="d-flex gap-3">
                <a href="#" className="text-light">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-light">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-light">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="text-light">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-2">
              <h5 className="fw-bold mb-4">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/home" className="text-light opacity-75 text-decoration-none">
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/bill-payment" className="text-light opacity-75 text-decoration-none">
                    Pay Bill
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/usage" className="text-light opacity-75 text-decoration-none">
                    Usage
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/support" className="text-light opacity-75 text-decoration-none">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h5 className="fw-bold mb-4">Services</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-light opacity-75 text-decoration-none">
                    Bill Payment
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-light opacity-75 text-decoration-none">
                    New Connection
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-light opacity-75 text-decoration-none">
                    Load Enhancement
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-light opacity-75 text-decoration-none">
                    Customer Support
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h5 className="fw-bold mb-4">Contact Info</h5>
              <div className="text-light opacity-75">
                <p className="mb-2">
                  <i className="fas fa-envelope me-2"></i>
                  support@bcel.co.in
                </p>
                <p className="mb-2">
                  <i className="fas fa-phone me-2"></i>
                  +91 80 1234 5678
                </p>
                <p className="mb-2">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  BCEL Headquarters, Bengaluru, Karnataka 560001
                </p>
              </div>
            </div>
          </div>
          <hr className="my-4 opacity-25" />
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-light opacity-75 mb-0">
                © 2025 Bengaluru City Electricity Limited. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex justify-content-md-end gap-3">
                <a href="#" className="text-light opacity-75 text-decoration-none small">
                  Privacy Policy
                </a>
                <a href="#" className="text-light opacity-75 text-decoration-none small">
                  Terms of Service
                </a>
                <a href="#" className="text-light opacity-75 text-decoration-none small">
                  Cookies Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;