/* eslint-disable max-len */
import { BasketItem, BasketToggle } from '@/components/basket';
import { Boundary, Modal } from '@/components/common';
import { CHECKOUT_STEP_1 } from '@/constants/routes';
import { calculateTotal, displayMoney } from '@/helpers/utils';
import { useDidMount, useModal, useBasket } from '@/hooks';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { clearBasket } from '@/redux/actions/basketActions';
import { setSelectedItems as setSelectedItemsAction } from '@/redux/actions/checkoutActions';

const Basket = () => {
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();
  const { basket, user } = useSelector((state) => ({
    basket: state.basket,
    user: state.auth
  }));
  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const didMount = useDidMount();

  useEffect(() => {
    // Redundant Firebase sync removed found in original lines 24-34
  }, [basket.length]);

  // const onCheckOut = () => {
  //   // Verified user check removed for Hardcoded Backend ID support
  //   if (basket.length !== 0) {
  //     document.body.classList.remove('is-basket-open');
  //     history.push(CHECKOUT_STEP_1);
  //   } else {
  //     // Logic for empty basket
  //   }
  // };

  // const onSignInClick = () => {
  //   onCloseModal();
  //   document.body.classList.remove('basket-open');
  //   history.push(CHECKOUT_STEP_1);
  // };

  const { clearBasket } = useBasket(); // hook import kept if needed elsewhere, but unused here now
  const [selectedItems, setSelectedItems] = React.useState([]);

  // Default select all items when basket loads
  useEffect(() => {
    if (basket.length > 0) {
      // Keep existing selections, add new ones, remove stale ones? 
      // Simple approach: Select all if selection is empty, otherwise keep sync?
      // Better: Initialize with all IDs.
      const allIds = basket.map(p => p.cartItemId);
      setSelectedItems(allIds);
    }
  }, [basket.length]);

  const onToggleSelection = (cartItemId) => {
    if (selectedItems.includes(cartItemId)) {
      setSelectedItems(selectedItems.filter(id => id !== cartItemId));
    } else {
      setSelectedItems([...selectedItems, cartItemId]);
    }
  };

  const onCheckOut = () => {
    // BYPASS AUTH: Always allow checkout for dev
    // if ((basket.length !== 0 && store.auth.id)) { 
    if (basket.length !== 0) { // Removed auth check
      document.body.classList.remove('is-basket-open');
      // Dispatch selected items to Redux for persistence
      dispatch(setSelectedItemsAction(selectedItems));
      // Still pass state as backup or for immediate use if needed (redundant but safe)
      history.push({
        pathname: CHECKOUT_STEP_1,
        state: { selectedCartItemIds: selectedItems }
      });
    } else {
      // Logic for empty selection or basket
      // Maybe show toast: "Please select at least one item"
    }
  };

  const onSignInClick = () => {
    onCloseModal();
    document.body.classList.remove('basket-open');
    history.push(CHECKOUT_STEP_1);
  };

  const calculateSelectedTotal = () => {
    const selectedProducts = basket.filter(p => selectedItems.includes(p.cartItemId));
    return calculateTotal(selectedProducts.map((product) => product.price * product.quantity));
  };

  return user && user.role === 'ADMIN' ? null : (
    <Boundary>
      <Modal
        isOpen={isOpenModal}
        onRequestClose={onCloseModal}
      >
        <p className="text-center">You must sign in to continue checking out</p>
        <br />
        <div className="d-flex-center">
          <button
            className="button button-border button-border-gray button-small"
            onClick={onCloseModal}
            type="button"
          >
            Continue shopping
          </button>
          &nbsp;
          <button
            className="button button-small"
            onClick={onSignInClick}
            type="button"
          >
            Sign in to checkout
          </button>
        </div>
      </Modal>
      <div className="basket">
        <div className="basket-list">
          <div className="basket-header">
            <h3 className="basket-header-title">
              My Basket &nbsp;
              <span>
                (
                {` ${basket.length} ${basket.length > 1 ? 'items' : 'item'}`}
                )
              </span>
            </h3>
            <BasketToggle>
              {({ onClickToggle }) => (
                <span
                  className="basket-toggle button button-border button-border-gray button-small"
                  onClick={onClickToggle}
                  role="presentation"
                >
                  Close
                </span>
              )}
            </BasketToggle>
            {/* Clear Basket Button Removed */}
          </div>
          {basket.length <= 0 && (
            <div className="basket-empty">
              <h5 className="basket-empty-msg">Your basket is empty</h5>
            </div>
          )}
          {basket.map((product, i) => (
            <BasketItem
              // eslint-disable-next-line react/no-array-index-key
              key={`${product.cartItemId || product.id}_${i}`}
              product={product}
              basket={basket}
              dispatch={dispatch}
              isSelected={selectedItems.includes(product.cartItemId)}
              onToggleSelection={() => onToggleSelection(product.cartItemId)}
            />
          ))}
        </div>
        <div className="basket-checkout">
          <div className="basket-total">
            <p className="basket-total-title">Subtotal Amout:</p>
            <h2 className="basket-total-amount">
              {displayMoney(calculateSelectedTotal())}
            </h2>
          </div>
          <button
            className="basket-checkout-button button"
            disabled={basket.length === 0 || selectedItems.length === 0 || pathname === '/checkout'}
            onClick={onCheckOut}
            type="button"
          >
            Check Out
          </button>
        </div>
      </div>
    </Boundary>
  );
};

export default Basket;
