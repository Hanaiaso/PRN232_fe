import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { displayActionMessage } from '@/helpers/utils';
import { auctionService } from '@/services/auctionService';
import CountdownTimer from './CountdownTimer';

const AuctionCard = ({ auction }) => {
  const [currentBid, setCurrentBid] = useState(auction.currentBid);
  const [bidCount, setBidCount] = useState(auction.bidCount);
  const [bidAmount, setBidAmount] = useState(auction.currentBid + 10000); // Default next bid
  const [isEnded, setIsEnded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useSelector((state) => ({ user: state.auth }));
  const history = useHistory();

  // Polling for updates every 5 seconds
  useEffect(() => {
    if (isEnded) return;

    const interval = setInterval(async () => {
      try {
        const latest = await auctionService.getAuctionDetail(auction.productId);
        if (latest.currentBid > currentBid) {
          setCurrentBid(latest.currentBid);
          setBidCount(latest.bidCount);
          // Auto-adjust input if it's too low
          if (bidAmount <= latest.currentBid) {
            setBidAmount(latest.currentBid + 10000);
          }
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [auction.productId, currentBid, isEnded, bidAmount]);

  const handleBid = async () => {
    if (!user) {
      displayActionMessage('Please sign in to place a bid', 'info');
      history.push('/signin');
      return;
    }

    if (bidAmount <= currentBid) {
      displayActionMessage('Bid must be higher than current bid', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await auctionService.placeBid(auction.productId, bidAmount, user.id);
      displayActionMessage('Bid placed successfully!', 'success');

      // Refresh local state immediately
      const latest = await auctionService.getAuctionDetail(auction.productId);
      setCurrentBid(latest.currentBid);
      setBidCount(latest.bidCount);
      setBidAmount(latest.currentBid + 10000);
    } catch (e) {
      displayActionMessage(e.message || 'Failed to place bid', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`auction-card ${isEnded ? 'ended' : ''}`}>
      <div className="auction-card-img">
        <img src={auction.image || 'https://placehold.co/300x200?text=No+Image'} alt={auction.title} />
        <div className="auction-timer-overlay">
          <CountdownTimer endTime={auction.auctionEndTime} onEnd={() => setIsEnded(true)} />
        </div>
      </div>

      <div className="auction-card-details">
        <h3 className="auction-title">{auction.title}</h3>

        <div className="auction-bid-info">
          <div className="bid-stat">
            <span className="label">Current Bid</span>
            <span className="value">{currentBid.toLocaleString()} VNĐ</span>
          </div>
          <div className="bid-stat">
            <span className="label">Bids</span>
            <span className="value">{bidCount}</span>
          </div>
        </div>

        {!isEnded ? (
          <div className="auction-action">
            <div className="bid-input-group">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(parseInt(e.target.value, 10))}
                disabled={isSubmitting}
                step="10000"
              />
              <button
                className="button button-small"
                onClick={handleBid}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing...' : 'Bid'}
              </button>
            </div>
          </div>
        ) : (
          <div className="auction-ended-msg">
            Auction Ended
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionCard;
