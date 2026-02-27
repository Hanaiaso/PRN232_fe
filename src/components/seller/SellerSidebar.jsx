const navItems = [
  "All orders",
  "Awaiting payment",
  "Awaiting shipment",
  "Paid and shipped",
  "All selling",
  "Return request"
];

const SellerSidebar = ({ activeNav, setActiveNav }) => {
  return (
    <div className="seller-sidebar">
      <div className="seller-sidebar-title">Seller Hub</div>
      {navItems.map((item) => (
        <div
          key={item}
          onClick={() => setActiveNav(item)}
          className={`seller-sidebar-item ${activeNav === item ? 'active' : ''}`}
          style={{
            borderLeft: activeNav === item ? "3px solid #111" : "3px solid transparent",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default SellerSidebar;
