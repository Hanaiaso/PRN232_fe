import * as type from '@/constants/constants';

export const signIn = (email, password, accountType = 'personal') => ({
  type: type.SIGNIN,
  payload: {
    email,
    password,
    accountType
  }
});

export const signInWithGoogle = (idToken) => ({
  type: type.SIGNIN_WITH_GOOGLE,
  payload: idToken
});

export const signInWithFacebook = (accessToken) => ({
  type: type.SIGNIN_WITH_FACEBOOK,
  payload: accessToken
});

export const signInWithGithub = () => ({
  type: type.SIGNIN_WITH_GITHUB
});

export const signUp = (user) => ({
  type: type.SIGNUP,
  payload: { ...user, accountType: user.accountType || 'personal' }
});

export const signInSuccess = (auth) => ({
  type: type.SIGNIN_SUCCESS,
  payload: auth
});

export const setAuthPersistence = () => ({
  type: type.SET_AUTH_PERSISTENCE
});

export const signOut = () => ({
  type: type.SIGNOUT
});

export const signOutSuccess = () => ({
  type: type.SIGNOUT_SUCCESS
});

export const onAuthStateChanged = () => ({
  type: type.ON_AUTHSTATE_CHANGED
});

export const onAuthStateSuccess = (user) => ({
  type: type.ON_AUTHSTATE_SUCCESS,
  payload: user
});

export const onAuthStateFail = (error) => ({
  type: type.ON_AUTHSTATE_FAIL,
  payload: error
});

export const forgotPassword = (email) => ({
  type: type.FORGOT_PASSWORD,
  payload: email
});

export const confirmResetPassword = (token, newPassword, confirmPassword) => ({
  type: type.CONFIRM_RESET_PASSWORD,
  payload: {
    token,
    newPassword,
    confirmPassword
  }
});

