/* eslint-disable jsx-a11y/label-has-associated-control */
import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import {
  Field, Form, Formik
} from 'formik';
import PropType from 'prop-types';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { getCategories } from '@/api/endpoints/category';

const FormSchema = Yup.object().shape({
  title: Yup.string()
    .required('Tên sản phẩm là bắt buộc.')
    .max(200, 'Tên sản phẩm không được vượt quá 200 ký tự.'),
  description: Yup.string()
    .max(2000, 'Mô tả không được vượt quá 2000 ký tự.'),
  categoryId: Yup.number()
    .typeError('Category ID phải là số.')
    .positive('Category ID không hợp lệ.')
    .integer('Category ID phải là số nguyên.')
    .required('Category ID là bắt buộc.'),
  isAuction: Yup.boolean(),
  auctionEndTime: Yup.string().nullable()
    .when('isAuction', {
      is: true,
      then: (schema) => schema.required('Auction end time là bắt buộc khi IsAuction được chọn.')
    })
});

const ProductForm = ({ product, onSubmit, isLoading }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const initFormikValues = {
    title: product?.title || product?.name || '',
    description: product?.description || '',
    categoryId: product?.categoryId || '',
    isAuction: product?.isAuction || false,
    auctionEndTime: product?.auctionEndTime
      ? new Date(product.auctionEndTime).toISOString().slice(0, 16)
      : ''
  };

  const onSubmitForm = (form) => {
    onSubmit({
      ...form,
      categoryId: Number(form.categoryId),
      auctionEndTime: form.auctionEndTime ? new Date(form.auctionEndTime).toISOString() : null
    });
  };

  return (
    <div>
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        onSubmit={onSubmitForm}
        enableReinitialize
      >
        {({ values, setValues, errors, touched }) => (
          <Form className="product-form">
            <div className="product-form-inputs">

              {/* Title */}
              <div className="product-form-field">
                <label className="label" htmlFor="title">
                  * Tên sản phẩm (Title)
                </label>
                <Field
                  disabled={isLoading}
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Nhập tên sản phẩm"
                  className={`input-form d-block ${errors.title && touched.title ? 'input-error' : ''}`}
                />
                {errors.title && touched.title && (
                  <span className="input-message">{errors.title}</span>
                )}
              </div>

              {/* Description */}
              <div className="product-form-field">
                <label className="label" htmlFor="description">
                  Mô tả sản phẩm
                </label>
                <Field
                  as="textarea"
                  disabled={isLoading}
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Nhập mô tả sản phẩm..."
                  className={`input-form d-block ${errors.description && touched.description ? 'input-error' : ''}`}
                />
                {errors.description && touched.description && (
                  <span className="input-message">{errors.description}</span>
                )}
              </div>

              {/* Category ID */}
              <div className="product-form-field">
                <label className="label" htmlFor="categoryId">
                  * Category
                </label>
                <Field
                  as="select"
                  disabled={isLoading || categories.length === 0}
                  id="categoryId"
                  name="categoryId"
                  className={`input-form d-block ${errors.categoryId && touched.categoryId ? 'input-error' : ''}`}
                >
                  <option value="" disabled hidden>-- Chọn Danh Mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Field>
                {errors.categoryId && touched.categoryId && (
                  <span className="input-message">{errors.categoryId}</span>
                )}
              </div>

              {/* IsAuction checkbox */}
              <div className="product-form-field">
                <input
                  checked={values.isAuction}
                  id="isAuction"
                  type="checkbox"
                  onChange={(e) => setValues({ ...values, isAuction: e.target.checked, auctionEndTime: '' })}
                />
                <label htmlFor="isAuction">
                  <h5 className="d-flex-grow-1 margin-0">
                    &nbsp; Đây là sản phẩm đấu giá (Auction)
                  </h5>
                </label>
              </div>

              {/* Auction End Time – only show when isAuction */}
              {values.isAuction && (
                <div className="product-form-field">
                  <label className="label" htmlFor="auctionEndTime">
                    * Thời gian kết thúc đấu giá
                  </label>
                  <Field
                    disabled={isLoading}
                    id="auctionEndTime"
                    name="auctionEndTime"
                    type="datetime-local"
                    className={`input-form d-block ${errors.auctionEndTime && touched.auctionEndTime ? 'input-error' : ''}`}
                  />
                  {errors.auctionEndTime && touched.auctionEndTime && (
                    <span className="input-message">{errors.auctionEndTime}</span>
                  )}
                </div>
              )}

              <br />
              <div className="product-form-field product-form-submit">
                <button
                  className="button"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? <LoadingOutlined /> : <CheckOutlined />}
                  &nbsp;
                  {isLoading ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

ProductForm.defaultProps = {
  isLoading: false
};

ProductForm.propTypes = {
  product: PropType.shape({
    title: PropType.string,
    name: PropType.string,
    description: PropType.string,
    categoryId: PropType.number,
    isAuction: PropType.bool,
    auctionEndTime: PropType.string
  }).isRequired,
  onSubmit: PropType.func.isRequired,
  isLoading: PropType.bool
};

export default ProductForm;
