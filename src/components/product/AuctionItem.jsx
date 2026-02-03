import { EyeOutlined } from '@ant-design/icons';
import { ImageLoader } from '@/components/common';
import { displayMoney } from '@/helpers/utils';
import PropType from 'prop-types';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';

const AuctionItem = ({ product }) => {
  const history = useHistory();

  const onClickItem = () => {
    if (!product) return;
    history.push(`/auction/${product.id}`);
  };

  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div
        className={`product-card ${!product.id ? 'product-loading' : ''}`}
        style={{
          border: '1px solid #e1e1e1',
          boxShadow: 'none'
        }}
      >
        <div
          className="product-card-content"
          onClick={onClickItem}
          role="presentation"
        >
          <div className="product-card-img-wrapper">
            {product.image ? (
              <ImageLoader
                alt={product.name}
                className="product-card-img"
                src={product.image}
              />
            ) : <Skeleton width="100%" height="90%" />}
          </div>
          <div className="product-details">
            <h5 className="product-card-name text-overflow-ellipsis margin-auto">
              {product.name || <Skeleton width={80} />}
            </h5>
            <p className="product-card-brand">
              {product.brand || <Skeleton width={60} />}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
              <span style={{ marginRight: '5px' }}>Current Bid:</span>
              <h4 className="product-card-price" style={{ color: 'red' }}>
                {product.price ? displayMoney(product.price) : <Skeleton width={40} />}
              </h4>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
              Ends in: <span style={{ color: '#ff4d4f' }}>04:41:59</span>
            </div>
          </div>
        </div>
        <button
          className="product-card-button button-small button button-block"
          onClick={onClickItem}
          type="button"
          style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
        >
          Bid Now
        </button>
      </div>
    </SkeletonTheme>
  );
};

AuctionItem.propTypes = {
  product: PropType.object.isRequired
};

export default AuctionItem;
