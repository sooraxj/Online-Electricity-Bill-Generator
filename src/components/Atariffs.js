import React, { useState, useEffect } from 'react';

const Atariffs = () => {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTariff, setEditTariff] = useState(null);
  const [formData, setFormData] = useState({
    tariff_type: 'Domestic',
    unit_from: '',
    unit_to: '',
    rate: ''
  });

  // Fetch tariff data
  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/tariffs');
      const data = await response.json();
      console.log('Fetched tariffs:', data);
      setTariffs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tariffs:', error);
      setMessage('Error fetching tariff data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const unitFrom = parseInt(formData.unit_from);
    const unitTo = parseInt(formData.unit_to);
    const rate = parseFloat(formData.rate);

    if (!['Domestic', 'Commercial', 'Industrial'].includes(formData.tariff_type)) {
      setMessage('Invalid tariff type');
      return false;
    }
    if (isNaN(unitFrom) || unitFrom < 0) {
      setMessage('Unit From must be a non-negative number');
      return false;
    }
    if (isNaN(unitTo) || unitTo < unitFrom) {
      setMessage('Unit To must be greater than or equal to Unit From');
      return false;
    }
    if (isNaN(rate) || rate <= 0) {
      setMessage('Rate must be a positive number');
      return false;
    }
    return true;
  };

  const handleAddOrEditTariff = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = editTariff ? 'http://localhost:5000/api/admin/edit-tariff' : 'http://localhost:5000/api/admin/add-tariff';
      const method = editTariff ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tariff_id: editTariff ? editTariff.tariff_id : undefined,
          tariff_type: formData.tariff_type,
          unit_from: parseInt(formData.unit_from),
          unit_to: parseInt(formData.unit_to),
          rate: parseFloat(formData.rate)
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(editTariff ? 'Tariff updated successfully!' : 'Tariff added successfully!');
        fetchTariffs();
        setFormData({
          tariff_type: 'Domestic',
          unit_from: '',
          unit_to: '',
          rate: ''
        });
        setShowAddForm(false);
        setEditTariff(null);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(result.error || (editTariff ? 'Error updating tariff' : 'Error adding tariff'));
      }
    } catch (error) {
      setMessage(editTariff ? 'Error updating tariff' : 'Error adding tariff');
      console.error('Error:', error);
    }
  };

  const handleEdit = (tariff) => {
    setEditTariff(tariff);
    setFormData({
      tariff_type: tariff.tariff_type,
      unit_from: tariff.unit_from.toString(),
      unit_to: tariff.unit_to.toString(),
      rate: tariff.rate.toString()
    });
    setShowAddForm(true);
  };

  const handleDelete = async (tariff_id) => {
    if (window.confirm('Are you sure you want to delete this tariff?')) {
      try {
        const response = await fetch('http://localhost:5000/api/admin/delete-tariff', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tariff_id }),
        });

        const result = await response.json();
        if (response.ok) {
          setMessage('Tariff deleted successfully!');
          fetchTariffs();
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage(result.error || 'Error deleting tariff');
        }
      } catch (error) {
        setMessage('Error deleting tariff');
        console.error('Error:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      tariff_type: 'Domestic',
      unit_from: '',
      unit_to: '',
      rate: ''
    });
    setShowAddForm(false);
    setEditTariff(null);
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
        <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Loading tariffs...</p>
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

        .tariff-container {
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

        .tariff-header {
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

        .tariff-header::before {
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

        .tariff-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.025em;
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .add-tariff-btn {
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

        .add-tariff-btn:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
        }

        .add-tariff-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s;
        }

        .add-tariff-btn:hover::before {
          left: 100%;
        }

        .add-tariff-btn i {
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

        .form-group input,
        .form-group select {
          padding: 1rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: #ffffff;
          color: #0f172a;
          font-weight: 500;
        }

        .form-group select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230f172a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.2rem;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          background: #fefeff;
        }

        .form-group input:disabled,
        .form-group select:disabled {
          background: #f9fafb;
          color: #6b7280;
          border-color: #d1d5db;
          cursor: not-allowed;
        }

        .form-group input::placeholder,
        .form-group select::placeholder {
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

        .tariff-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
          background: white;
          table-layout: fixed;
        }

        .tariff-table th {
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

        .tariff-table th.sl-no {
          width: 10%;
        }

        .tariff-table th:not(.sl-no) {
          width: calc((100% - 10%) / 4);
        }

        .tariff-table th:first-child {
          border-top-left-radius: 12px;
        }

        .tariff-table th:last-child {
          border-top-right-radius: 12px;
        }

        .tariff-table td {
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

        .tariff-table tbody tr {
          transition: all 0.2s ease;
          background: white;
        }

        .tariff-table tbody tr:hover {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          transform: scale(1.001);
        }

        .tariff-table tbody tr:nth-child(even) {
          background: #fafbfc;
        }

        .tariff-table tbody tr:nth-child(even):hover {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }

        .sl-no-cell {
          font-weight: 700;
          color: #0f172a;
          font-family: 'SF Mono', 'Monaco', monospace;
        }

        .tariff-type-cell {
          font-weight: 600;
          color: #0f172a;
        }

        .unit-cell {
          font-family: 'SF Mono', 'Monaco', monospace;
          color: #475569;
        }

        .rate-cell {
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
          .tariff-container {
            margin: 0;
          }
        }

        @media (max-width: 768px) {
          .tariff-header {
            padding: 1.5rem 1rem;
          }
          
          .tariff-title {
            font-size: 1.8rem;
          }
          
          .add-tariff-btn {
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
          
          .tariff-table th,
          .tariff-table td {
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

      <div className="tariff-container">
        <div className="tariff-header">
          <h1 className="tariff-title">
            <i className="fas fa-money-bill" style={{ marginRight: '0.75rem' }}></i>
            Tariff Management
          </h1>
          <button
            className="add-tariff-btn"
            onClick={() => {
              setShowAddForm(true);
              setEditTariff(null);
              setFormData({
                tariff_type: 'Domestic',
                unit_from: '',
                unit_to: '',
                rate: ''
              });
            }}
          >
            <i className="fas fa-plus"></i>
            Add New Tariff
          </button>
        </div>

        <div className="content-area">
          {showAddForm && (
            <div className="form-container">
              <h3 className="form-title">
                <i className={`fas ${editTariff ? 'fa-edit' : 'fa-plus'}`}></i>
                {editTariff ? 'Edit Tariff' : 'Add New Tariff'}
              </h3>
              <form onSubmit={handleAddOrEditTariff}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-list"></i>
                      Tariff Type
                    </label>
                    <select
                      name="tariff_type"
                      value={formData.tariff_type}
                      onChange={handleInputChange}
                    >
                      <option value="Domestic">Domestic</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fas fa-bolt"></i>
                      Unit From
                    </label>
                    <input
                      type="number"
                      name="unit_from"
                      value={formData.unit_from}
                      onChange={handleInputChange}
                      placeholder="Enter starting unit"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fas fa-bolt"></i>
                      Unit To
                    </label>
                    <input
                      type="number"
                      name="unit_to"
                      value={formData.unit_to}
                      onChange={handleInputChange}
                      placeholder="Enter ending unit"
                      min={formData.unit_from}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fas fa-dollar-sign"></i>
                      Rate (per unit)
                    </label>
                    <input
                      type="number"
                      name="rate"
                      value={formData.rate}
                      onChange={handleInputChange}
                      placeholder="Enter rate per unit"
                      step="0.01"
                      min="0.01"
                    />
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="btn-primary">
                    <i className="fas fa-save"></i>
                    {editTariff ? 'Update Tariff' : 'Create Tariff'}
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
            {tariffs.length === 0 ? (
              <div className="no-data">
                <i className="fas fa-money-bill no-data-icon"></i>
                <div className="no-data-text">No tariffs found</div>
                <div className="no-data-subtitle">Tariff entries will appear here</div>
              </div>
            ) : (
              <table className="tariff-table">
                <thead>
                  <tr>
                    <th className="sl-no">Sl.No</th>
                    <th>Tariff Type</th>
                    <th>Unit From</th>
                    <th>Unit To</th>
                    <th>Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tariffs.map((tariff, index) => (
                    <tr key={tariff.tariff_id}>
                      <td className="sl-no-cell">{index + 1}</td>
                      <td className="tariff-type-cell">{tariff.tariff_type}</td>
                      <td className="unit-cell">{tariff.unit_from}</td>
                      <td className="unit-cell">{tariff.unit_to}</td>
                      <td className="rate-cell">{parseFloat(tariff.rate).toFixed(2) || 'N/A'}</td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button
                            className="btn btn-edit"
                            onClick={() => handleEdit(tariff)}
                          >
                            <i className="fas fa-edit"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => handleDelete(tariff.tariff_id)}
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

export default Atariffs;