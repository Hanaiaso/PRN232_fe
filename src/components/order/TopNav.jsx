const TopNav = () => {
  return (
    <div className="purchase-top-nav">
      <div className="purchase-top-nav-items">
        {["Activity", "Messages", "Account"].map((item) => (
          <div
            key={item}
            className="purchase-top-nav-item"
            style={{
              borderBottom: item === "Activity" ? "3px solid #111" : "3px solid transparent",
              fontWeight: item === "Activity" ? "600" : "400",
              color: item === "Activity" ? "#111" : "#555",
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="purchase-top-nav-user">
        <span style={{ cursor: "pointer" }}>tes_902xxx (0)</span>
        <span>🔖</span>
      </div>
    </div>
  );
};

export default TopNav;
