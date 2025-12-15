import { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; // Import the reusable Navbar component
import Footer from './Footer';

export default function Signup() {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for the field being edited
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    // Username (email) validation
    if (!form.username) {
      newErrors.username = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.username)) {
      newErrors.username = 'Please enter a valid email address';
    }

    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters long';
    }

    // Name validation
    if (!form.name) {
      newErrors.name = 'Full Name is required';
    } else if (form.name.length < 3) {
      newErrors.name = 'Full Name must be at least 3 characters';
    }

    // Address validation
    if (!form.address) {
      newErrors.address = 'Address is required';
    } else if (form.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    // Place validation
    if (!form.place) {
      newErrors.place = 'Place is required';
    } else if (form.place.length < 3) {
      newErrors.place = 'Place must be at least 3 characters';
    }

    // Phone Number validation
    if (!form.phone_number) {
      newErrors.phone_number = 'Phone Number is required';
    } else if (!/^[0-9]{10}$/.test(form.phone_number)) {
      newErrors.phone_number = 'Phone Number must be exactly 10 digits';
    }

    // Pincode validation
    if (!form.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[1-9][0-9]{5}$/.test(form.pincode)) {
      newErrors.pincode = 'Pincode must be exactly 6 digits and not start with 0';
    }

    // Tariff Type validation
    if (!form.tariff_type) {
      newErrors.tariff_type = 'Connection Type is required';
    }

    // Ration Card validation (optional, so only validate if provided)
    if (form.ration_card && form.ration_card.length > 20) {
      newErrors.ration_card = 'Ration Card number cannot exceed 20 characters';
    }

    // Aadhar Number validation
    if (!form.aadhar_number) {
      newErrors.aadhar_number = 'Aadhar Number is required';
    } else if (!/^[0-9]{12}$/.test(form.aadhar_number)) {
      newErrors.aadhar_number = 'Aadhar Number must be exactly 12 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkUniqueness = async (field, value) => {
    if (!value) return false; // Skip check if value is empty
    try {
      const response = await axios.get(`http://localhost:5000/api/check-unique/${field}/${value}`);
      return response.data.exists;
    } catch (err) {
      console.error(`Error checking uniqueness for ${field}:`, err);
      return false;
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    // Check uniqueness for aadhar_number, username, phone_number, and ration_card
    const uniquenessChecks = [
      { field: 'aadhar_number', value: form.aadhar_number, errorMsg: 'Aadhar Number already exists' },
      { field: 'username', value: form.username, errorMsg: 'Email already exists' },
      { field: 'phone_number', value: form.phone_number, errorMsg: 'Phone Number already exists' },
      { field: 'ration_card', value: form.ration_card, errorMsg: 'Ration Card already exists' },
    ];

    const newErrors = {};
    for (const check of uniquenessChecks) {
      if (check.value) {
        const exists = await checkUniqueness(check.field, check.value);
        if (exists) {
          newErrors[check.field] = check.errorMsg;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('Some fields contain values that already exist. Please check the errors.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/register', form);
      alert('Registered successfully! Awaiting admin approval.');
      setForm({}); // Clear form on success
      setErrors({});
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  const fields = [
    { name: 'username', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'name', label: 'Full Name', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'place', label: 'Place (Town/City)', type: 'text' },
    { name: 'phone_number', label: 'Phone Number', type: 'tel' },
    { name: 'pincode', label: 'Pincode', type: 'text', pattern: '[1-9][0-9]{5}' },
    { name: 'tariff_type', label: 'Connection Type', type: 'select', options: ['Domestic', 'Commercial', 'Industrial'] },
    { name: 'ration_card', label: 'Ration Card', type: 'text' },
    { name: 'aadhar_number', label: 'Aadhar Number', type: 'text', pattern: '[0-9]{12}' },
  ];

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

        .signup-container {
          max-width: 900px;
          margin: 4rem auto;
          padding: 2.5rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 174, 239, 0.15);
          position: relative;
          overflow: hidden;
        }

        .signup-container::before {
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

        .form-control.is-invalid {
          border-color: #dc3545;
          background: #fff5f5;
        }

        .invalid-feedback {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
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
        }

        .btn-primary-custom:hover {
          background: #00aeef;
          color: #020024;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 174, 239, 0.4);
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

        .form-label {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 6rem 0 3rem;
          }

          .signup-container {
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container position-relative">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-4">
                Get <span className="text-theme-cyan">Connected</span>
              </h1>
              <p className="lead text-white opacity-90">
                Apply for a new electricity connection. Fill out the form below to get started with your application.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="signup-container">
        <h3 className="section-title text-theme-primary">Apply For Connection</h3>
        <div className="row">
          {fields.map((field) => (
            <div key={field.name} className="col-md-6 mb-3">
              {field.type === 'select' ? (
                <>
                  <label htmlFor={field.name} className="form-label">{field.label}</label>
                  <select
                    name={field.name}
                    id={field.name}
                    className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
                    onChange={handleChange}
                    value={form[field.name] || ''}
                  >
                    <option value="" disabled>Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors[field.name] && (
                    <div className="invalid-feedback">{errors[field.name]}</div>
                  )}
                </>
              ) : (
                <>
                  <label htmlFor={field.name} className="form-label">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    placeholder={field.label}
                    className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
                    onChange={handleChange}
                    value={form[field.name] || ''}
                    pattern={field.pattern}
                    title={field.pattern ? `Please enter a valid ${field.label}` : undefined}Z
                  />
                  {errors[field.name] && (
                    <div className="invalid-feedback">{errors[field.name]}</div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <button className="btn btn-primary-custom mt-3" onClick={handleSignup}>
          <i className="fas fa-user-plus me-2"></i>
          Register
        </button>
      </div>
    <Footer/>
      {/* Bootstrap JS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
}