import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { Field, Form, Formik } from 'formik';
import PropType from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { checkCanReview, createReview, getReviewsByProduct } from '@/api/endpoints/review';
import { displayDate } from '@/helpers/utils';

const ReviewSchema = Yup.object().shape({
    rating: Yup.number()
        .min(1, 'Vui lòng chọn từ 1 đến 5 sao.')
        .max(5, 'Vui lòng chọn từ 1 đến 5 sao.')
        .required('Đánh giá sao là bắt buộc.'),
    comment: Yup.string()
        .max(2000, 'Bình luận không được vượt quá 2000 ký tự.')
        .required('Vui lòng nhập bình luận.')
});

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [canReview, setCanReview] = useState(false);

    // Get user from Redux to check if logged in
    const { auth } = useSelector((state) => state);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const data = await getReviewsByProduct(productId);
            setReviews(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    useEffect(() => {
        const verifyCanReview = async () => {
            if (auth && auth.id && productId) {
                try {
                    const res = await checkCanReview(productId);
                    // res.data will be a boolean based on the ApiResponse<bool>
                    setCanReview(!!res.data);
                } catch (error) {
                    setCanReview(false);
                }
            } else {
                setCanReview(false);
            }
        };
        verifyCanReview();
    }, [auth, productId]);

    const onSubmitReview = async (values, { resetForm }) => {
        if (!auth || !auth.id) {
            setErrorMsg('Vui lòng đăng nhập để gửi đánh giá.');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');
        try {
            await createReview({
                productId,
                rating: Number(values.rating),
                comment: values.comment
            });
            // Refresh list
            await fetchReviews();
            resetForm();
            // user can no longer leave another review; hide form immediately
            setCanReview(false);
        } catch (err) {
            setErrorMsg(err?.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i += 1) {
            stars.push(
                <span key={i} style={{ color: i <= rating ? '#f39c12' : '#ccc', fontSize: '18px' }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="product-reviews" style={{ marginTop: '40px', padding: '20px', background: '#fff', borderRadius: '8px' }}>
            <h2>Đánh giá sản phẩm ({reviews.length})</h2>

            {isLoading ? (
                <p>Đang tải đánh giá...</p>
            ) : reviews.length === 0 ? (
                <p className="text-subtle">Chưa có đánh giá nào cho sản phẩm này.</p>
            ) : (
                <div className="reviews-list" style={{ marginBottom: '30px' }}>
                    {reviews.map((rev) => (
                        <div key={rev.id} className="review-item" style={{ borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <strong>{rev.reviewerName || 'Người dùng ẩn danh'}</strong>
                                <span className="text-subtle" style={{ fontSize: '12px' }}>
                                    {rev.createdAt ? displayDate(rev.createdAt) : ''}
                                </span>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                                {renderStars(rev.rating)}
                            </div>
                            <p style={{ margin: 0 }}>{rev.comment}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Review Form */}
            {auth && auth.id && canReview && (
                <div className="review-form-container" style={{ marginTop: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
                    <h3>Viết đánh giá của bạn</h3>

                    <Formik
                        initialValues={{ rating: 5, comment: '' }}
                        validationSchema={ReviewSchema}
                        onSubmit={onSubmitReview}
                    >
                        {({ values, errors, touched, setFieldValue }) => (
                            <Form>
                                {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="rating" style={{ display: 'block', marginBottom: '8px' }}>Đánh giá (1-5 sao):</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                onClick={() => setFieldValue('rating', star)}
                                                style={{
                                                    cursor: 'pointer',
                                                    fontSize: '24px',
                                                    color: star <= values.rating ? '#f39c12' : '#ccc'
                                                }}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    {errors.rating && touched.rating && (
                                        <span style={{ color: 'red', fontSize: '12px' }}>{errors.rating}</span>
                                    )}
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="comment" style={{ display: 'block', marginBottom: '8px' }}>Nhận xét của bạn:</label>
                                    <Field
                                        as="textarea"
                                        id="comment"
                                        name="comment"
                                        style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                        placeholder="Sản phẩm này tuyệt vời..."
                                    />
                                    {errors.comment && touched.comment && (
                                        <span style={{ color: 'red', fontSize: '12px' }}>{errors.comment}</span>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="button button-small"
                                    style={{ background: '#1a1a1a', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px' }}
                                >
                                    {isSubmitting ? <LoadingOutlined /> : <CheckOutlined />}
                                    &nbsp; {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
        </div>
    );
};

ProductReviews.propTypes = {
    productId: PropType.oneOfType([PropType.string, PropType.number]).isRequired
};

export default ProductReviews;
