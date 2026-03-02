<<<<<<< Updated upstream
import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { ColorChooser, ImageLoader, MessageDisplay, ChatWidget } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
=======
import { ArrowLeftOutlined, CloseOutlined, LoadingOutlined, StarFilled, ThunderboltOutlined } from '@ant-design/icons';
import { ImageLoader, MessageDisplay, ChatWidget } from '@/components/common';
import { ProductShowcaseGrid, ProductReviews } from '@/components/product';
>>>>>>> Stashed changes
import { RECOMMENDED_PRODUCTS, SHOP } from '@/constants/routes';
import { displayMoney, displayActionMessage } from '@/helpers/utils';
import {
  useBasket,
  useDocumentTitle,
  useProduct,
  useRecommendedProducts,
  useScrollTop
} from '@/hooks';
<<<<<<< Updated upstream
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';
=======
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import CountdownTimer from '@/components/auction/CountdownTimer';
import { auctionService } from '@/services/auctionService';
>>>>>>> Stashed changes

const ViewProduct = () => {
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket, isItemOnBasket } = useBasket(id);
  const { user } = useSelector((state) => ({ user: state.auth }));
  const history = useHistory();

  useScrollTop();
  useDocumentTitle(`View ${product?.name || 'Item'}`);

  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showChat, setShowChat] = useState(false);

  // Auction states
  const [currentBid, setCurrentBid] = useState(0);
  const [bidCount, setBidCount] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  // eBay UI states
  const [auctionDetail, setAuctionDetail] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showOutbidAlert, setShowOutbidAlert] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured
  } = useRecommendedProducts(6);
  const colorOverlay = useRef(null);

  useEffect(() => {
<<<<<<< Updated upstream
    setSelectedImage(product?.image);
  }, [product]);

  const onSelectedSizeChange = (newValue) => {
    setSelectedSize(newValue.value);
  };

  const onSelectedColorChange = (color) => {
    setSelectedColor(color);
    if (colorOverlay.current) {
      colorOverlay.current.value = color;
=======
    setSelectedImage(product?.image || null);
    if (product?.isAuction) {
      const currentPrice = product.currentHighestBid || product.price;
      setCurrentBid(currentPrice);
      setBidCount(product.bidCount || 0);
      setBidAmount(currentPrice + 5000); // Smaller increment: 5k
      fetchFullAuctionDetail();
    }
  }, [product]);

  const fetchFullAuctionDetail = async () => {
    try {
      const detail = await auctionService.getAuctionFullDetail(id);
      setAuctionDetail(detail);
      if (detail.currentBid > currentBid) {
        // If we were the previous high bidder and now we are not, show outbid alert
        if (auctionDetail && auctionDetail.highestBidderId === user?.id && detail.highestBidderId !== user?.id) {
          setShowOutbidAlert(true);
        }
        setCurrentBid(detail.currentBid);
        setBidCount(detail.bidCount);
        if (bidAmount <= detail.currentBid) {
          setBidAmount(detail.currentBid + 5000);
        }
      }
    } catch (e) {
      console.error('Error fetching full detail:', e);
    }
  };

  // Polling for auction updates
  useEffect(() => {
    if (!product?.isAuction || isAuctionEnded) return;

    const interval = setInterval(async () => {
      await fetchFullAuctionDetail();
    }, 5000);

    return () => clearInterval(interval);
  }, [product, currentBid, isAuctionEnded, bidAmount]);

  const handleAddToBasket = () => {
    addToBasket({ ...product });
  };

  const handlePlaceBid = async (amount) => {
    const finalAmount = amount || bidAmount;
    if (!user) {
      displayActionMessage('Vui lòng đăng nhập để đặt giá', 'info');
      history.push('/signin');
      return;
    }

    if (!finalAmount || isNaN(finalAmount)) {
      displayActionMessage('Vui lòng nhập số tiền đấu giá hợp lệ', 'error');
      return;
    }

    if (finalAmount <= currentBid) {
      displayActionMessage('Giá đặt phải cao hơn giá hiện tại', 'error');
      return;
    }

    setIsSubmittingBid(true);
    try {
      await auctionService.placeBid(product.id, finalAmount, user.id);
      displayActionMessage('Đặt giá thành công!', 'success');
      setIsBidModalOpen(false);
      setIsConfirmModalOpen(false);
      setShowOutbidAlert(false);
      await fetchFullAuctionDetail();
    } catch (e) {
      displayActionMessage(e.message || 'Lỗi khi đặt giá', 'error');
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const handleOpenConfirm = () => {
    if (!user) {
      displayActionMessage('Vui lòng đăng nhập để đặt giá', 'info');
      history.push('/signin');
      return;
    }
    if (!bidAmount || isNaN(bidAmount)) {
      displayActionMessage('Vui lòng nhập số tiền đấu giá', 'error');
      return;
    }
    if (bidAmount <= currentBid) {
      displayActionMessage('Giá đặt phải cao hơn giá hiện tại', 'error');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarFilled
          key={i}
          style={{ color: i <= Math.round(rating) ? '#f5a623' : '#ddd', fontSize: '14px', marginRight: '2px' }}
        />
      );
>>>>>>> Stashed changes
    }
  };

  const handleAddToBasket = () => {
    addToBasket({ ...product, selectedColor, selectedSize: selectedSize || product.sizes[0] });
  };

  const maskName = (name) => {
    if (!name || name.length < 2) return name || '***';
    return `${name[0]}***${name[name.length - 1]}`;
  };

  const getAggregatedHistory = () => {
    if (!auctionDetail?.bidHistory) return [];

    // Group by bidderName and take the max amount
    const grouped = auctionDetail.bidHistory.reduce((acc, bid) => {
      const name = bid.bidderName;
      if (!acc[name] || bid.amount > acc[name].amount) {
        acc[name] = bid;
      }
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => b.amount - a.amount);
  };

  return (
    <main className="content">
      {isLoading && (
        <div className="loader">
          <h4>Loading Product...</h4>
          <br />
          <LoadingOutlined style={{ fontSize: '3rem' }} />
        </div>
      )}
      {error && (
        <MessageDisplay message={error} />
      )}
      {(product && !isLoading) && (
        <div className="product-view">
          <Link to={SHOP}>
            <h3 className="button-link d-inline-flex">
              <ArrowLeftOutlined />
              &nbsp; Back to shop
            </h3>
          </Link>
          <div className="product-modal">
            {product.imageCollection.length !== 0 && (
              <div className="product-modal-image-collection">
                {product.imageCollection.map((image) => (
                  <div
                    className="product-modal-image-collection-wrapper"
                    key={image.id}
                    onClick={() => setSelectedImage(image.url)}
                    role="presentation"
                  >
                    <ImageLoader
                      className="product-modal-image-collection-img"
                      src={image.url}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="product-modal-image-wrapper">
              {selectedColor && <input type="color" disabled ref={colorOverlay} id="color-overlay" />}
              <ImageLoader
                alt={product.name}
                className="product-modal-image"
                src={selectedImage}
              />
            </div>
            <div className="product-modal-details">
              <br />
              <span className="text-subtle">{product.brand}</span>
              <h1 className="margin-top-0">{product.name}</h1>
              <span>{product.description}</span>
              <br />
              <br />
              <div className="divider" />
              <br />
<<<<<<< Updated upstream
              <div>
                <span className="text-subtle">Lens Width and Frame Size</span>
                <br />
                <br />
                <Select
                  placeholder="--Select Size--"
                  onChange={onSelectedSizeChange}
                  options={product.sizes.sort((a, b) => (a < b ? -1 : 1)).map((size) => ({ label: `${size} mm`, value: size }))}
                  styles={{ menu: (provided) => ({ ...provided, zIndex: 10 }) }}
                />
              </div>
              <br />
              {product.availableColors.length >= 1 && (
                <div>
                  <span className="text-subtle">Choose Color</span>
                  <br />
                  <br />
                  <ColorChooser
                    availableColors={product.availableColors}
                    onSelectedColorChange={onSelectedColorChange}
                  />
=======

              {/* Seller */}
              {product.sellerName && (
                <div style={{ marginBottom: '8px' }}>
                  <span className="text-subtle">Người bán: </span>
                  <strong>{product.sellerName}</strong>
                </div>
              )}

              {/* Rating */}
              {product.rating > 0 && (
                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {renderStars(product.rating)}
                  <span className="text-subtle">
                    {product.rating.toFixed(1)} ({product.reviews} đánh giá)
                  </span>
                </div>
              )}

              {/* Stock */}
              {!product.isAuction && (
                <div style={{ marginBottom: '8px' }}>
                  <span className="text-subtle">Tình trạng: </span>
                  <strong style={{ color: product.inStock ? '#27ae60' : '#e74c3c' }}>
                    {product.inStock ? `Còn ${product.totalStock} sản phẩm` : 'Hết hàng'}
                  </strong>
                </div>
              )}

              {/* Auction Section */}
              {product.isAuction ? (
                <div className="product-auction-section">
                  <div className="auction-status-header">
                    <div>
                      <span className="ebay-label">Condition:</span>
                      <span className="ebay-value">{auctionDetail?.condition || 'Used'}</span>
                    </div>
                    <div className="countdown-wrapper">
                      <span className="ebay-label" style={{ width: 'auto' }}>Time left:</span>
                      <CountdownTimer
                        endTime={product.auctionEndTime}
                        onEnd={() => setIsAuctionEnded(true)}
                      />
                    </div>
                  </div>

                  <div className="ebay-auction-info">
                    <div className="info-row">
                      <span className="label">
                        {isAuctionEnded ? 'Giá bán hiện tại:' : 'Current bid:'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <span className="value price-large">{displayMoney(currentBid)}</span>
                        {!isAuctionEnded && (
                          <span className="bid-link" onClick={() => setIsHistoryModalOpen(true)}>
                            [{bidCount} bids]
                          </span>
                        )}
                        {isAuctionEnded && bidCount > 0 && (
                          <span className="bid-link" onClick={() => setIsHistoryModalOpen(true)}>
                            [{bidCount} lượt đấu]
                          </span>
                        )}
                      </div>
                    </div>
                    {auctionDetail?.bidderCount > 0 && (
                      <div className="info-row participants-row">
                        <span className="ebay-label">Participants:</span>
                        <span className="ebay-value">{auctionDetail.bidderCount} bidders</span>
                      </div>
                    )}
                  </div>

                  {!isAuctionEnded ? (
                    <div className="inline-bid-group">
                      <div className="bid-input-wrapper">
                        <input
                          className="bid-input"
                          type="number"
                          value={bidAmount}
                          step="5000"
                          min={currentBid + 5000}
                          onChange={(e) => setBidAmount(parseInt(e.target.value, 10))}
                          placeholder="Bid Amount"
                          disabled={isSubmittingBid}
                        />
                        <span className="bid-hint">Enter {displayMoney(currentBid + 5000)} or more</span>
                      </div>
                      <div className="bid-buttons">
                        <button
                          className="place-bid-btn"
                          onClick={handleOpenConfirm}
                          disabled={isSubmittingBid}
                        >
                          Place bid
                        </button>
                        <button className="watchlist-btn">
                          <span>♡ Add to Watchlist</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="auction-ended-purchase-section">
                      <div className="auction-ended-status">
                        <span className="status-label">Phiên đấu giá đã kết thúc</span>
                      </div>

                      <div className="purchase-buttons-group">
                        <button
                          className="buy-it-now-btn"
                          onClick={() => {
                            if (!isItemOnBasket(product.id)) {
                              addToBasket({ ...product, price: currentBid });
                            }
                            history.push('/checkout');
                          }}
                        >
                          Buy It Now
                        </button>
                        <button
                          className={`add-to-cart-btn ${isItemOnBasket(product.id) ? 'active' : ''}`}
                          onClick={() => addToBasket({ ...product, price: currentBid })}
                        >
                          {isItemOnBasket(product.id) ? 'Remove from cart' : 'Add to cart'}
                        </button>
                        <button className="watch-btn-large">
                          Watch
                        </button>
                      </div>

                      {bidCount > 0 && (
                        <div className="final-price-note">
                          Giao dịch sẽ được thực hiện với mức giá cuối cùng là <strong>{displayMoney(currentBid)}</strong>.
                        </div>
                      )}
                    </div>
                  )}
>>>>>>> Stashed changes
                </div>
              ) : (
                <>
                  {/* Price for regular items */}
                  <h1>
                    {displayMoney(product.price)}
                    {product.originalPrice > product.price && (
                      <span
                        style={{
                          fontSize: '16px',
                          marginLeft: '12px',
                          color: '#999',
                          textDecoration: 'line-through'
                        }}
                      >
                        {displayMoney(product.originalPrice)}
                      </span>
                    )}
                  </h1>

                  {/* Regular Actions */}
                  <div className="product-modal-action">
                    <button
                      className={`button button-small ${isItemOnBasket(product.id) ? 'button-border button-border-gray' : ''}`}
                      onClick={handleAddToBasket}
                      type="button"
                      disabled={!product.inStock}
                    >
                      {isItemOnBasket(product.id) ? 'Xóa khỏi giỏ hàng' : 'Thêm vào giỏ hàng'}
                    </button>
                    <button
                      className="button button-small button-muted margin-left-s"
                      onClick={() => setShowChat(true)}
                      type="button"
                    >
                      Liên hệ người bán
                    </button>
                  </div>
                </>
              )}
<<<<<<< Updated upstream
              <h1>{displayMoney(product.price)}</h1>
              <div className="product-modal-action">
                <button
                  className={`button button-small ${isItemOnBasket(product.id) ? 'button-border button-border-gray' : ''}`}
                  onClick={handleAddToBasket}
                  type="button"
                >
                  {isItemOnBasket(product.id) ? 'Remove From Basket' : 'Add To Basket'}
                </button>
                <button
                  className="button button-small button-muted margin-left-s"
                  onClick={() => setShowChat(true)}
                  type="button"
                >
                  Contact Seller
                </button>
              </div>
=======
>>>>>>> Stashed changes
            </div>
            {showChat && (
              <ChatWidget
                shopName={product.brand || 'Shop'}
                onClose={() => setShowChat(false)}
              />
            )}
          </div>
<<<<<<< Updated upstream
=======

          {/* Modal Xác nhận đấu giá */}
          {isConfirmModalOpen && (
            <div className="auction-modal-overlay" onClick={() => setIsConfirmModalOpen(false)}>
              <div className="auction-modal confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header no-border">
                  <div className="confirm-header-info">
                    <span className="confirm-price">{displayMoney(currentBid)}</span>
                    <span className="confirm-meta">{bidCount} Bids</span>
                  </div>
                  <CloseOutlined className="close-btn" onClick={() => setIsConfirmModalOpen(false)} />
                </div>
                <div className="confirm-content">
                  <div className="confirm-row">
                    <span className="label">Your bid amount:</span>
                    <span className="value">{displayMoney(bidAmount)}</span>
                    <button
                      className="confirm-btn"
                      onClick={() => handlePlaceBid()}
                      disabled={isSubmittingBid}
                    >
                      {isSubmittingBid ? 'Processing...' : 'Confirm'}
                    </button>
                  </div>
                  <p className="confirm-disclaimer">
                    When you confirm your bid, it means you're committing to buy this item if you're the winning bidder.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Modal Đặt giá lại (khi bị outbid hoặc muốn tăng giá) */}
          {isBidModalOpen && (
            <div className="auction-modal-overlay" onClick={() => setIsBidModalOpen(false)}>
              <div className="auction-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div className="modal-title-group">
                    <span className="modal-price">{displayMoney(currentBid)}</span>
                    <span className="modal-meta">{bidCount} Bids</span>
                  </div>
                  <CloseOutlined className="close-btn" onClick={() => setIsBidModalOpen(false)} />
                </div>
                <div className="modal-content">
                  {showOutbidAlert && (
                    <div className="outbid-alert">
                      <span className="alert-icon">!</span>
                      <div className="alert-text">
                        <strong>You've been outbid by someone else's max bid.</strong>
                        <p>You can still win! Try bidding again.</p>
                      </div>
                    </div>
                  )}

                  <h3 className="place-bid-title">Place your bid</h3>
                  <p className="place-bid-desc">
                    Consider bidding the highest amount you're willing to pay. We'll bid for you, just enough to keep you in the lead.
                  </p>

                  <div className="quick-bid-grid">
                    {[5000, 10000, 25000].map((inc) => (
                      <button
                        key={inc}
                        className="quick-bid-btn"
                        onClick={() => handlePlaceBid(currentBid + inc)}
                      >
                        Bid {displayMoney(currentBid + inc)}
                      </button>
                    ))}
                  </div>

                  <div className="divider-or">OR</div>

                  <div className="inline-bid-form">
                    <div className="input-with-symbol">
                      <span className="symbol">VNĐ</span>
                      <input
                        type="number"
                        value={bidAmount}
                        step="5000"
                        min={currentBid + 5000}
                        onChange={(e) => setBidAmount(parseInt(e.target.value, 10))}
                        disabled={isSubmittingBid}
                      />
                    </div>
                    <button
                      className="bid-submit-btn"
                      onClick={() => handlePlaceBid()}
                      disabled={isSubmittingBid}
                    >
                      Bid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Reviews */}
          <ProductReviews productId={product.id} />

          {/* Recommended products */}
>>>>>>> Stashed changes
          <div style={{ marginTop: '10rem' }}>
            <div className="display-header">
              <h1>Recommended</h1>
              <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
            </div>
            {errorFeatured && !isLoadingFeatured ? (
              <MessageDisplay
                message={error}
                action={fetchRecommendedProducts}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid products={recommendedProducts} skeletonCount={3} />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default ViewProduct;
