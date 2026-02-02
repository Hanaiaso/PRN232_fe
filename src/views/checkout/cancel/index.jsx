
import React from 'react';
import { useHistory } from 'react-router-dom';
import { StepTracker } from '../components';

const CheckoutCancel = () => {
    const history = useHistory();

    return (
        <div className="checkout-cancel">
            <h2 className="text-center">Payment Cancelled</h2>
            <p className="text-center">You have cancelled the payment.</p>
            <div className="d-flex-center">
                <button
                    className="button"
                    onClick={() => history.push('/checkout/step3')}
                    type="button"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default CheckoutCancel;
