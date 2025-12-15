import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode'; // Import QRCode library
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const Bills = () => {
  const { customer_id: paramCustomerId } = useParams();
  const [bill, setBill] = useState(null);
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [availableYears, setAvailableYears] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  useEffect(() => {
    // Retrieve customer_id from localStorage or useParams
    const storedUser = localStorage.getItem('user');
    if (!storedUser && !paramCustomerId) {
      setError('User not logged in and no customer ID provided. Please log in or provide a valid customer ID.');
      setLoading(false);
      return;
    }

    let selectedCustomerId = paramCustomerId;
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'customer' || !userData.customer_id) {
        setError('Invalid user or customer ID not found in session.');
        setLoading(false);
        return;
      }
      selectedCustomerId = paramCustomerId || userData.customer_id;
    }

    setCustomerId(selectedCustomerId);

    // Generate available years (from 2000 to current year)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i);
    setAvailableYears(years);
  }, [paramCustomerId]);

  useEffect(() => {
    if (!customerId) return;

    const fetchBillData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/customer/bill/${customerId}/${selectedYear}/${selectedMonth}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Failed to fetch bill data: ${errorData.error || response.statusText}`);
        }
        const data = await response.json();
        setBill(data);

        if (data) {
          const tariffResponse = await fetch(`http://localhost:5000/api/tariffs`);
          if (!tariffResponse.ok) {
            const tariffErrorData = await tariffResponse.json().catch(() => ({}));
            throw new Error(`Failed to fetch tariffs: ${tariffErrorData.error || tariffResponse.statusText}`);
          }
          const tariffData = await tariffResponse.json();
          setTariffs(tariffData.filter(t => t.tariff_type === data.customer.tariff_type));
        }
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBillData();
  }, [customerId, selectedYear, selectedMonth]);

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      // Generate a temporary payment ID for the UPI link (no database insertion yet)
      const tempPaymentId = Math.random().toString(36).substr(2, 9); // Temporary ID for UPI link
      const amount = totalAmount;
      const fine = bill.fine?.fine_amount || 0;
      const upiLink = `upi://pay?pa=merchant@upi&pn=ElectricityBill&am=${amount}&cu=INR&tn=BillPayment_${tempPaymentId}`;

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(upiLink, { width: 300 });
      setQrCodeUrl(qrCodeDataUrl);
      setPaymentId(tempPaymentId); // Store tempPaymentId for confirmation
      setShowQRCode(true);
    } catch (err) {
      console.error('QR code generation error:', err);
      alert('Failed to generate QR code. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setPaymentLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/customer/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          payment_id: paymentId, 
          bill_id: bill.bill_details.bill_id,
          customer_id: customerId,
          amount: totalAmount,
          fine: bill.fine?.fine_amount || 0
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert('Payment confirmed! Your bill has been paid.');
        setBill({ 
          ...bill, 
          bill_details: { 
            ...bill.bill_details, 
            status: 'paid',
            bill_number: data.bill_number // Update bill_number from response
          } 
        });
        setShowQRCode(false);
        setQrCodeUrl('');
        setPaymentId('');
      } else {
        alert(data.error || 'Payment verification failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      alert('Payment verification failed. Please check your connection and try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleViewBill = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePrint = () => {
    window.print();
  };


// Function to handle PDF download
const handleDownloadPDF = async () => {
  const modalContent = document.querySelector('.modal-content');
  if (!modalContent) {
    alert('Modal content not found.');
    return;
  }

  try {
    // Store original styles
    const originalStyles = {
      overflow: modalContent.style.overflow,
      height: modalContent.style.height,
      maxHeight: modalContent.style.maxHeight,
      position: modalContent.style.position,
      width: modalContent.style.width,
    };

    // Hide modal actions (download button)
    const modalActions = modalContent.querySelector('.modal-actions');
    const originalActionsDisplay = modalActions ? modalActions.style.display : null;
    if (modalActions) {
      modalActions.style.display = 'none';
    }

    // Temporarily adjust modal styles to capture full content
    modalContent.style.overflow = 'visible';
    modalContent.style.height = 'auto';
    modalContent.style.maxHeight = 'none';
    modalContent.style.position = 'static';
    modalContent.style.width = '1000px'; // Match modal max-width

    // Ensure the modal body is fully visible
    const modalBody = modalContent.querySelector('.modal-body');
    if (modalBody) {
      modalBody.style.overflow = 'visible';
      modalBody.style.maxHeight = 'none';
    }

    // Get full dimensions of the modal content
    const width = modalContent.scrollWidth;
    const height = modalContent.scrollHeight;

    // Capture the entire modal content
    const canvas = await html2canvas(modalContent, {
      scale: 2, // Higher resolution for better quality
      useCORS: true,
      backgroundColor: '#ffffff',
      width: width,
      height: height,
      windowWidth: width,
      windowHeight: height,
      scrollX: 0,
      scrollY: 0,
    });

    // Restore original styles
    Object.assign(modalContent.style, originalStyles);
    if (modalBody) {
      modalBody.style.overflow = 'auto';
      modalBody.style.maxHeight = 'calc(95vh - 140px)';
    }
    if (modalActions && originalActionsDisplay !== null) {
      modalActions.style.display = originalActionsDisplay;
    }

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Calculate scaling factor to fit content within one A4 page
    const scaleFactor = Math.min(1, pageHeight / imgHeight);
    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;

    // Center the image on the page if scaled
    const xOffset = (210 - scaledWidth) / 2; // Center horizontally
    const yOffset = (297 - scaledHeight) / 2; // Center vertically

    // Add the image to the PDF, scaled to fit one page
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);

    // Download the PDF
    pdf.save(`Electricity_Bill_${bill_details.bill_number || 'EB-2024-001'}.pdf`);
  } catch (err) {
    console.error('PDF generation error:', err);
    alert('Failed to generate PDF. Please try again.');
  }
};  


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bill information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Bill</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const { customer, bill_details, extra_charges, fine } = bill || {};

  const calculateTariffCharges = (units) => {
    let amount = 0;
    let remainingUnits = units;
    const breakdown = [];

    for (const tariff of tariffs) {
      if (remainingUnits <= 0) break;
      const unitsInRange = Math.min(
        remainingUnits,
        tariff.unit_to === 9999 ? remainingUnits : tariff.unit_to - tariff.unit_from + 1
      );
      if (units >= tariff.unit_from) {
        const charge = unitsInRange * tariff.rate;
        amount += charge;
        breakdown.push({
          range: tariff.unit_to === 9999 ? `Above ${tariff.unit_from}` : `${tariff.unit_from}-${tariff.unit_to}`,
          units: unitsInRange,
          rate: tariff.rate,
          charge: charge.toFixed(2)
        });
        remainingUnits -= unitsInRange;
      }
    }

    return { amount: amount.toFixed(2), breakdown };
  };

  const tariffCharges = bill_details ? calculateTariffCharges(bill_details.units_consumed) : { amount: 0, breakdown: [] };
  const totalAmount = bill_details
    ? (parseFloat(tariffCharges.amount) +
       (extra_charges?.fixed_charge || 0) +
       (extra_charges?.meter_rent || 0) +
       (extra_charges?.electricity_duty || 0) +
       (extra_charges?.fuel_charge || 0) +
       (fine?.fine_amount || 0)).toFixed(2)
    : 0;

  // Generate months based on selected year
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const months = selectedYear === currentYear
    ? Array.from({ length: currentMonth }, (_, i) => ({
        value: String(i + 1).padStart(2, '0'),
        label: new Date(2000, i).toLocaleString('default', { month: 'long' })
      }))
    : Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 1).padStart(2, '0'),
        label: new Date(2000, i).toLocaleString('default', { month: 'long' })
      }));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

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
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.1/qrcode.min.js"></script>

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

        .text-theme-cyan {
          color: #00aeef;
        }

        .bill-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
        }

        .bill-header {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          border: 1px solid #e5e7eb;
          margin-bottom: 1.5rem;
        }

        .bill-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          border: 1px solid #e5e7eb;
          margin-bottom: 1.5rem;
        }

        .period-selector {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
        }

        .period-selector label {
          font-weight: 600;
          color: #374151;
          margin-right: 0.5rem;
          white-space: nowrap;
          font-size: 0.9rem;
        }

        .period-selector select {
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          padding: 0.5rem 0.75rem;
          font-size: 0.9rem;
          transition: border-color 0.2s ease;
        }

        .period-selector select:focus {
          outline: none;
          border-color: #00aeef;
          box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.1);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .info-item {
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 6px;
          border-left: 3px solid #00aeef;
        }

        .info-item label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
          display: block;
        }

        .info-item .value {
          font-size: 0.95rem;
          font-weight: 600;
          color: #111827;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
          padding-bottom: 0.25rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .horizontal-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .summary-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        .professional-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          font-size: 0.9rem;
        }

        .professional-table th {
          background: #f8fafc;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e5e7eb;
        }

        .professional-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #f3f4f6;
          color: #111827;
        }

        .professional-table tbody tr:hover {
          background: #f8fafc;
        }

        .professional-table .total-row {
          background: #f0f9ff;
          font-weight: 600;
        }

        .professional-table .total-row td {
          border-top: 2px solid #00aeef;
          padding: 1rem 0.75rem;
        }

        .amount-highlight {
          font-size: 1.75rem;
          font-weight: 800;
          color: #020024;
          text-align: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 10px;
          border: 2px solid #00aeef;
        }

        .compact-summary {
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
          border-radius: 12px;
          padding: 2rem;
          border: 2px solid #f59e0b;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 2rem;
          align-items: center;
        }

        .consumption-compact {
          text-align: center;
        }

        .consumption-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #92400e;
          margin-bottom: 0.25rem;
        }

        .consumption-label {
          font-size: 0.9rem;
          color: #78350f;
          font-weight: 600;
        }

        .charges-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          text-align: center;
        }

        .charge-item {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .charge-item .charge-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #020024;
        }

        .charge-item .charge-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 0.25rem;
        }

        .total-amount-compact {
          text-align: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 10px;
          border: 2px solid #00aeef;
        }

        .total-amount-value {
          font-size: 2rem;
          font-weight: 800;
          color: #020024;
          margin-bottom: 0.5rem;
        }

        .total-amount-label {
          font-size: 0.9rem;
          color: #374151;
          font-weight: 600;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-paid {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .status-unpaid {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .pay-button {
          background: linear-gradient(135deg, #020024 0%, #00aeef 100%);
          color: white;
          border: none;
          padding: 1rem 3rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 1rem auto;
          box-shadow: 0 4px 12px rgba(0, 174, 239, 0.3);
        }

        .pay-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 174, 239, 0.4);
        }

        .pay-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .view-bill-button {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          border: none;
          padding: 1rem 3rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 1rem auto;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .view-bill-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .qr-code-container {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin: 1rem 0;
        }

        .qr-code-container img {
          max-width: 300px;
          margin-bottom: 1rem;
        }

        .qr-instructions {
          font-size: 1rem;
          color: #374151;
          margin-bottom: 1.5rem;
        }

        .confirm-button {
          background: linear-gradient(135deg, #166534 0%, #22c55e 100%);
          color: white;
          border: none;
          padding: 1rem 3rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 1rem auto;
          box-shadow: 0 4px 12px rgba(22, 101, 52, 0.3);
        }

        .confirm-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(22, 101, 52, 0.4);
        }

        .confirm-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .consumption-highlight {
          text-align: center;
          padding: 2rem;
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
          border-radius: 12px;
          margin: 2rem 0;
          border: 2px solid #f59e0b;
        }

        .consumption-value {
          font-size: 3rem;
          font-weight: 800;
          color: #92400e;
          margin-bottom: 0.5rem;
        }

        .consumption-label {
          font-size: 1.1rem;
          color: #78350f;
          font-weight: 600;
        }

        .no-bill-message {
          text-align: center;
          padding: 2rem;
          background: #fef2f2;
          border-radius: 12px;
          border: 2px solid #dc2626;
          margin: 2rem 0;
        }

        .no-bill-message h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #dc2626;
          margin-bottom: 0.5rem;
        }

        .no-bill-message p {
          font-size: 1rem;
          color: #374151;
        }

   
/* Updated CSS for Professional Modal */
  .modal-overlay {
    position: fixed;
    top: 25;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(2, 0, 36, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
  }

  .modal-content {
    background: #ffffff;
    border-radius: 20px;
    max-width: 1000px;
    width: 95%;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 25px 80px rgba(2, 0, 36, 0.4);
    border: 1px solid rgba(2, 0, 36, 0.1);
  }

  .modal-header {
    background: linear-gradient(135deg, #020024 0%, #090979 50%, #00d4ff 100%);
    color: white;
    padding: 2rem 2.5rem;
    position: relative;
    overflow: hidden;
  }

  .modal-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
    transform: translateX(-100%);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .modal-title-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    position: relative;
    z-index: 1;
  }

  .header-icon {
    width: 60px;
    height: 60px;
    background: rgba(255,255,255,0.15);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
  }

  .title-info h2 {
    font-size: 1.75rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.025em;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .title-info p {
    font-size: 0.95rem;
    opacity: 0.9;
    margin: 0.25rem 0 0 0;
    font-weight: 400;
  }

  .status-badge-modal {
    padding: 0.5rem 1.25rem;
    border-radius: 25px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.3);
  }

  .status-badge-modal.status-paid {
    background: rgba(34, 197, 94, 0.25);
    color: #ffffff;
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  }

  .status-badge-modal.status-unpaid {
    background: rgba(239, 68, 68, 0.25);
    color: #ffffff;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  }

  .modal-close {
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    z-index: 2;
  }

  .modal-close:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
  }

  .modal-body {
    padding: 2.5rem;
    overflow-y: auto;
    max-height: calc(95vh - 140px);
  }

  .bill-header-modal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 16px;
    margin-bottom: 2rem;
    border: 1px solid #e2e8f0;
    position: relative;
    overflow: hidden;
  }

  .bill-header-modal::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #020024, #090979);
  }

  .company-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .company-logo {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #020024, #090979);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
  }

  .company-info h3 {
    font-size: 1.35rem;
    font-weight: 800;
    color: #020024;
    margin: 0;
    letter-spacing: -0.025em;
  }

  .company-info p {
    font-size: 0.9rem;
    color: #64748b;
    margin: 0.25rem 0;
    font-weight: 500;
  }

  .reference-code {
    font-size: 0.8rem;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .bill-meta {
    display: flex;
    gap: 2rem;
    text-align: right;
  }

  .bill-number-section, .billing-cycle {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .bill-number-label, .cycle-label {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .bill-number-value, .cycle-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: #020024;
  }

  .customer-info-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 0;
    margin-bottom: 2rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    background: linear-gradient(135deg, #020024 0%, #090979 100%);
    color: white;
    padding: 1.25rem 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .card-header i {
    font-size: 1.25rem;
  }

  .card-header h4 {
    font-size: 1.125rem;
    font-weight: 700;
    margin: 0;
  }

  .customer-details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
  }

  .detail-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .detail-label i {
    width: 16px;
    color: #020024;
  }

  .detail-value {
    font-size: 0.875rem;
    color: #1e293b;
    font-weight: 600;
  }

  .detail-value.due-date {
    color: #dc2626;
    font-weight: 700;
  }

  .consumption-summary-modal {
    background: linear-gradient(135deg, #020024 0%, #090979 50%, #00d4ff 100%);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    color: white;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .consumption-summary-modal::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  .consumption-icon {
    width: 70px;
    height: 70px;
    background: rgba(255,255,255,0.15);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
  }

  .consumption-info {
    flex: 1;
  }

  .consumption-header h4 {
    font-size: 1.125rem;
    font-weight: 700;
    margin: 0 0 0.25rem 0;
  }

  .consumption-period {
    font-size: 0.875rem;
    opacity: 0.9;
    font-weight: 500;
  }

  .consumption-display {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-top: 1rem;
  }

  .consumption-main {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .consumption-number {
    font-size: 3rem;
    font-weight: 900;
    line-height: 1;
  }

  .consumption-unit {
    font-size: 1.25rem;
    font-weight: 600;
    opacity: 0.9;
  }

  .compare-label {
    font-size: 0.875rem;
    opacity: 0.8;
    font-weight: 500;
  }

  .charges-section-modal {
    margin-bottom: 2rem;
  }

  .charges-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .charges-header i {
    color: #020024;
    font-size: 1.25rem;
  }

  .charges-header h4 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .charges-tables {
    display: grid;
    gap: 1.5rem;
  }

  .charges-table-container {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .table-header {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 1.25rem 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .table-header i {
    color: #020024;
    font-size: 1.125rem;
  }

  .table-header h5 {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .modal-charges-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  .modal-charges-table th {
    background: #f8fafc;
    padding: 1rem 1.5rem;
    text-align: left;
    font-weight: 700;
    color: #374151;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-charges-table td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f3f4f6;
    color: #1f2937;
    vertical-align: middle;
  }

  .modal-charges-table tbody tr:hover {
    background: #f9fafb;
  }

  .slab-range {
    font-weight: 600;
    color: #020024;
  }

  .units-cell, .rate-cell {
    text-align: center;
    font-weight: 600;
  }

  .amount-cell {
    text-align: right;
    font-weight: 700;
    color: #059669;
  }

  .charge-desc {
    font-size: 0.8rem;
    color: #6b7280;
    font-style: italic;
  }

  .additional-table td:first-child {
    font-weight: 600;
    color: #374151;
  }

  .additional-table td:first-child i {
    margin-right: 0.5rem;
    color: #020024;
    width: 16px;
  }

  .fine-row {
    background: #fef2f2 !important;
  }

  .fine-row td {
    color: #dc2626 !important;
    font-weight: 600 !important;
  }

  .table-subtotal td {
    background: #020024 !important;
    color: white !important;
    font-weight: 700 !important;
    padding: 1.25rem 1.5rem !important;
    border: none !important;
  }

  .total-section-modal {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    color: white;
    position: relative;
    overflow: hidden;
  }

  .total-section-modal::after {
    content: '₹';
    position: absolute;
    top: 1rem;
    right: 2rem;
    font-size: 8rem;
    opacity: 0.05;
    font-weight: 900;
  }

  .total-breakdown {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .subtotal-row {
    display: flex;
    justify-content: space-between;
    width: 48%;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .total-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .total-left {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .total-label {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .payment-terms {
    font-size: 0.875rem;
    opacity: 0.8;
    font-weight: 500;
  }

  .total-right {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }

  .currency {
    font-size: 1.5rem;
    font-weight: 700;
    opacity: 0.9;
  }

  .total-amount {
    font-size: 3rem;
    font-weight: 900;
    line-height: 1;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .print-button-modal,
  .download-button-modal,
  .pay-button-modal {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;
  }

  .print-button-modal {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    color: white;
  }

  .download-button-modal {
    background: white;
    color: #6b7280;
    border-color: #d1d5db;
  }

  .pay-button-modal {
    background: linear-gradient(135deg, #020024 0%, #090979 100%);
    color: white;
  }

  .print-button-modal:hover,
  .pay-button-modal:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }

  .download-button-modal:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }

  @media print {
    .modal-overlay {
      position: static;
      background: none;
      backdrop-filter: none;
    }
    
    .modal-content {
      box-shadow: none;
      border: none;
      max-width: none;
      width: 100%;
      max-height: none;
      overflow: visible;
    }
    
    .modal-close,
    .modal-actions {
      display: none;
    }
    
    .modal-header {
      background: #020024 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .consumption-summary-modal,
    .total-section-modal {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }

  @media (max-width: 768px) {
    .modal-content {
      width: 95%;
      margin: 1rem;
      max-height: 90vh;
    }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .modal-header {
      padding: 1.5rem;
    }
    
    .modal-title-section {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
    
    .header-icon {
      width: 50px;
      height: 50px;
      font-size: 1.25rem;
    }
    
    .title-info h2 {
      font-size: 1.5rem;
    }
    
    .bill-header-modal {
      flex-direction: column;
      text-align: center;
      gap: 1.5rem;
      padding: 1.5rem;
    }
    
    .bill-meta {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
    
    .customer-details-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 1.5rem;
    }
    
    .consumption-summary-modal {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
      padding: 1.5rem;
    }
    
    .consumption-display {
      flex-direction: column;
      gap: 1rem;
    }
    
    .consumption-number {
      font-size: 2.5rem;
    }
    
    .total-display {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
    
    .total-amount {
      font-size: 2.5rem;
    }
    
    .total-breakdown {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .subtotal-row {
      width: 100%;
    }
    
    .modal-actions {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .modal-charges-table {
      font-size: 0.8rem;
    }
    
    .modal-charges-table th,
    .modal-charges-table td {
      padding: 0.75rem 0.5rem;
    }
    
    .charges-tables {
      gap: 1rem;
    }
    
    .table-header {
      padding: 1rem 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .modal-header {
      padding: 1rem;
    }
    
    .modal-body {
      padding: 1rem;
    }
    
    .title-info h2 {
      font-size: 1.25rem;
    }
    
    .consumption-number {
      font-size: 2rem;
    }
    
    .total-amount {
      font-size: 2rem;
    }
    
    .modal-charges-table th,
    .modal-charges-table td {
      padding: 0.5rem 0.25rem;
      font-size: 0.75rem;
    }
    
    .customer-details-grid,
    .table-header {
      padding: 1rem;
    }
  }
      `}</style>

      <section className="hero-section">
        <div className="container position-relative">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-4">
                Your <span className="text-theme-cyan">Bill</span> Details
              </h1>
              <p className="lead text-white opacity-90">
                View your electricity bill for the selected period
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bill-container">
        <div className="bill-header">
          <div className="period-selector">
            <label>Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                if (parseInt(e.target.value) === currentYear) {
                  setSelectedMonth(String(currentMonth).padStart(2, '0'));
                } else {
                  setSelectedMonth('01');
                }
              }}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <label>Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {bill && bill_details && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="section-title mb-2">Bill Summary</h2>
              <div className="d-flex align-items-center gap-3">
                <div className={`status-badge ${bill_details.status === 'paid' ? 'status-paid' : 'status-unpaid'}`}>
                  {bill_details.status === 'paid' ? '✓ Paid' : '⚠ Unpaid'}
                </div>
              </div>
            </div>
          )}

          {bill && customer && (
            <div className="info-grid">
               {bill_details.status === 'paid' && bill_details.bill_number && (
                <div className="info-item">
                  <label>Bill Number</label>
                  <div className="value">{bill_details.bill_number}

                  </div>
                </div>
                )}
              
              <div className="info-item">
                <label>Customer Name</label>
                <div className="value">{customer.name}</div>
              </div>
              <div className="info-item">
                <label>Consumer Number</label>
                <div className="value">{customer.consumer_number || 'Not Assigned'}</div>
              </div>
              <div className="info-item">
                <label>Meter ID</label>
                <div className="value">{customer.meter_id || 'Not Assigned'}</div>
              </div>
              <div className="info-item">
                <label>Tariff Category</label>
                <div className="value">{customer.tariff_type}</div>
              </div>
              <div className="info-item">
                <label>Bill Date</label>
                <div className="value">
                  {bill_details?.bill_date && new Date(bill_details.bill_date).toLocaleDateString('en-GB')}
                </div>
              </div>
              <div className="info-item">
                <label>Due Date</label>
                <div className="value">
                  {bill_details?.due_date && new Date(bill_details.due_date).toLocaleDateString('en-GB')}
                </div>
              </div>
            </div>
          )}
        </div>

        {bill && bill_details ? (
          <>
            <div className="compact-summary">
              <div className="consumption-compact">
                <div className="consumption-value">{bill_details.units_consumed}</div>
                <div className="consumption-label">kWh Consumed</div>
              </div>
              <div className="charges-summary">
                <div className="charge-item">
                  <div className="charge-value">₹{tariffCharges.amount}</div>
                  <div className="charge-label">Energy Charges</div>
                </div>
                <div className="charge-item">
                  <div className="charge-value">
                    ₹{((extra_charges?.fixed_charge || 0) +
                       (extra_charges?.meter_rent || 0) +
                       (extra_charges?.electricity_duty || 0) +
                       (extra_charges?.fuel_charge || 0)).toFixed(2)}
                  </div>
                  <div className="charge-label">Additional Charges</div>
                </div>
                <div className="charge-item">
                  <div className="charge-value">₹{fine?.fine_amount?.toFixed(2) || '0.00'}</div>
                  <div className="charge-label">Fine</div>
                </div>
              </div>
              <div className="total-amount-compact">
                <div className="total-amount-value">₹{totalAmount}</div>
                <div className="total-amount-label">Total Amount</div>
                {bill_details.status === 'unpaid' ? (
                  <>
                    {!showQRCode ? (
                      <button
                        className="pay-button"
                        onClick={handlePayment}
                        disabled={paymentLoading}
                      >
                        {paymentLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm" role="status"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-credit-card"></i>
                            Pay Now
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="qr-code-container">
                        <p className="qr-instructions">Scan the QR code with a UPI app to pay ₹{totalAmount}</p>
                        <img src={qrCodeUrl} alt="UPI QR Code" />
                        <button
                          className="confirm-button"
                          onClick={handleConfirmPayment}
                          disabled={paymentLoading}
                        >
                          {paymentLoading ? (
                            <>
                              <div className="spinner-border spinner-border-sm" role="status"></div>
                              Verifying...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-check-circle"></i>
                              Confirm Payment
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className="view-bill-button"
                    onClick={handleViewBill}
                  >
                    <i className="fas fa-file-alt"></i>
                    View Bill
                  </button>
                )}
              </div>
            </div>

            <div className="horizontal-layout">
              <div className="bill-section">
                <h3 className="section-title">Energy Charges Breakdown</h3>
                <table className="professional-table">
                  <thead>
                    <tr>
                      <th>Range</th>
                      <th>Units</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tariffCharges.breakdown.map((item, index) => (
                      <tr key={index}>
                        <td>{item.range}</td>
                        <td>{item.units}</td>
                        <td>₹{item.rate.toFixed(2)}</td>
                        <td>₹{item.charge}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td colSpan="3">Total Energy</td>
                      <td>₹{tariffCharges.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bill-section">
                <h3 className="section-title">Additional Charges</h3>
                <table className="professional-table">
                  <thead>
                    <tr>
                      <th>Charge Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extra_charges?.fixed_charge > 0 && (
                      <tr>
                        <td>Fixed Charge</td>
                        <td>₹{extra_charges.fixed_charge.toFixed(2)}</td>
                      </tr>
                    )}
                    {extra_charges?.meter_rent > 0 && (
                      <tr>
                        <td>Meter Rent</td>
                        <td>₹{extra_charges.meter_rent.toFixed(2)}</td>
                      </tr>
                    )}
                    {extra_charges?.electricity_duty > 0 && (
                      <tr>
                        <td>Electricity Duty</td>
                        <td>₹{extra_charges.electricity_duty.toFixed(2)}</td>
                      </tr>
                    )}
                    {extra_charges?.fuel_charge > 0 && (
                      <tr>
                        <td>Fuel Charge</td>
                        <td>₹{extra_charges.fuel_charge.toFixed(2)}</td>
                      </tr>
                    )}
                    {fine && fine.fine_amount > 0 && (
                      <tr>
                        <td>Fine ({fine.days_late} days)</td>
                        <td>₹{fine.fine_amount.toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Updated Modal JSX */}
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <div className="modal-title-section">
                      <div className="header-icon">
                        <i className="fas fa-bolt"></i>
                      </div>
                      <div className="title-info">
                        <h2>Electricity Bill Statement</h2>
                        <p>Detailed billing information and charges</p>
                      </div>
                      <div className="bill-status-header">
                        <span className={`status-badge-modal ${bill_details.status === 'paid' ? 'status-paid' : 'status-unpaid'}`}>
                          {bill_details.status === 'paid' ? '✓ PAID' : '⚠ UNPAID'}
                        </span>
                      </div>
                    </div>
                    <button className="modal-close" onClick={handleCloseModal}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <div className="modal-body">
                    {/* Bill Header Info */}
                    <div className="bill-header-modal">
                      <div className="company-info">
                        <div className="company-logo">
                          <i className="fas fa-building"></i>
                        </div>
                        <div>
                          <h3>BENGALURU ELECTRICITY BOARD</h3>
                          <p>Consumer Services Division</p>
                          <span className="reference-code">Ref: {bill_details.bill_number || 'EB-2024-001'}</span>
                        </div>
                      </div>
                      <div className="bill-meta">
                        <div className="bill-number-section">
                          <span className="bill-number-label">Bill Number</span>
                          <span className="bill-number-value">{bill_details.bill_number || 'EB-2024-001'}</span>
                        </div>
                        <div className="billing-cycle">
                          <span className="cycle-label">Billing Cycle</span>
                          <span className="cycle-value">Monthly</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Information Card */}
                    <div className="customer-info-card">
                      <div className="card-header">
                        <i className="fas fa-user-circle"></i>
                        <h4>Customer Information</h4>
                      </div>
                      <div className="customer-details-grid">
                        <div className="detail-group">
                          <div className="detail-row">
                            <span className="detail-label"><i className="fas fa-user"></i>Customer Name:</span>
                            <span className="detail-value">{customer.name}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label"><i className="fas fa-id-badge"></i>Consumer Number:</span>
                            <span className="detail-value">{customer.consumer_number || 'Not Assigned'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label"><i className="fas fa-tachometer-alt"></i>Meter ID:</span>
                            <span className="detail-value">{customer.meter_id || 'Not Assigned'}</span>
                          </div>
                        </div>
                        <div className="detail-group">
                          <div className="detail-row">
                            <span className="detail-label"><i className="fas fa-tag"></i>Tariff Category:</span>
                            <span className="detail-value">{customer.tariff_type}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label"><i className="fas fa-calendar"></i>Bill Date:</span>
                            <span className="detail-value">
                              {bill_details?.bill_date && new Date(bill_details.bill_date).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label"><i className="fas fa-clock"></i>Due Date:</span>
                            <span className="detail-value due-date">
                              {bill_details?.due_date && new Date(bill_details.due_date).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Consumption Summary */}
                    <div className="consumption-summary-modal">
                      <div className="consumption-icon">
                        <i className="fas fa-chart-line"></i>
                      </div>
                      <div className="consumption-info">
                        <div className="consumption-header">
                          <h4>Energy Consumption</h4>
                          <span className="consumption-period">Current Billing Period</span>
                        </div>
                        <div className="consumption-display">
                          <div className="consumption-main">
                            <span className="consumption-number">{bill_details.units_consumed}</span>
                            <span className="consumption-unit">kWh</span>
                          </div>
                          <div className="consumption-compare">
                            <span className="compare-label">Units Consumed This Month</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Charges Breakdown */}
                    <div className="charges-section-modal">
                      <div className="charges-header">
                        <i className="fas fa-calculator"></i>
                        <h4>Billing Summary & Charges Breakdown</h4>
                      </div>
                      
                      <div className="charges-tables">
                        {/* Energy Charges Table */}
                        <div className="charges-table-container">
                          <div className="table-header">
                            <i className="fas fa-bolt"></i>
                            <h5>Energy Charges</h5>
                          </div>
                          <table className="modal-charges-table">
                            <thead>
                              <tr>
                                <th>Slab Range (kWh)</th>
                                <th>Units Consumed</th>
                                <th>Rate (₹/kWh)</th>
                                <th>Amount (₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tariffCharges.breakdown.map((item, index) => (
                                <tr key={index}>
                                  <td className="slab-range">{item.range}</td>
                                  <td className="text-center units-cell">{item.units}</td>
                                  <td className="text-center rate-cell">₹{item.rate.toFixed(2)}</td>
                                  <td className="text-right amount-cell">₹{item.charge}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="table-subtotal">
                                <td colSpan="3">Subtotal - Energy Charges</td>
                                <td className="text-right">₹{tariffCharges.amount}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        {/* Additional Charges Table */}
                        <div className="charges-table-container">
                          <div className="table-header">
                            <i className="fas fa-plus-circle"></i>
                            <h5>Additional Charges & Fees</h5>
                          </div>
                          <table className="modal-charges-table additional-table">
                            <thead>
                              <tr>
                                <th>Charge Description</th>
                                <th>Details</th>
                                <th>Amount (₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {extra_charges?.fixed_charge > 0 && (
                                <tr>
                                  <td><i className="fas fa-home"></i>Fixed Monthly Charge</td>
                                  <td className="charge-desc">Base connection fee</td>
                                  <td className="text-right">₹{extra_charges.fixed_charge.toFixed(2)}</td>
                                </tr>
                              )}
                              {extra_charges?.meter_rent > 0 && (
                                <tr>
                                  <td><i className="fas fa-tachometer-alt"></i>Meter Rental</td>
                                  <td className="charge-desc">Monthly meter maintenance</td>
                                  <td className="text-right">₹{extra_charges.meter_rent.toFixed(2)}</td>
                                </tr>
                              )}
                              {extra_charges?.electricity_duty > 0 && (
                                <tr>
                                  <td><i className="fas fa-landmark"></i>Electricity Duty</td>
                                  <td className="charge-desc">Government levy</td>
                                  <td className="text-right">₹{extra_charges.electricity_duty.toFixed(2)}</td>
                                </tr>
                              )}
                              {extra_charges?.fuel_charge > 0 && (
                                <tr>
                                  <td><i className="fas fa-gas-pump"></i>Fuel Adjustment</td>
                                  <td className="charge-desc">Variable fuel cost</td>
                                  <td className="text-right">₹{extra_charges.fuel_charge.toFixed(2)}</td>
                                </tr>
                              )}
                              {fine && fine.fine_amount > 0 && (
                                <tr className="fine-row">
                                  <td><i className="fas fa-exclamation-triangle"></i>Late Payment Fine</td>
                                  <td className="charge-desc">{fine.days_late} days overdue</td>
                                  <td className="text-right">₹{fine.fine_amount.toFixed(2)}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Total Amount Section */}
                    <div className="total-section-modal">
                      <div className="total-breakdown">
                        <div className="subtotal-row">
                          <span>Energy Charges:</span>
                          <span>₹{tariffCharges.amount}</span>
                        </div>
                        <div className="subtotal-row">
                          <span>Additional Charges:</span>
                          <span>₹{(totalAmount - tariffCharges.amount).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="total-display">
                        <div className="total-left">
                          <span className="total-label">Total Amount Due</span>
                          <span className="payment-terms">Payment due by {bill_details?.due_date && new Date(bill_details.due_date).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div className="total-right">
                          <span className="currency">₹</span>
                          <span className="total-amount">{totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="modal-actions">
                      <button className="pay-button-modal" onClick={handleDownloadPDF}>
                        <i className="fas fa-download"></i>
                        Download PDF
                      </button>
                  
                    </div>
                  </div>
                </div>
              </div>
            )}


          </>
        ) : (
          <div className="no-bill-message">
            <h3>No Bill Found</h3>
            <p>No bill available for the selected period ({selectedMonth}/{selectedYear}). Please select a different period.</p>
          </div>
        )}
      </div>
    <Footer/>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default Bills;