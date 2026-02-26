import { useState } from 'react';
import { getAccessToken } from '@/api/token';

const RespondModal = ({ isOpen, onClose, request, onSuccess }) => {
  const [accept, setAccept] = useState(true);
  const [response, setResponse] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);

  // Mock saved addresses - replace with API call
  const savedAddresses = [
    { id: 1, label: '123 Main St, New York, NY 10001' },
    { id: 2, label: '456 Oak Ave, Los Angeles, CA 90001' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAccessToken();
      const res = await fetch(`https://localhost:49547/api/ReturnRequest/${request.id}/respond`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Accept: accept,
          Response: response
        })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert(result.message || 'Response submitted successfully!');
        setAccept(true);
        setResponse('');
        onSuccess();
        onClose();
      } else {
        alert(result.message || 'Failed to submit response');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Error submitting response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Respond to Return Request</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="return-form">
          <div className="form-group">
            <label>Decision *</label>
            <select 
              value={accept ? 'true' : 'false'} 
              onChange={(e) => setAccept(e.target.value === 'true')}
              required
            >
              <option value="true">Accept Return</option>
              <option value="false">Reject Return</option>
            </select>
          </div>

          {accept && (
            <>
              <div className="form-group">
                <label>Return Address *</label>
                <select 
                  value={selectedAddress} 
                  onChange={(e) => {
                    setSelectedAddress(e.target.value);
                    setShowNewAddress(e.target.value === 'new');
                  }}
                  required
                >
                  <option value="">Select return address</option>
                  {savedAddresses.map(addr => (
                    <option key={addr.id} value={addr.id}>{addr.label}</option>
                  ))}
                  <option value="new">+ Add new address</option>
                </select>
              </div>

              {showNewAddress && (
                <div className="new-address-form">
                  <h3>New Return Address</h3>
                  <div className="form-group">
                    <label>Recipient Name *</label>
                    <input
                      type="text"
                      value={newAddress.recipientName}
                      onChange={(e) => setNewAddress({...newAddress, recipientName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>ZIP Code *</label>
                      <input
                        type="text"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country *</label>
                      <input
                        type="text"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <label>Response Message</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Add a message to the buyer..."
              rows="4"
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Submitting...' : 'Submit Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RespondModal;
