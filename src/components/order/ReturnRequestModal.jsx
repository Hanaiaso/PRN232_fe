import { useState } from 'react';
import { getAccessToken } from '@/api/token';

const ReturnRequestModal = ({ isOpen, onClose, order, item }) => {
  const [reasonCode, setReasonCode] = useState('');
  const [reason, setReason] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAccessToken();
      const formData = new FormData();
      formData.append('OrderId', order.id);
      if (item) formData.append('OrderItemId', item.orderId);
      formData.append('ReasonCode', reasonCode);
      formData.append('Reason', reason);
      
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch('https://localhost:49547/api/ReturnRequest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(result.message || 'Return request submitted successfully!');
        setReasonCode('');
        setReason('');
        setImages([]);
        onClose();
      } else {
        alert(result.message || 'Failed to submit return request');
      }
    } catch (error) {
      console.error('Error submitting return request:', error);
      alert('Error submitting return request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Return Request</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="return-form">
          <div className="form-group">
            <label>Reason for Return *</label>
            <select 
              value={reasonCode} 
              onChange={(e) => setReasonCode(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              <option value="0">Changed my mind</option>
              <option value="1">Doesn't fit</option>
              <option value="2">Wrong item</option>
              <option value="3">Defective or damaged</option>
              <option value="4">Not as described</option>
            </select>
          </div>

          <div className="form-group">
            <label>Additional Details</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide more details about your return..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Upload Images (Optional)</label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={(e) => setImages(Array.from(e.target.files))}
            />
            {images.length > 0 && (
              <p className="file-count">{images.length} file(s) selected</p>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Submitting...' : 'Request Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnRequestModal;
