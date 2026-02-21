import { ArrowLeftOutlined, LoadingOutlined, StarFilled } from '@ant-design/icons';
import { ImageLoader, MessageDisplay, ChatWidget } from '@/components/common';
import { ProductShowcaseGrid, ProductReviews } from '@/components/product';
import { RECOMMENDED_PRODUCTS, SHOP } from '@/constants/routes';
import { displayMoney } from '@/helpers/utils';
import {
  useBasket,
  useDocumentTitle,
  useProduct,
  useRecommendedProducts,
  useScrollTop
} from '@/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const ViewProduct = () => {
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket, isItemOnBasket } = useBasket(id);
  useScrollTop();
  useDocumentTitle(`Xem sản phẩm: ${product?.name || '...'}`);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured
  } = useRecommendedProducts(6);

  useEffect(() => {
    setSelectedImage(product?.image || null);
  }, [product]);

  const handleAddToBasket = () => {
    addToBasket({ ...product });
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
    }
    return stars;
  };

  return (
    <main className="content">
      {isLoading && (
        <div className="loader">
          <h4>Đang tải sản phẩm...</h4>
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
              &nbsp; Quay lại cửa hàng
            </h3>
          </Link>
          <div className="product-modal">
            {/* Image collection sidebar */}
            {product.imageCollection && product.imageCollection.length > 0 && (
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

            {/* Main image */}
            <div className="product-modal-image-wrapper">
              {selectedImage ? (
                <ImageLoader
                  alt={product.name}
                  className="product-modal-image"
                  src={selectedImage}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '300px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    color: '#999',
                    fontSize: '14px'
                  }}
                >
                  Chưa có ảnh sản phẩm
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="product-modal-details">
              <br />
              {/* Category */}
              {product.categoryName && (
                <span className="text-subtle">{product.categoryName}</span>
              )}
              <h1 className="margin-top-0">{product.name}</h1>

              {/* Description */}
              {product.description && (
                <span>{product.description}</span>
              )}

              <br />
              <br />
              <div className="divider" />
              <br />

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
              <div style={{ marginBottom: '8px' }}>
                <span className="text-subtle">Tình trạng: </span>
                <strong style={{ color: product.inStock ? '#27ae60' : '#e74c3c' }}>
                  {product.inStock ? `Còn ${product.totalStock} sản phẩm` : 'Hết hàng'}
                </strong>
              </div>

              {/* Auction badge */}
              {product.isAuction && (
                <div style={{
                  display: 'inline-block',
                  background: '#e74c3c',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginBottom: '12px'
                }}
                >
                  🔨 Đấu giá
                  {product.auctionEndTime && (
                    <span> &nbsp;— Kết thúc: {new Date(product.auctionEndTime).toLocaleString('vi-VN')}</span>
                  )}
                </div>
              )}

              {/* Variants table */}
              {product.variants && product.variants.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <span className="text-subtle">Biến thể sản phẩm:</span>
                  <br /><br />
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5' }}>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #eee' }}>SKU</th>
                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #eee' }}>Giá</th>
                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #eee' }}>Tồn kho</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map((v) => (
                        <tr key={v.id}>
                          <td style={{ padding: '8px', border: '1px solid #eee' }}>{v.sku || '--'}</td>
                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #eee' }}>
                            {v.price ? displayMoney(v.price) : '--'}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #eee' }}>
                            {v.stockQuantity ?? '--'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Price */}
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

              {/* Actions */}
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
            </div>

            {showChat && (
              <ChatWidget
                shopName={product.sellerName || 'Shop'}
                onClose={() => setShowChat(false)}
              />
            )}
          </div>

          {/* Product Reviews */}
          <ProductReviews productId={product.id} />

          {/* Recommended products */}
          <div style={{ marginTop: '10rem' }}>
            <div className="display-header">
              <h1>Sản phẩm gợi ý</h1>
              <Link to={RECOMMENDED_PRODUCTS}>Xem tất cả</Link>
            </div>
            {errorFeatured && !isLoadingFeatured ? (
              <MessageDisplay
                message={errorFeatured}
                action={fetchRecommendedProducts}
                buttonLabel="Thử lại"
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
