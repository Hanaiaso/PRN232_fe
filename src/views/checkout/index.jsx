/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import { ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Boundary } from '@/components/common';
import { Form, Formik, Field } from 'formik';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import PropType from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import withCheckout from './hoc/withCheckout';
import ShippingForm from './step2/ShippingForm';
import { CustomInput } from '@/components/formik';
import { displayMoney, displayActionMessage } from '@/helpers/utils';
import { cartService } from '@/services/cartService';
import { userService } from '@/services/userService';

const FormSchema = Yup.object().shape({
    addressId: Yup.string()
        .required('Please select a shipping address'),
    type: Yup.string().required('Please select payment mode')
});

const Checkout = ({ profile, shipping, payment, subtotal, basket, ...props }) => {
    useDocumentTitle('Check Out | Salinaka');
    useScrollTop();
    const dispatch = useDispatch();
    const history = useHistory();
    const [discountCode, setDiscountCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const fetchAddresses = async () => {
            const fetchedAddresses = await userService.getAddresses();
            setAddresses(fetchedAddresses);
        };
        fetchAddresses();
    }, []);

    const initFormikValues = {
        addressId: '',
        type: payment?.type || 'paypal'
    };

    const validateCouponCode = async () => {
        if (!discountCode.trim()) {
            displayActionMessage('Please enter a discount code', 'error');
            return;
        }

        try {
            const coupon = await cartService.validateCoupon(discountCode, subtotal);
            setAppliedCoupon(coupon);
            displayActionMessage(`Mã giảm giá đã được áp dụng!`, 'success');
        } catch (error) {
            displayActionMessage(error.message || 'Mã giảm giá không hợp lệ', 'error');
            setAppliedCoupon(null);
        }
    };

    const onConfirm = async (form) => {
        try {
            const cartItemIds = basket.map(item => item.cartItemId);

            if (cartItemIds.length === 0) {
                displayActionMessage('No items selected', 'error');
                return;
            }

            if (!form.addressId) {
                displayActionMessage('Please select a shipping address', 'error');
                return;
            }

            const couponId = appliedCoupon ? appliedCoupon.id : null;
            const orderData = await cartService.placeOrder(cartItemIds, parseInt(form.addressId), couponId);

            if (!orderData || !orderData.orderId) {
                throw new Error('Order creation failed');
            }

            const paypalData = await cartService.createPayPalOrder(orderData.orderId);

            if (paypalData && paypalData.link) {
                window.sessionStorage.setItem('pending_order_id', orderData.orderId);
                window.location.href = paypalData.link;
            } else {
                throw new Error('Failed to generate PayPal link');
            }
        } catch (e) {
            displayActionMessage(e.message || 'Payment processing failed', 'error');
        }
    };

    let discountAmount = 0;
    if (appliedCoupon && appliedCoupon.discountPercent) {
        discountAmount = subtotal * (appliedCoupon.discountPercent / 100);
    }
    const finalTotal = subtotal - discountAmount;

    return (
        <Boundary>
            <div className="checkout" style={{ paddingBottom: '100px' }}>
                <div className="checkout-step-2">
                    <h2 className="text-center">Checkout</h2>
                    <Formik
                        initialValues={initFormikValues}
                        validateOnChange
                        validationSchema={FormSchema}
                        onSubmit={onConfirm}
                    >
                        {({ values, setValues, errors, touched }) => (
                            <Form>
                                <div className="checkout-content" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                                    {/* LEFT COLUMN: Shipping & Payment */}
                                    <div style={{ flex: '1 1 600px' }}>

                                        {/* ADDRESS SELECTION */}
                                        <div className="checkout-fieldset" style={{ border: '1px solid #e1e1e1', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
                                            <h3 style={{ marginTop: 0 }}>Select Shipping Address</h3>
                                            {addresses.length === 0 ? (
                                                <p>No addresses found. Please add one in your account settings.</p>
                                            ) : (
                                                <div className="checkout-field margin-0">
                                                    {addresses.map((addr) => (
                                                        <div key={addr.id} className="checkout-checkbox-field" style={{ marginBottom: '10px' }}>
                                                            <input
                                                                checked={values.addressId === String(addr.id)}
                                                                id={`address-${addr.id}`}
                                                                name="addressId"
                                                                onChange={(e) => {
                                                                    if (e.target.checked) setValues({ ...values, addressId: String(addr.id) });
                                                                }}
                                                                type="radio"
                                                            />
                                                            <label className="d-flex w-100" htmlFor={`address-${addr.id}`}>
                                                                <div className="d-flex-grow-1 margin-left-s">
                                                                    <strong className="margin-0">{addr.fullName}</strong>
                                                                    <div className="text-subtle d-block">
                                                                        {addr.phone} - {addr.street}, {addr.city}, {addr.state}, {addr.country}
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    ))}
                                                    {errors.addressId && touched.addressId && (
                                                        <div className="label-error" style={{ color: 'red', marginTop: '10px' }}>{errors.addressId}</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* PAYMENT FORM */}
                                        <div className="checkout-fieldset" style={{ border: '1px solid #e1e1e1', padding: '20px', borderRadius: '5px' }}>
                                            <h3 style={{ marginTop: 0 }}>Payment Method</h3>
                                            <div className={`checkout-fieldset-collapse ${values.type === 'paypal' ? 'is-selected-payment' : ''}`}>
                                                <div className="checkout-field margin-0">
                                                    <div className="checkout-checkbox-field">
                                                        <input
                                                            checked={values.type === 'paypal'}
                                                            id="modePayPal"
                                                            name="type"
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setValues({ ...values, type: 'paypal' });
                                                                }
                                                            }}
                                                            type="radio"
                                                        />
                                                        <label
                                                            className="d-flex w-100"
                                                            htmlFor="modePayPal"
                                                        >
                                                            <div className="d-flex-grow-1 margin-left-s">
                                                                <h4 className="margin-0">PayPal</h4>
                                                                <span className="text-subtle d-block margin-top-s">
                                                                    Pay easily, fast and secure with PayPal.
                                                                </span>
                                                            </div>
                                                            <div className="payment-img payment-img-paypal" />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* RIGHT COLUMN: Order Summary */}
                                    <div style={{ flex: '1 1 350px', background: '#f9f9f9', padding: '20px', borderRadius: '5px', height: 'fit-content' }}>
                                        <h3 style={{ marginTop: 0 }}>Order Summary</h3>

                                        <div className="checkout-items" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
                                            {basket.map((product) => (
                                                <div key={product.id || product.cartItemId} style={{ display: 'flex', marginBottom: '15px', alignItems: 'center', background: '#fff', padding: '10px', borderRadius: '5px' }}>
                                                    <div style={{ width: '60px', height: '60px', marginRight: '10px', background: `url(${product.image}) center center / cover no-repeat`, borderRadius: '3px' }} />
                                                    <div style={{ flex: 1, paddingRight: '10px' }}>
                                                        <h5 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{product.name}</h5>
                                                        <span className="text-subtle" style={{ fontSize: '12px' }}>Qty: {product.quantity}</span>
                                                    </div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                                        {displayMoney(product.price * product.quantity)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* DISCOUNT CODE */}
                                        <div style={{ marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Discount code (try SALE10)"
                                                    value={discountCode}
                                                    onChange={(e) => setDiscountCode(e.target.value)}
                                                    className="checkout-field"
                                                    style={{ margin: 0, padding: '10px', width: '100%', border: '1px solid #e1e1e1', borderRadius: '3px' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="button button-small"
                                                    onClick={validateCouponCode}
                                                    style={{ padding: '0 15px' }}
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ borderTop: '1px solid #e1e1e1', paddingTop: '15px' }}>
                                            <div className="d-flex" style={{ justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <span>Subtotal</span>
                                                <span>{displayMoney(subtotal)}</span>
                                            </div>

                                            {appliedCoupon && appliedCoupon.discountPercent && (
                                                <div className="d-flex" style={{ justifyContent: 'space-between', marginBottom: '10px', color: '#52c41a' }}>
                                                    <span>Discount ({appliedCoupon.discountPercent}%)</span>
                                                    <span>-{displayMoney(discountAmount)}</span>
                                                </div>
                                            )}

                                            <div className="d-flex" style={{ justifyContent: 'space-between', marginTop: '15px' }}>
                                                <h3 style={{ margin: 0 }}>Total</h3>
                                                <h3 style={{ margin: 0 }}>{displayMoney(finalTotal)}</h3>
                                            </div>
                                        </div>

                                        <br />
                                        <button
                                            className="button w-100-mobile"
                                            type="submit"
                                            style={{ width: '100%', marginTop: '10px' }}
                                        >
                                            Confirm Order
                                            &nbsp;
                                            <ArrowRightOutlined />
                                        </button>

                                        <button
                                            className="button button-muted w-100-mobile"
                                            onClick={() => history.push('/')}
                                            type="button"
                                            style={{ width: '100%', marginTop: '10px' }}
                                        >
                                            <ArrowLeftOutlined />
                                            &nbsp;
                                            Continue Shopping
                                        </button>

                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Boundary>
    );
};

Checkout.propTypes = {
    basket: PropType.arrayOf(PropType.object).isRequired,
    subtotal: PropType.number.isRequired,
    profile: PropType.shape({
        fullname: PropType.string,
        email: PropType.string,
        address: PropType.string,
        mobile: PropType.object
    }).isRequired,
    shipping: PropType.shape({
        fullname: PropType.string,
        email: PropType.string,
        address: PropType.string,
        mobile: PropType.object,
        isInternational: PropType.bool,
        isDone: PropType.bool
    }).isRequired,
    payment: PropType.shape({
        type: PropType.string
    })
};

Checkout.defaultProps = {
    payment: { type: 'paypal' }
};

export default withCheckout(Checkout);
