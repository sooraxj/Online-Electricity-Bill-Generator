import React, { useState, useEffect } from 'react';

const ReadingHistory = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/customers');
      const data = await response.json();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setMessage('Error fetching customers data');
      setLoading(false);
    }
  };

  const handleViewDetails = async (customer) => {
    setDetailsLoading(true);
    setShowDetailsModal(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/customer-history/${customer.customer_id}`);
      const data = await response.json();
      if (response.ok) {
        setCustomerDetails(data);
      } else {
        setMessage(data.error || 'Error fetching customer history');
        setCustomerDetails([]);
      }
    } catch (error) {
      console.error('Error fetching customer history:', error);
      setMessage('Error fetching customer history');
      setCustomerDetails([]);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setCustomerDetails([]);
    setMessage('');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #00aeef',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Loading customers...</p>
      </div>
    );
  };

  return (
    <div className="readings-container">
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeInScale {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }

        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .readings-container {
          background: #ffffff;
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          width: 100%;
          max-width: 100%;
          margin: 0;
          overflow: hidden;
        }

        .readings-header {
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

        .readings-header::before {
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

        .readings-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.025em;
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .message {
          padding: 1rem 1.5rem;
          margin: 2rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          text-align: center;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          animation: slideIn 0.5s ease-out;
          border-left: 4px solid rgba(255, 255, 255, 0.3);
        }

        /* Enhanced Modal Styles */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 1000px;
          max-height: 85vh;
          overflow: hidden;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          position: relative;
          animation: fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          background: #020024;
          color: white;
          padding: 2rem 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .modal-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 2s infinite;
        }

        .modal-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 0 auto; /* centers the element horizontally */
          display: flex;
          align-items: center;
          justify-content: center; 
          gap: 0.75rem;
          letter-spacing: -0.025em;
          text-align: center;
        }

        .modal-title i {
          color: #60a5fa;
          font-size: 1.5rem;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 44px;
          height: 44px;
          border-radius: 12px;
          font-size: 1.25rem;
          cursor: pointer;
          color: white;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
          transform: scale(1.05);
          color: #fca5a5;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f1f5f9;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .loading-text {
          font-size: 1.125rem;
          font-weight: 500;
        }

        .customer-info-section {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 2.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-title i {
          color: #3b82f6;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .info-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          animation: slideInUp 0.5s ease-out;
          animation-fill-mode: both;
        }

        .info-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-color: #d1d5db;
        }

        .info-label {
          font-weight: 600;
          color: #6b7280;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .info-value {
          color: #111827;
          font-size: 1.125rem;
          font-weight: 600;
          word-break: break-word;
          
        }

        .billing-section {
          padding: 2.5rem;
        }

        .billing-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .billing-stats {
          display: flex;
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #3b82f6;
          display: block;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
          
        }

        .billing-table-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .billing-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
          font-size: 0.875rem;
        }

        .billing-table th {
          background: #020024;
          color: white;
          padding: 1.25rem 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.8125rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #0f172a;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .billing-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          color: #374151;
          font-weight: 500;
          vertical-align: middle;
        }

        .billing-table tbody tr {
          transition: all 0.2s ease;
          background: white;
        }

        .billing-table tbody tr:hover {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          transform: translateX(4px);
        }

        .billing-table tbody tr:nth-child(even) {
          background: #fafbfc;
        }

        .billing-table tbody tr:nth-child(even):hover {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }

        .amount-cell {
          font-weight: 700;
          color: #059669;
          font-family: 'SF Mono', 'Monaco', monospace;
        }

        .status-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-badge {
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          min-width: fit-content;
        }

        .status-paid {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }

        .status-pending {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
        }

        .status-overdue {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
        }

        .no-billing-data {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .no-data-icon {
          font-size: 4rem;
          color: #d1d5db;
          margin-bottom: 1rem;
          display: block;
        }

        .no-data-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .no-data-subtitle {
          color: #9ca3af;
          font-size: 0.875rem;
        }

        /* Existing table styles for main table */
        .table-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          width: 100%;
        }

        .customers-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
          background: white;
          table-layout: fixed;
        }

        .customers-table th {
          background: #020024;
          color: white;
          padding: 1rem 0.5rem;
          text-align: center;
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid white;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .customers-table th.sl-no {
          width: 5%;
        }

        .customers-table th:not(.sl-no) {
          width: calc((100% - 5%) / 9);
        }

        .customers-table th:first-child {
          border-top-left-radius: 12px;
        }

        .customers-table th:last-child {
          border-top-right-radius: 12px;
        }

        .customers-table td {
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.8rem;
          color: #475569;
          vertical-align: middle;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .customers-table tbody tr {
          transition: all 0.2s ease;
          background: white;
        }

        .customers-table tbody tr:hover {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          transform: scale(1.001);
        }

        .customers-table tbody tr:nth-child(even) {
          background: #fafbfc;
        }

        .customers-table tbody tr:nth-child(even):hover {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }

        .sl-no-cell {
          font-weight: 700;
          color: #0f172a;
          font-family: 'SF Mono', 'Monaco', monospace;
        }

        .name-cell {
          font-weight: 700;
          color: #0f172a;
          font-size: 0.95rem;
        }

        .status-active {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }

        .status-inactive {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
        }

        .view-details-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .view-details-btn:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .view-details-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s;
        }

        .view-details-btn:hover::before {
          left: 100%;
        }

        .no-data {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .info-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
          
          .modal-content {
            max-width: 95vw;
            margin: 1rem;
          }
        }

        @media (max-width: 768px) {
          .modal {
            padding: 1rem;
            align-items: flex-start;
          }

          .modal-content {
            max-height: 90vh;
            margin-top: 2rem;
          }

          .modal-header {
            padding: 1.5rem;
          }

          .modal-title {
            font-size: 1.5rem;
          }

          .customer-info-section,
          .billing-section {
            padding: 1.5rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .info-card {
            padding: 1rem;
          }

          .billing-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .billing-table th,
          .billing-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.75rem;
          }

          .readings-header {
            padding: 1.5rem 1rem;
          }

          .readings-title {
            font-size: 1.8rem;
          }

          .customers-table th,
          .customers-table td {
            padding: 0.5rem 0.25rem;
            font-size: 0.7rem;
          }

          .view-details-btn {
            padding: 0.3rem 0.5rem;
            font-size: 0.65rem;
          }

          .view-details-btn i {
            display: none;
          }
        }

        /* Animation delays for staggered effect */
        .info-card:nth-child(1) { animation-delay: 0.1s; }
        .info-card:nth-child(2) { animation-delay: 0.2s; }
        .info-card:nth-child(3) { animation-delay: 0.3s; }
        .info-card:nth-child(4) { animation-delay: 0.4s; }
        .info-card:nth-child(5) { animation-delay: 0.5s; }
      `}</style>

      <div className="readings-container">
        <div className="readings-header">
          <h1 className="readings-title">
            <i className="fas fa-history" style={{ marginRight: '0.75rem' }}></i>
            Readings History
          </h1>
        </div>

        <div className="content-area">
          {message && (
            <div className="message">
              <i className="fas fa-exclamation-circle"></i>
              {message}
            </div>
          )}

          <div className="table-container">
            {customers.length === 0 ? (
              <div className="no-data">
                <i className="fas fa-users no-data-icon"></i>
                <div className="no-data-text">No customers found</div>
                <div className="no-data-subtitle">Customer registrations will appear here</div>
              </div>
            ) : (
              <table className="customers-table">
                <thead>
                  <tr>
                    <th className="sl-no">Sl.No</th>
                    <th>Name</th>
                    <th>Connection Type</th>
                    <th>Address</th>
                    <th>Place</th>
                    <th>Phone</th>
                    <th>Ration Card</th>
                    <th>Aadhar</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr key={customer.customer_id}>
                      <td className="sl-no-cell">{index + 1}</td>
                      <td className="name-cell">{customer.name}</td>
                      <td>{customer.tariff_type}</td>
                      <td>{customer.address}</td>
                      <td>{customer.place}</td>
                      <td>{customer.phone_number}</td>
                      <td>{customer.ration_card || 'N/A'}</td>
                      <td>{customer.aadhar_number}</td>
                      <td>
                        <span className={`status-badge ${customer.login_status === 'active' ? 'status-active' : 'status-inactive'}`}>
                          <i className={`fas ${customer.login_status === 'active' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                          {customer.login_status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="view-details-btn"
                          onClick={() => handleViewDetails(customer)}
                        >
                          <i className="fas fa-eye"></i>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showDetailsModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">
                  <i className="fas fa-user-circle"></i>
                  Customer Profile & History
                </h3>
                <button className="close-btn" onClick={handleCloseModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                {detailsLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading customer details...</p>
                  </div>
                ) : customerDetails.length === 0 ? (
                  <div className="no-billing-data">
                    <i className="fas fa-file-invoice no-data-icon"></i>
                    <div className="no-data-text">No billing data available</div>
                    <div className="no-data-subtitle">This customer doesn't have any billing history yet</div>
                  </div>
                ) : (
                  <>
                    <div className="customer-info-section">
                      <h4 className="section-title">
                        <i className="fas fa-info-circle"></i>
                        Customer Information
                      </h4>
                      <div className="info-grid">
                        <div className="info-card">
                          <div className="info-label">
                            <i className="fas fa-user"></i>
                            Customer Name
                          </div>
                          <div className="info-value">{customerDetails[0].name}</div>
                        </div>
                        <div className="info-card">
                          <div className="info-label">
                            <i className="fas fa-phone"></i>
                            Phone Number
                          </div>
                          <div className="info-value">{customerDetails[0].phone_number || 'Not provided'}</div>
                        </div>
                        <div className="info-card">
                          <div className="info-label">
                            <i className="fas fa-id-card"></i>
                            Consumer Number
                          </div>
                          <div className="info-value">{customerDetails[0].consumer_number || 'Not assigned'}</div>
                        </div>
                        <div className="info-card">
                          <div className="info-label">
                            <i className="fas fa-tachometer-alt"></i>
                            Meter ID
                          </div>
                          <div className="info-value">{customerDetails[0].meter_id || 'Not assigned'}</div>
                        </div>
                        <div className="info-card">
                          <div className="info-label">
                            <i className="fas fa-bolt"></i>
                            Tariff Type
                          </div>
                          <div className="info-value">{customerDetails[0].tariff_type}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="billing-section">
                      <div className="billing-header">
                        <h4 className="section-title">
                          <i className="fas fa-file-invoice-dollar"></i>
                          Billing History
                        </h4>
                        <div className="billing-stats">
                          <div className="stat-item">
                            <span className="stat-value">
                              {customerDetails.filter(d => d.units_consumed !== null).length}
                            </span>
                            <span className="stat-label">Total Bills</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-value">
                              {customerDetails.filter(d => d.status === 'paid').length}
                            </span>
                            <span className="stat-label">Paid</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-value">
                              ₹{customerDetails.reduce((total, d) => total + (parseFloat(d.amount_paid) || 0), 0).toFixed(2)}
                            </span>
                            <span className="stat-label">Total Paid</span>
                          </div>
                        </div>
                      </div>
                      <div className="billing-table-container">
                        <table className="billing-table">
                          <thead>
                            <tr>
                              <th>Bill ID</th>
                              <th>Units Consumed</th>
                              <th>Bill Date</th>
                              <th>Due Date</th>
                              <th>Bill Amount</th>
                              <th>Status</th>
                              <th>Payment Date</th>
                              <th>Amount Paid</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerDetails.map((detail, index) => (
                              detail.units_consumed !== null && (
                                <tr key={index}>
                                  <td>{detail.bill_id || 'N/A'}</td>
                                  <td>{detail.units_consumed}</td>
                                  <td>{detail.bill_date ? new Date(detail.bill_date).toLocaleDateString() : 'N/A'}</td>
                                  <td>{detail.due_date ? new Date(detail.due_date).toLocaleDateString() : 'N/A'}</td>
                                  <td className="amount-cell">₹{parseFloat(detail.amount || 0).toFixed(2)}</td>
                                  <td className="status-cell">
                                    <span className={`status-badge status-${detail.status?.toLowerCase() || 'pending'}`}>
                                      <i className={`fas fa-${detail.status === 'paid' ? 'check-circle' : detail.status === 'overdue' ? 'exclamation-circle' : 'clock'}`}></i>
                                      {detail.status || 'Pending'}
                                    </span>
                                  </td>
                                  <td>{detail.payment_date ? new Date(detail.payment_date).toLocaleDateString() : 'N/A'}</td>
                                  <td className="amount-cell">${parseFloat(detail.amount_paid || 0).toFixed(2)}</td>
                                </tr>
                              )
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default ReadingHistory;