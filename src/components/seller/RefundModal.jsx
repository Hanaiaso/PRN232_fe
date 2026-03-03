import { useState } from 'react';
import { getAccessToken } from '@/api/token';

const RefundModal = ({ isOpen, onClose, request, onSuccess }) => {
  const [refundMethod, setRefundMethod] = useState('original');
  const [refundAmount, setRefundAmount] = useState(request?.refundAmount || 0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!confirm(`Confirm refund of $${refundAmount} to buyer?`)) return;

    setLoading(true);

    try {
      const token = getAccessToken();
      const res = await fetch(`https://localhost:49547/api/ReturnRequest/${request.id}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          RefundAmount: refundAmount,
          RefundMethod: refundMethod,
          Notes: notes,
          PayPalCaptureId: request.paypalCaptureId || null
        })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert(`Refund processed successfully!\n\nRefund ID: ${result.data.refundId}\nAmount: $${result.data.amount}\nStatus: ${result.data.status}`);
        setLoading(false);
        onSuccess();
        onClose();
      } else {
        alert(result.message || 'Failed to process refund');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Error processing refund. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen || !request) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Process Refund - Request #{request.id}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="return-form" style={{ padding: '20px' }}>
          <div className="refund-summary" style={{ 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
            <h3>Refund Summary</h3>
            <p><strong>Buyer:</strong> {request.buyerName}</p>
            <p><strong>Product:</strong> {request.productName}</p>
            <p><strong>Original Amount:</strong> ${request.refundAmount}</p>
          </div>

          <div className="form-group">
            <label>Refund Amount *</label>
            <input
              type="number"
              step="0.01"
              value={refundAmount}
              onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
              max={request.refundAmount}
              required
            />
            <small>Maximum: ${request.refundAmount}</small>
          </div>

          <div className="form-group">
            <label>Refund Method *</label>
            <select 
              value={refundMethod} 
              onChange={(e) => setRefundMethod(e.target.value)}
              required
            >
              <option value="original">Original Payment Method</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Transfer</option>
              <option value="store_credit">Store Credit</option>
            </select>
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this refund..."
              rows="3"
            />
          </div>

          <div className="refund-notice" style={{
            background: '#d4edda',
            border: '1px solid #28a745',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px'
          }}>
            <strong>✅ PayPal Integration:</strong> Refunds will be processed through PayPal automatically.
            For manual refunds, a reference ID will be generated.
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Processing...' : `Process Refund $${refundAmount}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundModal;
