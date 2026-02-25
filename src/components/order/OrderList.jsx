const OrderList = ({ orders }) => {
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
                <div key={index} className="order-item">
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
    </div>
  );
};

export default OrderList;
