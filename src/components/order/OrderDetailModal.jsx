const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="order-detail-content">
          <div className="detail-section">
            <h3>Order Information</h3>
            <div className="detail-row">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">#{order.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Order Date:</span>
              <span className="detail-value">{new Date(order.orderDate).toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`order-status status-${order.status?.toLowerCase() || 'unknown'}`}>
                {order.status}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">{order.method}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Items</h3>
            {order.items && order.items.map((item, index) => (
              <div key={index} className="detail-item">
                <div className="detail-item-image">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} />
                  ) : (
                    <div className="detail-item-placeholder">No Image</div>
                  )}
                </div>
                <div className="detail-item-info">
                  <h4>{item.productName}</h4>
                  <p>Category: {item.categoryName}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Unit Price: ${item.unitPrice}</p>
                  <p className="detail-item-total">Total: ${item.totalPrice}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="detail-section">
            <div className="detail-total">
              <span className="detail-total-label">Order Total:</span>
              <span className="detail-total-value">${order.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">Close</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
