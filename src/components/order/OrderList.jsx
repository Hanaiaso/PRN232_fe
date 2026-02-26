import { useState } from 'react';
import ReturnRequestModal from './ReturnRequestModal';

const OrderList = ({ orders }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [returnModal, setReturnModal] = useState({ isOpen: false, order: null, item: null });

  const handleAction = (action, order, item) => {
    setOpenDropdown(null);
    
    if (action === 'Return this item') {
      setReturnModal({ isOpen: true, order, item });
    } else {
      console.log(`Action: ${action}`);
    }
  };

  if (!orders || orders.length === 0) {
    return <div className="purchase-history-empty">No orders found</div>;
  }

  return (
    <div className="order-list">
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-card-header">
            <div className="order-info">
              <span className="order-id">Order #{order.id}</span>
              <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            <div className="order-status-wrapper">
              <span className={`order-status status-${order.status?.toLowerCase() || 'unknown'}`}>
                {order.status || 'UNKNOWN'}
              </span>
            </div>
          </div>
          
          <div className="order-items">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index}>
                  <div className="order-item">
                    <div className="order-item-image">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} />
                      ) : (
                        <div className="order-item-placeholder">No Image</div>
                      )}
                    </div>
                    <div className="order-item-details">
                      <h3>{item.productName}</h3>
                      <p className="order-item-category">{item.categoryName}</p>
                      <p className="order-item-quantity">Quantity: {item.quantity}</p>
                    </div>
                    <div className="order-item-price">
                      <span className="unit-price">${item.unitPrice}</span>
                      <span className="total-price">${item.totalPrice}</span>
                    </div>
                  </div>
                  <div className="order-item-actions">
                    <div className="dropdown">
                      <button 
                        className="dropdown-toggle"
                        onClick={() => setOpenDropdown(openDropdown === `${order.id}-${index}` ? null : `${order.id}-${index}`)}
                      >
                        More actions ▼
                      </button>
                      {openDropdown === `${order.id}-${index}` && (
                        <div className="dropdown-menu">
                          <button onClick={() => handleAction('Leave feedback', order, item)}>Leave feedback</button>
                          <button onClick={() => handleAction('View order detail', order, item)}>View order detail</button>
                          <button onClick={() => handleAction('Contact seller', order, item)}>Contact seller</button>
                          <button onClick={() => handleAction('Return this item', order, item)}>Return this item</button>
                          <button onClick={() => handleAction('Resolve a problem', order, item)}>Resolve a problem</button>
                          <button onClick={() => handleAction('Hide order', order, item)}>Hide order</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No items</div>
            )}
          </div>
          
          <div className="order-card-footer">
            <div className="order-method">Payment: {order.method}</div>
            <div className="order-total">Total: ${order.totalPrice}</div>
          </div>
        </div>
      ))}
      
      <ReturnRequestModal
        isOpen={returnModal.isOpen}
        onClose={() => setReturnModal({ isOpen: false, order: null, item: null })}
        order={returnModal.order}
        item={returnModal.item}
      />
    </div>
  );
};

export default OrderList;
