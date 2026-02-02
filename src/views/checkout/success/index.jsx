
import { displayActionMessage } from '@/helpers/utils';
import { cartService } from '@/services/cartService';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { StepTracker } from '../components';

const CheckoutSuccess = () => {
    const history = useHistory();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const capturePayment = async () => {
            const searchParams = new URLSearchParams(location.search);
            const token = searchParams.get('token');
            // Try getting orderId from URL, fallback to session storage
            const orderId = searchParams.get('orderId') || window.sessionStorage.getItem('pending_order_id');

            if (!token || !orderId) {
                displayActionMessage('Invalid payment details. Token or Order ID missing.', 'error');
                // history.push('/');
                return;
            }

            // Clear session storage after use
            window.sessionStorage.removeItem('pending_order_id');

            try {
                await cartService.capturePayPalPayment({ payPalOrderId: token, orderId });
                displayActionMessage('Payment successful!', 'success');
                setLoading(false);
            } catch (error) {
                displayActionMessage(error.message || 'Payment failed', 'error');
                history.push('/checkout/step3');
            }
        };

        capturePayment();
    }, [location.search, history]);

    if (loading) {
        return (
            <div className="checkout-success">
                <h2 className="text-center">Processing Payment...</h2>
            </div>
        );
    }

    return (
        <div className="checkout-success">
            <StepTracker current={4} /> {/* Assuming 4 is Success or handled gracefully */}
            <h2 className="text-center">Payment Successful!</h2>
            <p className="text-center">Thank you for your order.</p>
            <div className="d-flex-center">
                <button
                    className="button"
                    onClick={() => history.push('/')}
                    type="button"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
