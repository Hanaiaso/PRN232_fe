import { useState } from 'react';
import RespondModal from './RespondModal';

const ReturnRequestList = ({ requests, onRefresh }) => {
  const [respondModal, setRespondModal] = useState({ isOpen: false, request: null });

  if (!requests || requests.length === 0) {
    return <div className="seller-hub-empty">No return requests found</div>;
  }

  return (
    <div className="return-request-list">
      {requests.map((request) => (
        <div key={request.id} className="return-request-card">
          <div className="return-request-header">
            <div className="return-request-info">
              <span className="return-request-id">Request #{request.id}</span>
              <span className="return-request-date">{new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
            <span className={`order-status status-${request.status?.toLowerCase() || 'unknown'}`}>
              {request.status}
            </span>
          </div>

          <div className="return-request-body">
            <div className="return-request-product">
              <div className="return-request-image">
                {request.productImage ? (
                  <img src={request.productImage} alt={request.productName} />
                ) : (
                  <div className="order-item-placeholder">No Image</div>
                )}
              </div>
              <div className="return-request-details">
                <h3>{request.productName}</h3>
                <p>Order ID: #{request.orderId}</p>
                <p>Buyer: {request.buyerName}</p>
                <p>Reason: {request.reasonCodeName}</p>
              </div>
            </div>

            <div className="return-request-amount">
              <span className="refund-label">Refund Amount:</span>
              <span className="refund-value">${request.refundAmount}</span>
            </div>
          </div>

          {request.images && (
            <div className="return-request-images">
              <p>Attached Images:</p>
              <div className="image-list">
                {JSON.parse(request.images).map((img, idx) => (
                  <img key={idx} src={`https://localhost:49547${img}`} alt={`Evidence ${idx + 1}`} />
                ))}
              </div>
            </div>
          )}

          <div className="return-request-actions">
            <button className="btn-action">View Details</button>
            <button 
              className="btn-action btn-primary"
              onClick={() => setRespondModal({ isOpen: true, request })}
            >
              Respond
            </button>
          </div>
        </div>
      ))}
      
      <RespondModal
        isOpen={respondModal.isOpen}
        onClose={() => setRespondModal({ isOpen: false, request: null })}
        request={respondModal.request}
        onSuccess={onRefresh}
      />
    </div>
  );
};

export default ReturnRequestList;
