import { useState, useEffect } from 'react';
import { getAccessToken } from '@/api/token';

const ReturnRequestDetailModal = ({ isOpen, onClose, requestId }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && requestId) {
      fetchDetail();
    }
  }, [isOpen, requestId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      const res = await fetch(`https://localhost:49547/api/ReturnRequest/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setDetail(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Return Request Detail #{requestId}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {loading ? (
          <div style={{ padding: '20px' }}>Loading...</div>
        ) : detail ? (
          <div className="return-detail-content" style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="detail-section">
              <h3>Status</h3>
              <span className={`order-status status-${detail.status?.toLowerCase()}`}>
                {detail.status}
              </span>
            </div>

            <div className="detail-section">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> #{detail.orderId}</p>
              <p><strong>Order Date:</strong> {detail.orderDate ? new Date(detail.orderDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Order Total:</strong> ${detail.orderTotalPrice}</p>
            </div>

            {detail.productName && (
              <div className="detail-section">
                <h3>Product Information</h3>
                <div className="product-info">
                  {detail.productImage && (
                    <img src={detail.productImage} alt={detail.productName} style={{ width: '100px' }} />
                  )}
                  <div>
                    <p><strong>{detail.productName}</strong></p>
                    <p>Quantity: {detail.quantity}</p>
                    <p>Unit Price: ${detail.unitPrice}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="detail-section">
              <h3>Return Information</h3>
              <p><strong>Buyer:</strong> {detail.buyerName}</p>
              <p><strong>Seller:</strong> {detail.sellerName}</p>
              <p><strong>Reason:</strong> {detail.reasonCodeName}</p>
              {detail.reason && <p><strong>Details:</strong> {detail.reason}</p>}
              <p><strong>Refund Amount:</strong> ${detail.refundAmount}</p>
              <p><strong>Created:</strong> {new Date(detail.createdAt).toLocaleString()}</p>
            </div>

            {detail.sellerResponse && (
              <div className="detail-section">
                <h3>Seller Response</h3>
                <p>{detail.sellerResponse}</p>
              </div>
            )}

            {detail.trackingNumber && (
              <div className="detail-section">
                <h3>Shipping Information</h3>
                <p><strong>Tracking Number:</strong> {detail.trackingNumber}</p>
                <p><strong>Carrier:</strong> {detail.shippingCarrier}</p>
              </div>
            )}

            {detail.images && (
              <div className="detail-section">
                <h3>Attached Images</h3>
                <div className="image-list">
                  {JSON.parse(detail.images).map((img, idx) => (
                    <img key={idx} src={`https://localhost:49547${img}`} alt={`Evidence ${idx + 1}`} style={{ width: '150px', margin: '5px' }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '20px' }}>No data found</div>
        )}

        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestDetailModal;
