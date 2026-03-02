/* eslint-disable no-nested-ternary */
import { SIGNIN } from '@/constants/routes';
import { calculateTotal } from '@/helpers/utils';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

const withCheckout = (Component) => withRouter((props) => {
  const state = useSelector((store) => ({
    // BYPASS AUTH: Hardcode User ID 40
    isAuth: true, // !!store.auth.id && !!store.auth.role,
    basket: store.basket,
    shipping: store.checkout.shipping,
    payment: store.checkout.payment,
    profile: { ...store.profile, fullname: 'Test User', email: 'test@example.com', address: '123 Test St', mobile: { value: '0987654321' }, id: 40 }, // Mock profile
    selectedItems: store.checkout.selectedItems
  }));

  const shippingFee = state.shipping.isInternational ? 50 : 0;
  // Filter basket based on selectedItems
  const filteredBasket = state.basket.filter(p => state.selectedItems.includes(p.cartItemId));
  const subtotal = calculateTotal(filteredBasket.map((product) => product.price * product.quantity));

  if (!state.isAuth) {
    return <Redirect to={SIGNIN} />;
  } if (state.basket.length === 0 || filteredBasket.length === 0) { // Redirect if no items selected
    return <Redirect to="/" />;
  } if (state.isAuth && state.basket.length !== 0) {
    return (
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        basket={filteredBasket}
        payment={state.payment}
        profile={state.profile}
        shipping={state.shipping}
        subtotal={Number(subtotal + shippingFee)}
      />
    );
  }
  return null;
});

export default withCheckout;
