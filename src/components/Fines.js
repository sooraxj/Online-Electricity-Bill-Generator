import React, { useState, useEffect } from 'react';

const Fines = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editFine, setEditFine] = useState(null);
  const [formData, setFormData] = useState({
    days_from: '',
    days_to: '',
    fine_amount: ''
  });

  // Fetch fine slabs data
  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/fines');
      const data = await response.json();
      console.log('Fetched fines:', data);
      setFines(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fines:', error);
      setMessage('Error fetching fine data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const daysFrom = parseInt(formData.days_from);
    const daysTo = parseInt(formData.days_to);
    const fineAmount = parseFloat(formData.fine_amount);

    if (isNaN(daysFrom) || daysFrom < 0) {
      setMessage('Days From must be a non-negative number');
      return false;
    }
    if (isNaN(daysTo) || daysTo < daysFrom) {
      setMessage('Days To must be greater than or equal to Days From');
      return false;
    }
    if (isNaN(fineAmount) || fineAmount < 0) {
      setMessage('Fine Amount must be a non-negative number');
      return false;
    }
    return true;
  };

  const handleAddOrEditFine = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = editFine ? 'http://localhost:5000/api/admin/edit-fine' : 'http://localhost:5000/api/admin/add-fine';
      const method = editFine ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slab_id: editFine ? editFine.slab_id : undefined,
          days_from: parseInt(formData.days_from),
          days_to: parseInt(formData.days_to),
          fine_amount: parseFloat(formData.fine_amount)
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(editFine ? 'Fine updated successfully!' : 'Fine added successfully!');
        fetchFines();
        setFormData({
          days_from: '',
          days_to: '',
          fine_amount: ''
        });
        setShowAddForm(false);
        setEditFine(null);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(result.error || (editFine ? 'Error updating fine' : 'Error adding fine'));
      }
    } catch (error) {
      setMessage(editFine ? 'Error updating fine' : 'Error adding fine');
      console.error('Error:', error);
    }
  };

  const handleEdit = (fine) => {
    setEditFine(fine);
    setFormData({
      days_from: fine.days_from.toString(),
      days_to: fine.days_to.toString(),
      fine_amount: fine.fine_amount.toString()
    });
    setShowAddForm(true);
  };

  const handleDelete = async (slab_id) => {
    if (window.confirm('Are you sure you want to delete this fine slab?')) {
      try {
        const response = await fetch('http://localhost:5000/api/admin/delete-fine', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slab_id }),
        });

        const result = await response.json();
        if (response.ok) {
          setMessage('Fine deleted successfully!');
          fetchFines();
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage(result.error || 'Error deleting fine');
        }
      } catch (error) {
        setMessage('Error deleting fine');
        console.error('Error:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      days_from: '',
      days_to: '',
      fine_amount: ''
    });
    setShowAddForm(false);
    setEditFine(null);
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
        <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Loading fines...</p>
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

        .fine-container {
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

        .fine-header {
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

        .fine-header::before {
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

        .fine-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.025em;
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .add-fine-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 0.875rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
          z-index: 1;
        }

        .add-fine-btn:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
        }

        .add-fine-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s;
        }

        .add-fine-btn:hover::before {
          left: 100%;
        }

        .add-fine-btn i {
          font-size: 1.1rem;
        }

        .form-container {
          background: #ffffff;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          margin-bottom: 2rem;
          animation: slideIn 0.5s ease-out;
          border: 1px solid #e5e7eb;
          position: relative;
          overflow: hidden;
        }

        .form-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8, #3730a3);
          border-radius: 20px 20px 0 0;
        }

        .form-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 2rem;
          text-align: center;
          position: relative;
          padding-bottom: 1rem;
        }

        .form-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 2px;
        }

        .form-title i {
          margin-right: 0.75rem;
          color: #3b82f6;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .form-group label {
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #0f172a;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-group label i {
          color: #3b82f6;
          font-size: 1rem;
        }

        .form-group input {
          padding: 1rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: #ffffff;
          color: #0f172a;
          font-weight: 500;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          background: #fefeff;
        }

        .form-group input:disabled {
          background: #f9fafb;
          color: #6b7280;
          border-color: #d1d5db;
          cursor: not-allowed;
        }

        .form-group input::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }

        .form-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
          position: relative;
          overflow: hidden;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 15px rgba(107, 114, 128, 0.4);
          position: relative;
          overflow: hidden;
        }

        .btn-secondary:hover {
          background: linear-gradient(135deg, #4b5563, #374151);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(107, 114, 128, 0.6);
        }

        .btn-primary::before,
        .btn-secondary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s;
        }

        .btn-primary:hover::before,
        .btn-secondary:hover::before {
          left: 100%;
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

        .fine-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
          background: white;
          table-layout: fixed;
        }

        .fine-table th {
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

        .fine-table th.sl-no {
          width: 15%;
        }

        .fine-table th:not(.sl-no) {
          width: calc((100% - 15%) / 3);
        }

        .fine-table th:first-child {
          border-top-left-radius: 12px;
        }

        .fine-table th:last-child {
          border-top-right-radius: 12px;
        }

        .fine-table td {
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

        .fine-table tbody tr {
          transition: all 0.2s ease;
          background: white;
        }

        .fine-table tbody tr:hover {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          transform: scale(1.001);
        }

        .fine-table tbody tr:nth-child(even) {
          background: #fafbfc;
        }

        .fine-table tbody tr:nth-child(even):hover {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }

        .sl-no-cell {
          font-weight: 700;
          color: #0f172a;
          font-family: 'SF Mono', 'Monaco', monospace;
        }

        .days-cell {
          font-family: 'SF Mono', 'Monaco', monospace;
          color: #475569;
        }

        .fine-amount-cell {
          font-weight: 700;
          color: #0f172a;
          font-family: 'SF Mono', 'Monaco', monospace;
        }

        .actions-cell {
          white-space: nowrap;
        }

        .action-buttons {
          display: flex;
          gap: 0.25rem;
          align-items: center;
          justify-content: center;
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

        .btn-edit {
          background: linear-gradient(135deg, #00aeef, #0284c7);
          color: white;
          box-shadow: 0 2px 4px rgba(0, 174, 239, 0.3);
        }

        .btn-edit:hover {
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

        @media (max-width: 1200px) {
          .fine-container {
            margin: 0;
          }
        }

        @media (max-width: 768px) {
          .fine-header {
            padding: 1.5rem 1rem;
          }
          
          .fine-title {
            font-size: 1.8rem;
          }
          
          .add-fine-btn {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
          }

          .content-area {
            padding: 1rem;
          }

          .form-container {
            padding: 2rem;
          }

          .form-title {
            font-size: 1.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            max-width: 300px;
          }
          
          .fine-table th,
          .fine-table td {
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
        }
      `}</style>

      <div className="fine-container">
        <div className="fine-header">
          <h1 className="fine-title">
            <i className="fas fa-exclamation-circle" style={{ marginRight: '0.75rem' }}></i>
            Fine Management
          </h1>
          <button
            className="add-fine-btn"
            onClick={() => {
              setShowAddForm(true);
              setEditFine(null);
              setFormData({
                days_from: '',
                days_to: '',
                fine_amount: ''
              });
            }}
          >
            <i className="fas fa-plus"></i>
            Add New Fine
          </button>
        </div>

        <div className="content-area">
          {showAddForm && (
            <div className="form-container">
              <h3 className="form-title">
                <i className={`fas ${editFine ? 'fa-edit' : 'fa-plus'}`}></i>
                {editFine ? 'Edit Fine' : 'Add New Fine'}
              </h3>
              <form onSubmit={handleAddOrEditFine}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-calendar-day"></i>
                      Days From
                    </label>
                    <input
                      type="number"
                      name="days_from"
                      value={formData.days_from}
                      onChange={handleInputChange}
                      placeholder="Enter starting days"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fas fa-calendar-day"></i>
                      Days To
                    </label>
                    <input
                      type="number"
                      name="days_to"
                      value={formData.days_to}
                      onChange={handleInputChange}
                      placeholder="Enter ending days"
                      min={formData.days_from}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fas fa-dollar-sign"></i>
                      Fine Amount
                    </label>
                    <input
                      type="number"
                      name="fine_amount"
                      value={formData.fine_amount}
                      onChange={handleInputChange}
                      placeholder="Enter fine amount"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="btn-primary">
                    <i className="fas fa-save"></i>
                    {editFine ? 'Update Fine' : 'Create Fine'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={handleCancel}>
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {message && (
            <div className="message">
              <i className="fas fa-check-circle"></i>
              {message}
            </div>
          )}

          <div className="table-container">
            {fines.length === 0 ? (
              <div className="no-data">
                <i className="fas fa-exclamation-circle no-data-icon"></i>
                <div className="no-data-text">No fines found</div>
                <div className="no-data-subtitle">Fine entries will appear here</div>
              </div>
            ) : (
              <table className="fine-table">
                <thead>
                  <tr>
                    <th className="sl-no">Sl.No</th>
                    <th>Days From</th>
                    <th>Days To</th>
                    <th>Fine Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fines.map((fine, index) => (
                    <tr key={fine.slab_id}>
                      <td className="sl-no-cell">{index + 1}</td>
                      <td className="days-cell">{fine.days_from}</td>
                      <td className="days-cell">{fine.days_to}</td>
                      <td className="fine-amount-cell">{parseFloat(fine.fine_amount).toFixed(2)}</td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button
                            className="btn btn-edit"
                            onClick={() => handleEdit(fine)}
                          >
                            <i className="fas fa-edit"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => handleDelete(fine.slab_id)}
                          >
                            <i className="fas fa-trash"></i>
                            Delete
                          </button>
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

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default Fines;