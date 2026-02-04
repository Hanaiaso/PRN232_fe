import {
  ON_AUTHSTATE_FAIL,
  ON_AUTHSTATE_SUCCESS, ON_AUTHSTATE_CHANGED, RESET_PASSWORD,
  SET_AUTH_PERSISTENCE,
  SIGNIN, SIGNIN_WITH_FACEBOOK,
  SIGNIN_WITH_GITHUB, SIGNIN_WITH_GOOGLE,
  SIGNOUT, SIGNUP
} from '@/constants/constants';
import { SIGNIN as ROUTE_SIGNIN } from '@/constants/routes';
import { call, put } from 'redux-saga/effects';
import { signInSuccess, signOutSuccess } from '@/redux/actions/authActions';
import { clearBasket, setBasketItems } from '@/redux/actions/basketActions';
import { resetCheckout } from '@/redux/actions/checkoutActions';
import { resetFilter } from '@/redux/actions/filterActions';
import { setAuthenticating, setAuthStatus } from '@/redux/actions/miscActions';
import { clearProfile, setProfile } from '@/redux/actions/profileActions';
import { history } from '@/routers/AppRouter';
import * as authApi from '@/api/auth';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  removeTokens
} from '@/api/token';

function* handleError(e) {
  const obj = { success: false, type: 'auth', isError: true };
  yield put(setAuthenticating(false));

  // Normalize some known messages
  const message = e?.message || 'An error occurred';
  yield put(setAuthStatus({ ...obj, message }));
}

function* initRequest() {
  yield put(setAuthenticating());
  yield put(setAuthStatus({}));
}

function* authSaga({ type, payload }) {
  switch (type) {
    case SIGNIN:
      try {
        yield initRequest();
        const data = yield call(authApi.login, payload.email, payload.password);

        // Save tokens (handle different casing from backend)
        const accessToken = data.accessToken || data.AccessToken;
        const refreshToken = data.refreshToken || data.RefreshToken;
        if (accessToken) setAccessToken(accessToken);
        if (refreshToken) setRefreshToken(refreshToken);

        // Load profile
        const user = yield call(authApi.me);

        yield put(setProfile(user));
        yield put(signInSuccess({ id: user.id, role: user.role, provider: 'password' }));
        yield put(setAuthStatus({ success: true, type: 'auth', isError: false, message: 'Successfully signed in. Redirecting...' }));
        yield put(setAuthenticating(false));
        yield call(history.push, '/');
      } catch (e) {
        yield handleError(e);
      }
      break;
    case SIGNIN_WITH_GOOGLE:
    case SIGNIN_WITH_FACEBOOK:
    case SIGNIN_WITH_GITHUB:
      // Social logins require backend support - inform user
      yield put(setAuthStatus({ success: false, type: 'auth', isError: true, message: 'Social login is not supported by the backend API.' }));
      yield put(setAuthenticating(false));
      break;
    case ON_AUTHSTATE_CHANGED: {
      // Try to restore session from stored tokens
      try {
        const access = getAccessToken();
        if (!access) {
          yield put({ type: ON_AUTHSTATE_FAIL });
          break;
        }
        const user = yield call(authApi.me);
        yield put(setProfile(user));
        yield put(signInSuccess({ id: user.id, role: user.role, provider: 'password' }));
        yield put(setAuthStatus({ success: true, type: 'auth', isError: false, message: 'Session restored' }));
      } catch (e) {
        removeTokens();
        yield put({ type: ON_AUTHSTATE_FAIL });
      }
      break;
    }
    case SIGNUP:
      try {
        yield initRequest();
        // payload expected: { email, password, confirmPassword }
        const res = yield call(authApi.register, payload.email, payload.password, payload.confirmPassword);
        yield put(setAuthStatus({ success: true, type: 'auth', isError: false, message: res?.message || 'Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.' }));
        yield put(setAuthenticating(false));
      } catch (e) {
        yield handleError(e);
      }
      break;
    case SIGNOUT: {
      try {
        yield initRequest();
        const refreshToken = getRefreshToken();
        try {
          if (refreshToken) yield call(authApi.logout, refreshToken);
        } catch (e) {
          // ignore server errors during logout
        }

        // clear client tokens + reset state
        removeTokens();
        yield put(clearBasket());
        yield put(clearProfile());
        yield put(resetFilter());
        yield put(resetCheckout());
        yield put(signOutSuccess());
        yield put(setAuthenticating(false));
        yield call(history.push, ROUTE_SIGNIN);
      } catch (e) {
        console.log(e);
      }
      break;
    }
    case RESET_PASSWORD: {
      // Not implemented on provided backend
      yield put(setAuthStatus({ success: false, type: 'reset', isError: true, message: 'Reset password is not implemented on the backend.' }));
      yield put(setAuthenticating(false));
      break;
    }
    case ON_AUTHSTATE_SUCCESS: {
      // kept for compatibility; not used in this flow
      break;
    }
    case ON_AUTHSTATE_FAIL: {
      yield put(clearProfile());
      yield put(signOutSuccess());
      break;
    }
    case SET_AUTH_PERSISTENCE: {
      // no-op for token-based approach
      break;
    }
    default: {
      // Handle auth restore on app start: if access token exists, try to fetch profile
      // We'll not throw here to avoid crashing the saga middleware
      break;
    }
  }
}

export default authSaga;
