import React, { useState, useEffect } from 'react';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import { auctionService } from '@/services/auctionService';
import AuctionGrid from '@/components/auction/AuctionGrid';

const Auctions = () => {
  useDocumentTitle('Auctions | Salinaka');
  useScrollTop();

  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAuctions = async () => {
    setIsLoading(true);
    try {
      const data = await auctionService.getAuctions();
      setAuctions(data);
      setError(null);
    } catch (e) {
      setError('Failed to load auctions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <main className="content">
      <div className="auction-page">
        <div className="display-header">
          <h1>Live Auctions</h1>
          <p>Bid on exclusive eyewear and accessories.</p>
        </div>

        {error ? (
          <div className="error-display">
            <p>{error}</p>
            <button className="button button-small" onClick={fetchAuctions}>Retry</button>
          </div>
        ) : (
          <AuctionGrid auctions={auctions} isLoading={isLoading} />
        )}
      </div>
    </main>
  );
};

export default Auctions;
