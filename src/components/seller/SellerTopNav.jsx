const SellerTopNav = () => {
  return (
    <div className="seller-top-nav">
      <div className="seller-top-nav-items">
        {["Orders", "Listings", "Performance"].map((item) => (
          <div
            key={item}
            className="seller-top-nav-item"
            style={{
              borderBottom: item === "Orders" ? "3px solid #111" : "3px solid transparent",
              fontWeight: item === "Orders" ? "600" : "400",
              color: item === "Orders" ? "#111" : "#555",
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="seller-top-nav-user">
        <span style={{ cursor: "pointer" }}>Seller Account</span>
        <span>⚙️</span>
      </div>
    </div>
  );
};

export default SellerTopNav;
