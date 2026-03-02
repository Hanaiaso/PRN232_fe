const SellerStats = () => {
  const stats = [
    { label: "Active Listings", value: "0", color: "#3665f3" },
    { label: "Sold (30 days)", value: "0", color: "#00a650" },
    { label: "Total Sales", value: "$0.00", color: "#f57c00" },
    { label: "Pending Orders", value: "0", color: "#c62828" }
  ];

  return (
    <div className="seller-stats">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default SellerStats;
