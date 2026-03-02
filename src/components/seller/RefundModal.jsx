import { useState } from 'react';

const RefundModal = ({ isOpen, onClose, request, onSuccess }) => {
  const [refundMethod, setRefundMethod] = useState('original');
  const [refundAmount, setRefundAmount] = useState(request?.refundAmount || 0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!confirm(`Confirm refund of $${refundAmount} to buyer?`)) return;

    setLoading(true);

    // TODO: Call backend API when implemented
    // For now, just show success message
    setTimeout(() => {
      alert(`Refund of $${refundAmount} has been processed successfully!\n\nNote: Backend API not yet implemented. This is UI only.`);
      setLoading(false);
      onSuccess();
      onClose();
    }, 1000);
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
            background: '#fff3cd',
            border: '1px solid #ffc107',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px'
          }}>
            <strong>⚠️ Notice:</strong> Backend API not yet implemented. This is UI preview only.
            The refund will be processed according to your payment gateway settings.
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
