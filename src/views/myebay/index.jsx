import { SearchOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useDocumentTitle, useScrollTop } from '@/hooks';

const TestPage = () => {
  useDocumentTitle('My eBay | Salinaka');
  useScrollTop();
  
  const [activeCategory, setActiveCategory] = useState('summary');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'summary', name: 'Summary' },
    { id: 'recently-viewed', name: 'Recently Viewed' },
    { id: 'purchase-history', name: 'Purchase History' },
    { id: 'selling', name: 'Selling' },
    { id: 'watchlist', name: 'Watchlist' }
  ];

  const mockContent = {
    summary: [
      { id: 1, title: 'Total Purchases', value: '24 items' },
      { id: 2, title: 'Total Spent', value: '$1,245.99' },
      { id: 3, title: 'Items Watched', value: '8 items' }
    ],
    'recently-viewed': [
      { id: 1, name: 'iPhone 14 Pro', price: '$999.00', image: '/static/salt-image-1.png' },
      { id: 2, name: 'MacBook Air', price: '$1,299.00', image: '/static/salt-image-2.png' },
      { id: 3, name: 'AirPods Pro', price: '$249.00', image: '/static/salt-image-3.png' }
    ],
    'purchase-history': [
      { id: 1, item: 'Wireless Headphones', date: '2024-01-15', status: 'Delivered', price: '$89.99' },
      { id: 2, item: 'Gaming Mouse', date: '2024-01-10', status: 'Shipped', price: '$45.99' },
      { id: 3, item: 'USB Cable', date: '2024-01-05', status: 'Delivered', price: '$12.99' }
    ],
    selling: [
      { id: 1, item: 'Old Phone', listed: '2024-01-20', status: 'Active', price: '$150.00' },
      { id: 2, item: 'Books Set', listed: '2024-01-18', status: 'Sold', price: '$25.00' }
    ],
    watchlist: [
      { id: 1, name: 'Smart Watch', price: '$299.00', ends: '2d 5h' },
      { id: 2, name: 'Laptop Stand', price: '$45.00', ends: '1d 12h' }
    ]
  };

  const getCurrentCategoryName = () => {
    return categories.find(cat => cat.id === activeCategory)?.name || 'My eBay';
  };

  const renderContent = () => {
    const content = mockContent[activeCategory] || [];
    
    if (activeCategory === 'summary') {
      return (
        <div className="summary-grid">
          {content.map(item => (
            <div key={item.id} className="summary-card">
              <h3>{item.title}</h3>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      );
    }
    
    if (activeCategory === 'recently-viewed') {
      return (
        <div className="items-grid">
          {content.map(item => (
            <div key={item.id} className="item-card">
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="list-content">
        {content.map(item => (
          <div key={item.id} className="list-item">
            <span>{item.item || item.name}</span>
            <span>{item.price}</span>
            <span>{item.status || item.ends}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="content">
      <div className="myebay-layout">
        {/* Left Sidebar - 3/10 */}
        <div className="sidebar">
          <h2>My eBay</h2>
          <ul className="category-list">
            {categories.map(category => (
              <li key={category.id}>
                <button
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Right Content - 7/10 */}
        <div className="main-content">
          {/* Header */}
          <div className="content-header">
            <h1>{getCurrentCategoryName()}</h1>
            <div className="search-bar">
              <SearchOutlined className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="content-body">
            {renderContent()}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TestPage;