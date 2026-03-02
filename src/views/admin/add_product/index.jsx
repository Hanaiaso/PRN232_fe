import { LoadingOutlined } from '@ant-design/icons';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React, { Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { addProduct } from '@/redux/actions/productActions';

const ProductForm = lazy(() => import('../components/ProductForm'));

const AddProduct = () => {
  useScrollTop();
  useDocumentTitle('Thêm sản phẩm mới | Salinaka');
  const isLoading = useSelector((state) => state.app.loading);
  const dispatch = useDispatch();

  const onSubmit = (product) => {
    dispatch(addProduct(product));
  };

  return (
    <div className="product-form-container">
      <h2>Thêm sản phẩm mới</h2>
      <Suspense fallback={(
        <div className="loader" style={{ minHeight: '80vh' }}>
          <h6>Đang tải... </h6>
          <br />
          <LoadingOutlined />
        </div>
      )}
      >
        <ProductForm
          isLoading={isLoading}
          onSubmit={onSubmit}
          product={{
            title: '',
            description: '',
            categoryId: '',
            isAuction: false,
            auctionEndTime: null
          }}
        />
      </Suspense>
    </div>
  );
};

export default withRouter(AddProduct);
