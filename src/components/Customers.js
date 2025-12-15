import React, { useState, useEffect } from 'react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone_number: '',
    place: '',
    pin_code: ''
  });
  const [errors, setErrors] = useState({});

  // Fetch customers data
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

  const handleApprove = async (username) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/approve-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(`Customer ${username} approved successfully!`);
        fetchCustomers();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(result.error || 'Error approving customer');
      }
    } catch (error) {
      setMessage('Error approving customer');
      console.error('Error:', error);
    }
  };

  const handleDeactivate = async (username) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/deactivate-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(`Customer ${username} deactivated successfully!`);
        fetchCustomers();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(result.error || 'Error deactivating customer');
      }
    } catch (error) {
      setMessage('Error deactivating customer');
      console.error('Error:', error);
    }
  };

  const handleAssignMeter = async (username) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/assign-meter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(`Meter assigned successfully! Consumer: ${result.consumer_number}, Meter: ${result.meter_id}`);
        fetchCustomers();
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(result.error || 'Error assigning meter');
      }
    } catch (error) {
      setMessage('Error assigning meter');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (username) => {
    if (window.confirm(`Are you sure you want to delete customer ${username}?`)) {
      try {
        const response = await fetch('http://localhost:5000/api/admin/delete-customer', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        const result = await response.json();
        if (response.ok) {
          setMessage(`Customer ${username} deleted successfully!`);
          fetchCustomers();
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage(result.error || 'Error deleting customer');
        }
      } catch (error) {
        setMessage('Error deleting customer');
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      name: customer.name,
      phone_number: customer.phone_number,
      place: customer.place,
      pin_code: customer.pin_code || ''
    });
    setErrors({});
    setShowEditModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editForm.name || editForm.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }
    if (!editForm.phone_number || !/^[0-9]{10}$/.test(editForm.phone_number)) {
      newErrors.phone_number = 'Phone number must be a valid 10-digit number';
    }
    if (!editForm.place || editForm.place.length < 3) {
      newErrors.place = 'Place must be at least 3 characters long';
    }
    if (!editForm.pin_code || !/^[1-9][0-9]{5}$/.test(editForm.pin_code)) {
      newErrors.pin_code = 'Pin code must be a valid 6-digit number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/edit-customer/${selectedCustomer.customer_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: selectedCustomer.username,
          name: editForm.name,
          phone_number: editForm.phone_number,
          place: editForm.place,
          pin_code: editForm.pin_code
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(`Customer ${selectedCustomer.username} updated successfully!`);
        setShowEditModal(false);
        fetchCustomers();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(result.error || 'Error updating customer');
      }
    } catch (error) {
      setMessage('Error updating customer');
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
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
  }

  return (
    <div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .customers-container {
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

        .customers-header {
          background:#020024;
          color: white;
          padding: 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .customers-header::before {
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

        .customers-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 1rem 0;
          letter-spacing: -0.025em;
          position: relative;
          z-index: 1;
        }

        .content-area {
          padding: 2rem;
        }

        .message {
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          text-align: center;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          animation: slideIn 0.5s ease-out;
          border-left: 4px solid rgba(255, 255, 255, 0.3);
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
          background:#020024;
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

        .username-cell {
          color: #64748b;
          font-family: 'SF Mono', 'Monaco', monospace;
          font-size: 0.85rem;
        }

        .phone-cell {
          font-family: 'SF Mono', 'Monaco', monospace;
          color: #475569;
        }

        .aadhar-cell {
          font-family: 'SF Mono', 'Monaco', monospace;
          color: #64748b;
          letter-spacing: 0.5px;
        }

        .consumer-number {
          font-family: 'SF Mono', 'Monaco', monospace;
          font-weight: 700;
          color: #00aeef;
          background: rgba(0, 174, 239, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        .meter-id {
          font-family: 'SF Mono', 'Monaco', monospace;
          font-weight: 700;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        .not-assigned {
          color: #94a3b8;
          font-style: italic;
          font-size: 0.8rem;
        }

        .status-badge {
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
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

        .actions-cell {
          white-space: nowrap;
        }

        .action-buttons {
          display: flex;
          gap: 0.25rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.4rem 0.6rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.7rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn-approve {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }

        .btn-approve:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
        }

        .btn-deactivate {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
        }

        .btn-deactivate:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(239, 68, 68, 0.4);
        }

        .btn-assign {
          background: linear-gradient(135deg, #00aeef, #0284c7);
          color: white;
          box-shadow: 0 2px 4px rgba(0, 174, 239, 0.3);
        }

        .btn-assign:hover {
          background: linear-gradient(135deg, #0284c7, #0369a1);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 174, 239, 0.4);
        }

        .btn-delete {
          background: linear-gradient(135deg, #64748b, #475569);
          color: white;
          box-shadow: 0 2px 4px rgba(100, 116, 139, 0.3);
        }

        .btn-delete:hover {
          background: linear-gradient(135deg, #475569, #334155);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(100, 116, 139, 0.4);
        }

        .btn-edit {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
        }

        .btn-edit:hover {
          background: linear-gradient(135deg, #d97706, #b45309);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(245, 158, 11, 0.4);
        }

        .btn:disabled {
          background: #cbd5e1;
          color: #94a3b8;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn:disabled::before {
          display: none;
        }

        .no-data {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .no-data-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          color: #cbd5e1;
        }

        .no-data-text {
          font-size: 1.25rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .no-data-subtitle {
          color: #94a3b8;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
        }

        .close-btn:hover {
          color: #0f172a;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #0f172a;
        }

        .form-group input:focus {
          outline: none;
          border-color: #00aeef;
          box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.1);
        }

        .error {
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        @media (max-width: 1200px) {
          .customers-container {
            margin: 0;
          }
        }

        @media (max-width: 768px) {
          .customers-header {
            padding: 1.5rem 1rem;
          }
          
          .customers-title {
            font-size: 1.8rem;
          }
          
          .content-area {
            padding: 1rem;
          }
          
          .customers-table th,
          .customers-table td {
            padding: 0.5rem 0.25rem;
            font-size: 0.7rem;
          }
          
          .btn {
            padding: 0.3rem 0.5rem;
            font-size: 0.65rem;
          }

          .action-buttons {
            flex-direction: column;
            gap: 0.2rem;
          }

          .btn i {
            display: none;
          }

          .modal-content {
            margin: 1rem;
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="customers-container">
        <div className="customers-header">
          <h1 className="customers-title">
            <i className="fas fa-users" style={{ marginRight: '0.75rem' }}></i>
            Customer Management
          </h1>
        </div>

        <div className="content-area">
          {message && (
            <div className="message">
              <i className="fas fa-check-circle"></i>
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
                    <th>Customer Name</th>
                    <th>Connection Type</th>
                    <th>Username</th>
                    <th>Phone</th>
                    <th>Place</th>
                    <th>Aadhar No.</th>
                    <th>Consumer No.</th>
                    <th>Meter ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr key={customer.customer_id}>
                      <td className="sl-no-cell">{index + 1}</td>
                      <td className="name-cell">{customer.name}</td>
                      <td className="username-cell">{customer.tariff_type}</td>
                      <td className="username-cell">{customer.username}</td>
                      <td className="phone-cell">{customer.phone_number}</td>
                      <td>{customer.place}</td>
                      <td className="aadhar-cell">{customer.aadhar_number}</td>
                      <td>
                        {customer.consumer_number ? (
                          <span className="consumer-number">
                            {customer.consumer_number}
                          </span>
                        ) : (
                          <span className="not-assigned">Not assigned</span>
                        )}
                      </td>
                      <td>
                        {customer.meter_id ? (
                          <span className="meter-id">
                            {customer.meter_id}
                          </span>
                        ) : (
                          <span className="not-assigned">Not assigned</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${customer.login_status === 'active' ? 'status-active' : 'status-inactive'}`}>
                          <i className={`fas ${customer.login_status === 'active' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                          {customer.login_status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button
                            className="btn btn-edit"
                            onClick={() => handleEdit(customer)}
                          >
                            <i className="fas fa-edit"></i>
                            Edit
                          </button>
                          {customer.login_status === 'active' ? (
                            <button
                              className="btn btn-deactivate"
                              onClick={() => handleDeactivate(customer.username)}
                            >
                              <i className="fas fa-ban"></i>
                              Deactivate
                            </button>
                          ) : (
                            <button
                              className="btn btn-approve"
                              onClick={() => handleApprove(customer.username)}
                            >
                              <i className="fas fa-check"></i>
                              Approve
                            </button>
                          )}
                          {!customer.meter_id ? (
                            <button
                              className="btn btn-assign"
                              onClick={() => handleAssignMeter(customer.username)}
                              disabled={customer.login_status !== 'active'}
                            >
                              <i className="fas fa-id-card"></i>
                              Assign Meter
                            </button>
                          ) : (
                            <button
                              className="btn btn-delete"
                              onClick={() => handleDelete(customer.username)}
                            >
                              <i className="fas fa-trash"></i>
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Customer</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={editForm.phone_number}
                onChange={handleInputChange}
              />
              {errors.phone_number && <div className="error">{errors.phone_number}</div>}
            </div>
            <div className="form-group">
              <label>Place</label>
              <input
                type="text"
                name="place"
                value={editForm.place}
                onChange={handleInputChange}
              />
              {errors.place && <div className="error">{errors.place}</div>}
            </div>
            <div className="form-group">
              <label>Pin Code</label>
              <input
                type="text"
                name="pin_code"
                value={editForm.pin_code}
                onChange={handleInputChange}
              />
              {errors.pin_code && <div className="error">{errors.pin_code}</div>}
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-approve"
                onClick={handleEditSubmit}
              >
                Save Changes
              </button>
              <button
                className="btn btn-delete"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default Customers;