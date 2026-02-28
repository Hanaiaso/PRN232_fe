import { useState, useEffect } from 'react';
import { getAccessToken } from '@/api/token';

const ShipReturnModal = ({ isOpen, onClose, request, onSuccess }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingCarrier, setShippingCarrier] = useState('');
  const [returnAddress, setReturnAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && request) {
      fetchReturnAddress();
    }
  }, [isOpen, request]);

  const fetchReturnAddress = async () => {
    try {
      const token = getAccessToken();
      const res = await fetch(`https://localhost:49547/api/ShippingInfo/return-request/${request.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data && result.data.returnAddress) {
          setReturnAddress(result.data.returnAddress);
        }
      }
    } catch (error) {
      console.error('Error fetching return address:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAccessToken();
      const res = await fetch(`https://localhost:49547/api/ReturnRequest/${request.id}/ship`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          TrackingNumber: trackingNumber,
          ShippingCarrier: shippingCarrier
        })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert(result.message || 'Tracking information submitted successfully!');
        setTrackingNumber('');
        setShippingCarrier('');
        onSuccess();
        onClose();
      } else {
        alert(result.message || 'Failed to submit tracking information');
      }
    } catch (error) {
      console.error('Error submitting tracking:', error);
      alert('Error submitting tracking information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ship Return - Request #{request?.id}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        {returnAddress && (
          <div className="return-address-info">
            <h3>Ship to this address:</h3>
            <p><strong>{returnAddress.fullName}</strong></p>
            <p>{returnAddress.street}</p>
            <p>{returnAddress.city}, {returnAddress.state}</p>
            <p>{returnAddress.country}</p>
            {returnAddress.phone && <p>Phone: {returnAddress.phone}</p>}
          </div>
        )}

        <form onSubmit={handleSubmit} className="return-form">
          <div className="form-group">
            <label>Tracking Number *</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              required
            />
          </div>

          <div className="form-group">
            <label>Shipping Carrier *</label>
            <select 
              value={shippingCarrier} 
              onChange={(e) => setShippingCarrier(e.target.value)}
              required
            >
              <option value="">Select carrier</option>
              <option value="USPS">USPS</option>
              <option value="FedEx">FedEx</option>
              <option value="UPS">UPS</option>
              <option value="DHL">DHL</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Submitting...' : 'Submit Tracking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipReturnModal;
