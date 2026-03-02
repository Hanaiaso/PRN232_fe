const navItems = ["Summary", "Recently viewed", "Bids & offers", "Watchlist", "Purchases", "Return Requests", "Saved feed", "Saved searches", "Saved sellers", "Selling", "My Garage", "My Collection", "Sizes", "PSA Vault"];

const Sidebar = ({ activeNav, setActiveNav }) => {
  return (
    <div className="purchase-sidebar">
      <div className="purchase-sidebar-title">My eBay</div>
      {navItems.map((item) => (
        <div
          key={item}
          onClick={() => setActiveNav(item)}
          className={`purchase-sidebar-item ${activeNav === item ? 'active' : ''}`}
          style={{
            borderLeft: activeNav === item ? "3px solid #111" : "3px solid transparent",
          }}
        >
          {item}
          {item === "Saved feed" && (
            <span className="purchase-sidebar-badge">NEW</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
