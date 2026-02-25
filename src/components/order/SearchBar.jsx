const SearchBar = ({ searchValue, setSearchValue }) => {
  return (
    <div className="purchase-search-bar">
      <div className="purchase-search-input-wrapper">
        <input
          type="text"
          placeholder="Search your orders"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="purchase-search-input"
          style={{
            width: "320px",
            padding: "10px 36px 10px 14px",
            border: "1px solid #ccc",
            borderRadius: "24px",
            fontSize: "14px",
            outline: "none",
            color: "#111",
          }}
        />
        {searchValue && (
          <span
            onClick={() => setSearchValue("")}
            className="purchase-search-clear"
          >
            ×
          </span>
        )}
      </div>
      <button className="purchase-search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
