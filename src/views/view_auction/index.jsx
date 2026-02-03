import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { ImageLoader, MessageDisplay, ChatWidget } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { RECOMMENDED_PRODUCTS, SHOP } from '@/constants/routes';
import { displayMoney } from '@/helpers/utils';
import {
  useDocumentTitle,
  useRecommendedProducts,
  useScrollTop
} from '@/hooks';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const ViewAuction = () => {
  const { id } = useParams();
  const history = useHistory();
  // Mock product data for auction
  const product = {
    id: id,
    name: 'Gọng Kính Designer Limited Edition',
    brand: 'Salinaka Premium',
    price: 2300000, // Starting price
    currentBid: 2300000,
    image: 'https://firebasestorage.googleapis.com/v0/b/salinaka-ecommerce.appspot.com/o/products%2F7l3Z50PEBWnYUAlTPwnk?alt=media&token=52424724-1f63-4470-988a-0a4e764a8543',
    description: 'luxury_optical. 5 (890 đánh giá). 100% phản hồi tích cực. Gọng kính designer cao cấp phiên bản giới hạn. Thiết kế sang trọng, chất liệu titanium siêu nhẹ.',
    availableColors: ['#000000', '#C0C0C0'],
    imageCollection: [
      { id: 1, url: 'https://firebasestorage.googleapis.com/v0/b/salinaka-ecommerce.appspot.com/o/products%2F7l3Z50PEBWnYUAlTPwnk?alt=media&token=52424724-1f63-4470-988a-0a4e764a8543' },
      { id: 2, url: 'https://firebasestorage.googleapis.com/v0/b/salinaka-ecommerce.appspot.com/o/products%2FYZ7LM3HZVjqPpPyfJeS6?alt=media&token=a02b66d6-e243-424a-aa7e-2e652a255979' }
    ],
    bids: 18,
    timeLeft: '4h 41m 59s'
  };

  useScrollTop();
  useDocumentTitle(`Auction | ${product?.name || 'Item'}`);

  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [bidAmount, setBidAmount] = useState(product.currentBid + 50000);
  const [showChat, setShowChat] = useState(false);

  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured
  } = useRecommendedProducts(6);

  useEffect(() => {
    setSelectedImage(product?.image);
  }, [product]);


  return (
    <main className="content">
      {(product) && (
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
              <ImageLoader
                alt={product.name}
                className="product-modal-image"
                src={selectedImage}
              />
            </div>
            <div className="product-modal-details">
              <br />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h1 className="margin-top-0">{product.name}</h1>
                  <span className="text-subtle">{product.brand}</span>
                </div>
              </div>

              <div style={{ marginTop: '10px', color: 'green' }}>
                <span>● Mới nguyên seal | {product.bids} lượt đấu giá</span>
              </div>

              <br />
              <div className="divider" />
              <br />

              <div>
                <span className="text-subtle">Giá hiện tại</span>
                <h1 style={{ color: 'red', fontSize: '3rem' }}>{displayMoney(product.currentBid)}</h1>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ fontSize: '1.2rem', color: '#666' }}>🕒 Kết thúc sau: </span>
                  <span style={{ fontSize: '1.2rem', color: 'red', fontWeight: 'bold', marginLeft: '5px' }}>{product.timeLeft}</span>
                </div>
                <br />
                <a href="/" onClick={(e) => e.preventDefault()}>[{product.bids} lượt đấu giá] Xem lịch sử</a>
              </div>

              <br />
              <div className="divider" />
              <br />

              <div style={{ border: '1px solid #e1e1e1', padding: '20px', borderRadius: '8px' }}>
                <p>Đặt giá của bạn:</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    className="input-form control-input-form"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e1e1e1', padding: '0 15px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>VND</div>
                </div>
                <button className="button button-block" style={{ marginTop: '15px', backgroundColor: '#0055ff' }} type="button">
                  Đặt giá
                </button>
                <br />
                <p>Hoặc mua ngay với giá: <strong>{displayMoney(3200000)}</strong></p>
                <button className="button button-block" style={{ backgroundColor: '#ff5500' }} type="button">
                  Mua ngay
                </button>
              </div>

              <br />
              <div className="divider" />
              <br />

              <h3>Thông tin người bán</h3>
              <p style={{ color: '#0055ff' }}>luxury_optical</p>
              <p>⭐ 5 (890 đánh giá)</p>
              <p style={{ color: 'green' }}>100% phản hồi tích cực</p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  className="button button-small button-border"
                  type="button"
                  onClick={() => setShowChat(true)}
                >
                  Liên hệ người bán
                </button>
                <button className="button button-small button-border" type="button">Xem shop</button>
              </div>

              {showChat && (
                <ChatWidget
                  shopName={product.brand || 'Shop'}
                  onClose={() => setShowChat(false)}
                />
              )}

            </div>
          </div>

          <div style={{ marginTop: '5rem', display: 'flex', gap: '50px' }}>
            <div style={{ flex: 2 }}>
              <h3>Mô tả sản phẩm</h3>
              <p>{product.description}</p>

              <br />
              <h3>Thông số kỹ thuật:</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }} className="text-subtle">Thương hiệu:</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>SALINAKA Premium</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }} className="text-subtle">Xuất xứ:</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>France</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }} className="text-subtle">Chất liệu:</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Titanium</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ flex: 1, border: '1px solid #eee', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
              <h3>Lịch sử đấu giá</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  <span>u***8</span>
                  <span>{displayMoney(2300000)}</span>
                  <span className="text-subtle">2 phút trước</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  <span>v***2</span>
                  <span>{displayMoney(2250000)}</span>
                  <span className="text-subtle">15 phút trước</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  <span>k***5</span>
                  <span>{displayMoney(2200000)}</span>
                  <span className="text-subtle">1 giờ trước</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '10rem' }}>
            <div className="display-header">
              <h1>Sản phẩm tương tự</h1>
              <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
            </div>
            {errorFeatured && !isLoadingFeatured ? (
              <MessageDisplay
                message={errorFeatured}
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

export default ViewAuction;
