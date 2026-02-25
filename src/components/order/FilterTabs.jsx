const tabs = ["All Purchases", "Processing", "Unpaid items", "Returns & Canceled", "Show hidden", "Ready for feedback", "Shipped"];

const FilterTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="purchase-filter-tabs">
      <button className="purchase-filter-arrow">‹</button>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`purchase-filter-tab ${activeTab === tab ? 'active' : ''}`}
          style={{
            border: activeTab === tab ? "2px solid #111" : "1px solid #ccc",
            fontWeight: activeTab === tab ? "600" : "400",
          }}
        >
          {tab}
        </button>
      ))}
      <button className="purchase-filter-arrow">›</button>
    </div>
  );
};

export default FilterTabs;
