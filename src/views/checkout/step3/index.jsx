import { CHECKOUT_STEP_1 } from '@/constants/routes';
import { Form, Formik } from 'formik';
import { displayActionMessage } from '@/helpers/utils';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import { cartService } from '@/services/cartService';
import PropType from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import { StepTracker } from '../components';
import withCheckout from '../hoc/withCheckout';
import PayPalPayment from './PayPalPayment';
import Total from './Total';

const FormSchema = Yup.object().shape({
  type: Yup.string().required('Please select payment mode')
});

const Payment = ({ shipping, payment, subtotal, ...props }) => {
  useDocumentTitle('Check Out Final Step | Salinaka');
  useScrollTop();

  const initFormikValues = {
    // Only payment type is needed now
    type: 'paypal'
  };

  const onConfirm = async (form) => {
    console.log('onConfirm triggered', form);
    // Always assume PayPal or check type explicitly if we add more later
    try {
      console.log('Selected Payment: PayPal');
      // 1. Get selected items IDs
      // eslint-disable-next-line react/prop-types
      const cartItemIds = props.basket.map(item => item.cartItemId);
      console.log('Cart Items IDs:', cartItemIds);

      if (cartItemIds.length === 0) {
        console.error('No items selected');
        displayActionMessage('No items selected', 'error');
        return;
      }

      // 2. Place Order
      console.log('Calling placeOrder...');
      const orderData = await cartService.placeOrder(cartItemIds);
      console.log('Order Data:', orderData);

      if (!orderData || !orderData.orderId) {
        throw new Error('Order creation failed');
      }

      // 3. Create PayPal Link
      console.log('Calling createPayPalOrder for Order ID:', orderData.orderId);
      const paypalData = await cartService.createPayPalOrder(orderData.orderId);
      console.log('PayPal Data:', paypalData);

      if (paypalData && paypalData.link) {
        console.log('Redirecting to:', paypalData.link);
        // Save valid orderId to session storage for retrieval on return
        window.sessionStorage.setItem('pending_order_id', orderData.orderId);
        window.location.href = paypalData.link;
      } else {
        throw new Error('Failed to generate PayPal link');
      }
    } catch (e) {
      console.error('Payment Error:', e);
      displayActionMessage(e.message || 'Payment processing failed', 'error');
    }
  };

  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }
  return (
    <div className="checkout">
      <StepTracker current={3} />
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        validate={(form) => {
          if (form.type === 'paypal') {
            // displayActionMessage('Feature not ready yet :)', 'info');
          }
        }}
        onSubmit={onConfirm}
      >
        {() => (
          <Form className="checkout-step-3">
            <PayPalPayment />
            <Total
              isInternational={shipping.isInternational}
              subtotal={subtotal}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

Payment.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string
  }).isRequired,
  subtotal: PropType.number.isRequired
};

export default withCheckout(Payment);
