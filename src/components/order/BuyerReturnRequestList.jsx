import { useState } from 'react';
import ShipReturnModal from './ShipReturnModal';
import ReturnRequestDetailModal from './ReturnRequestDetailModal';

const BuyerReturnRequestList = ({ requests, onRefresh }) => {
  const [shipModal, setShipModal] = useState({ isOpen: false, request: null });
  const [detailModal, setDetailModal] = useState({ isOpen: false, requestId: null });

  if (!requests || requests.length === 0) {
    return <div className="purchase-history-empty">No return requests found</div>;
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
                <p>Seller: {request.sellerName}</p>
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

          {request.trackingNumber && (
            <div className="return-request-tracking">
              <p><strong>Tracking Number:</strong> {request.trackingNumber}</p>
              <p><strong>Carrier:</strong> {request.shippingCarrier}</p>
            </div>
          )}

          <div className="return-request-actions">
            <button 
              className="btn-action"
              onClick={() => setDetailModal({ isOpen: true, requestId: request.id })}
            >
              View Details
            </button>
            {request.status === 'AwaitingBuyerShipment' && (
              <button 
                className="btn-action btn-primary"
                onClick={() => setShipModal({ isOpen: true, request })}
              >
                Ship Return
              </button>
            )}
          </div>
        </div>
      ))}
      
      <ShipReturnModal
        isOpen={shipModal.isOpen}
        onClose={() => setShipModal({ isOpen: false, request: null })}
        request={shipModal.request}
        onSuccess={onRefresh}
      />
      
      <ReturnRequestDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, requestId: null })}
        requestId={detailModal.requestId}
      />
    </div>
  );
};

export default BuyerReturnRequestList;
