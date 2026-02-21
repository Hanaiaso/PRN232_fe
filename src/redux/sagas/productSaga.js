/* eslint-disable indent */
import {
  ADD_PRODUCT,
  EDIT_PRODUCT,
  GET_PRODUCTS,
  REMOVE_PRODUCT,
  SEARCH_PRODUCT
} from '@/constants/constants';
import { ADMIN_PRODUCTS } from '@/constants/routes';
import { displayActionMessage } from '@/helpers/utils';
import {
  call, put, select
} from 'redux-saga/effects';
import { setLoading, setRequestStatus } from '@/redux/actions/miscActions';
import { history } from '@/routers/AppRouter';
import {
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  normalizeProduct,
} from '@/api/endpoints/product';
import {
  addProductSuccess,
  clearSearchState, editProductSuccess, getProductsSuccess,
  removeProductSuccess,
  searchProductSuccess
} from '../actions/productActions';

function* initRequest() {
  yield put(setLoading(true));
  yield put(setRequestStatus(null));
}

function* handleError(e) {
  yield put(setLoading(false));
  yield put(setRequestStatus(e?.message || 'Failed to fetch products'));
  console.log('ERROR: ', e);
}

function* handleAction(location, message, status) {
  if (location) yield call(history.push, location);
  yield call(displayActionMessage, message, status);
}

function* productSaga({ type, payload }) {
  switch (type) {
    case GET_PRODUCTS:
      try {
        yield initRequest();
        const state = yield select();
        
        // Map frontend Redux filter state to backend ProductSearchDto
        const searchParams = {
          pageSize: 50,
        };

        if (state.filter.keyword) searchParams.search = state.filter.keyword;
        if (state.filter.brand) searchParams.categoryId = state.filter.brand; // Map frontend 'brand' to backend 'categoryId' for now
        if (state.filter.minPrice > 0) searchParams.minPrice = state.filter.minPrice;
        if (state.filter.maxPrice > 0) searchParams.maxPrice = state.filter.maxPrice;
        
        // Map sort options
        if (state.filter.sortBy === 'name-asc') searchParams.sortBy = 'title';
        else if (state.filter.sortBy === 'name-desc') searchParams.sortBy = 'title_desc';
        else if (state.filter.sortBy === 'price-asc') searchParams.sortBy = 'price_asc';
        else if (state.filter.sortBy === 'price-desc') searchParams.sortBy = 'price_desc';

        const result = yield call(getProducts, searchParams);

        if (result.products.length === 0) {
          yield handleError({ message: 'No items found.' });
        } else {
          yield put(getProductsSuccess({
            products: result.products,
            lastKey: result.lastKey ? result.lastKey : state.products.lastRefKey,
            total: result.total ? result.total : state.products.total
          }));
          yield put(setRequestStatus(''));
        }
        yield put(setLoading(false));
      } catch (e) {
        console.log(e);
        yield handleError(e);
      }
      break;

    case ADD_PRODUCT: {
      try {
        yield initRequest();

        // Build DTO matching CreateProductDto
        const dto = {
          title: payload.title || payload.name || '',
          description: payload.description || '',
          categoryId: payload.categoryId || 1,
          isAuction: payload.isAuction || false,
          auctionEndTime: payload.auctionEndTime || null,
        };

        const created = yield call(createProduct, dto);
        yield put(addProductSuccess({ id: String(created.id), ...created }));
        yield handleAction(ADMIN_PRODUCTS, 'Item successfully added', 'success');
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to add: ${e?.message}`, 'error');
      }
      break;
    }

    case EDIT_PRODUCT: {
      try {
        yield initRequest();

        const { id, updates } = payload;
        const dto = {
          title: updates.title || updates.name || '',
          description: updates.description || '',
          categoryId: updates.categoryId || undefined,
          isAuction: updates.isAuction || false,
          auctionEndTime: updates.auctionEndTime || null,
        };

        yield call(updateProduct, id, dto);
        yield put(editProductSuccess({ id, updates: normalizeProduct({ id: Number(id), ...dto }) }));
        yield handleAction(ADMIN_PRODUCTS, 'Item successfully edited', 'success');
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to edit: ${e?.message}`, 'error');
      }
      break;
    }

    case REMOVE_PRODUCT: {
      try {
        yield initRequest();
        yield call(deleteProduct, payload);
        yield put(removeProductSuccess(payload));
        yield put(setLoading(false));
        yield handleAction(ADMIN_PRODUCTS, 'Item successfully removed', 'success');
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to remove: ${e?.message}`, 'error');
      }
      break;
    }

    case SEARCH_PRODUCT: {
      try {
        yield initRequest();
        yield put(clearSearchState());

        const state = yield select();
        const result = yield call(getProducts, { search: payload.searchKey, pageSize: 20 });

        if (result.products.length === 0) {
          yield handleError({ message: 'No product found.' });
          yield put(clearSearchState());
        } else {
          yield put(searchProductSuccess({
            products: result.products,
            lastKey: result.lastKey ? result.lastKey : state.products.searchedProducts?.lastRefKey,
            total: result.total ? result.total : state.products.searchedProducts?.total
          }));
          yield put(setRequestStatus(''));
        }
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
      }
      break;
    }

    default: {
      throw new Error(`Unexpected action type ${type}`);
    }
  }
}

export default productSaga;
