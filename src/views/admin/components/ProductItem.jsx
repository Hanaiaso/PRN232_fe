import { ImageLoader } from '@/components/common';
import { EDIT_PRODUCT } from '@/constants/routes';
import { displayActionMessage, displayMoney } from '@/helpers/utils';
import PropType from 'prop-types';
import React, { useRef } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useDispatch } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { removeProduct } from '@/redux/actions/productActions';

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const productRef = useRef(null);

  const onClickEdit = () => {
    history.push(`${EDIT_PRODUCT}/${product.id}`);
  };

  const onDeleteProduct = () => {
    productRef.current.classList.toggle('item-active');
  };

  const onConfirmDelete = () => {
    dispatch(removeProduct(product.id));
    displayActionMessage('Item successfully deleted');
    productRef.current.classList.remove('item-active');
  };

  const onCancelDelete = () => {
    productRef.current.classList.remove('item-active');
  };

  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div
        className={`item item-products ${!product.id && 'item-loading'}`}
        ref={productRef}
      >
        <div className="grid grid-count-6">
          <div className="grid-col item-img-wrapper">
            {product.image ? (
              <ImageLoader
                alt={product.name}
                className="item-img"
                src={product.image}
              />
            ) : <Skeleton width={50} height={30} />}
          </div>
          <div className="grid-col">
            <span className="text-overflow-ellipsis">{product.name || <Skeleton width={50} />}</span>
          </div>
          <div className="grid-col">
            <span>{product.categoryName || <Skeleton width={50} />}</span>
          </div>
          <div className="grid-col">
            <span>{product.price ? displayMoney(product.price) : <Skeleton width={30} />}</span>
          </div>
          <div className="grid-col">
            <span>{product.totalStock !== undefined ? product.totalStock : <Skeleton width={20} />}</span>
          </div>
          <div className="grid-col">
            <span>{product.sellerName || <Skeleton width={50} />}</span>
          </div>
        </div>
        {product.id && (
          <div className="item-action">
            <button
              className="button button-border button-small"
              onClick={onClickEdit}
              type="button"
            >
              Edit
            </button>
            &nbsp;
            <button
              className="button button-border button-small button-danger"
              onClick={onDeleteProduct}
              type="button"
            >
              Delete
            </button>
            <div className="item-action-confirm">
              <h5>Bạn có chắc chắn muốn xóa sản phẩm này?</h5>
              <button
                className="button button-small button-border"
                onClick={onCancelDelete}
                type="button"
              >
                Không
              </button>
              &nbsp;
              <button
                className="button button-small button-danger"
                onClick={onConfirmDelete}
                type="button"
              >
                Xóa
              </button>
            </div>
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
};

ProductItem.propTypes = {
  product: PropType.shape({
    id: PropType.oneOfType([PropType.string, PropType.number]),
    name: PropType.string,
    image: PropType.string,
    categoryName: PropType.string,
    price: PropType.number,
    totalStock: PropType.number,
    sellerName: PropType.string
  }).isRequired
};

export default withRouter(ProductItem);
