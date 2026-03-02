import React from 'react';
import AuctionCard from './AuctionCard';

const AuctionGrid = ({ auctions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="auction-grid-loading">
        <p>Loading auctions...</p>
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="auction-grid-empty">
        <p>No active auctions at the moment.</p>
      </div>
    );
  }

  return (
    <div className="auction-grid">
      {auctions.map((auction) => (
        <AuctionCard key={auction.productId} auction={auction} />
      ))}
    </div>
  );
};

export default AuctionGrid;
