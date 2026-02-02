import { CloseOutlined } from '@ant-design/icons';
import { BasketItemControl } from '@/components/basket';
import { ImageLoader } from '@/components/common';
import { displayMoney } from '@/helpers/utils';
import PropType from 'prop-types';
import React from 'react';
import { useBasket } from '@/hooks';
import { Link } from 'react-router-dom';

const BasketItem = ({ product, isSelected, onToggleSelection }) => {
  const { removeFromBasket } = useBasket();
  const onRemoveFromBasket = () => removeFromBasket(product.cartItemId);

  return (
    <div className="basket-item">
      {onToggleSelection && (
        <div className="basket-item-selector" style={{ marginRight: '15px', display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={onToggleSelection}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>
      )}
      <BasketItemControl product={product} />
      <div className="basket-item-wrapper">
        <div className="basket-item-img-wrapper">
          <ImageLoader
            alt={product.name}
            className="basket-item-img"
            src={product.image}
          />
        </div>
        <div className="basket-item-details">
          <Link to={`/product/${product.id}`} onClick={() => document.body.classList.remove('is-basket-open')}>
            <h4 className="underline basket-item-name">
              {product.name}
            </h4>
          </Link>
          <div className="basket-item-specs">
            <div>
              <span className="spec-title">Quantity</span>
              <h5 className="my-0">{product.quantity}</h5>
            </div>
            {product.selectedSize && (
              <div>
                <span className="spec-title">Size</span>
                <h5 className="my-0">
                  {product.selectedSize}
                  {' '}
                  mm
                </h5>
              </div>
            )}
            {product.selectedColor && (
              <div>
                <span className="spec-title">Color</span>
                <div style={{
                  backgroundColor: product.selectedColor || product.availableColors?.[0] || '#000',
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%'
                }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="basket-item-price">
          <h4 className="my-0">{displayMoney(product.price * product.quantity)}</h4>
        </div>
        <button
          className="basket-item-remove button button-border button-border-gray button-small"
          onClick={onRemoveFromBasket}
          type="button"
        >
          <CloseOutlined />
        </button>
      </div>
    </div>
  );
};

BasketItem.propTypes = {
  product: PropType.shape({
    id: PropType.oneOfType([PropType.string, PropType.number]),
    name: PropType.string,
    brand: PropType.string,
    price: PropType.number,
    quantity: PropType.number,
    maxQuantity: PropType.number,
    description: PropType.string,
    keywords: PropType.arrayOf(PropType.string),
    selectedSize: PropType.string,
    selectedColor: PropType.string,
    imageCollection: PropType.arrayOf(PropType.string),
    sizes: PropType.arrayOf(PropType.number),
    image: PropType.string,
    imageUrl: PropType.string,
    isFeatured: PropType.bool,
    isRecommended: PropType.bool,
    availableColors: PropType.arrayOf(PropType.string)
  }).isRequired,
  isSelected: PropType.bool,
  onToggleSelection: PropType.func
};

export default BasketItem;
