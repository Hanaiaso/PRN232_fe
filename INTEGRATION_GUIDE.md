# Frontend Integration Guide - Password Reset & Google Login

## Overview
This guide covers the integration of the following new backend features:
- Forgot Password functionality
- Reset Password functionality  
- Google & Facebook Login support

## Changes Made

### 1. API Endpoints (src/api/auth.js)
Added four new API functions:
- `forgotPassword(email)` - POST /api/auth/forgot-password
- `resetPassword(token, newPassword, confirmPassword)` - POST /api/auth/reset-password
- `googleLogin(idToken)` - POST /api/auth/google-login
- `facebookLogin(accessToken)` - POST /api/auth/facebook-login

### 2. Redux Constants (src/constants/constants.js)
Added new action types:
- `FORGOT_PASSWORD` - Trigger forgot password API call
- `CONFIRM_RESET_PASSWORD` - Trigger reset password API call
- `SIGNIN_WITH_GOOGLE_SUCCESS` - Mark Google sign in success

### 3. Redux Actions (src/redux/actions/authActions.js)
Added/updated action creators:
- `forgotPassword(email)` - Dispatch forgot password action
- `confirmResetPassword(token, newPassword, confirmPassword)` - Dispatch reset password action
- Updated `signInWithGoogle(idToken)` - Now accepts idToken parameter
- Added `signInWithFacebook(accessToken)` - Dispatch facebook login with token

### 4. Redux Saga (src/redux/sagas/authSaga.js)
Implemented handlers for:
- `FORGOT_PASSWORD` - Calls API and shows success/error message
- `CONFIRM_RESET_PASSWORD` - Validates and resets password, then redirects to signin
- `SIGNIN_WITH_GOOGLE` - Calls API with idToken, saves tokens, fetches user profile

### 5. Components
#### Updated: src/views/auth/forgot_password/index.jsx
- Changed from custom input to standard HTML input with validation
- Now dispatches `forgotPassword(email)` action
- Shows backend response messages

#### New: src/views/auth/reset_password/index.jsx
- Accepts token from URL query parameter (?token=xxx)
- Uses Formik for password validation
- Confirms password matches
- Validates password length (min 6 characters)

#### Updated: src/components/common/SocialLogin.jsx
- Integrated Google Sign-In using Google SDK
- Added Facebook SDK and login flow
- Loads and initializes both SDKs on component mount
- Handles Google credential callback and Facebook login response
- Removed separate Google button (now uses Google's button)
- Facebook button now triggers FB.login and dispatches access token

### 6. Routes
Added new route: `/reset_password` - Public route for password reset

### 7. HTML (index.html)
Added Google OAuth SDK script:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

## Setup Instructions

### Step 1: Environment Variables
Create a `.env` file in the project root:
```bash
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
```

To get your Google Client ID:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized JavaScript origins: `http://localhost:5173`, `http://localhost:3000`, etc.
6. Add authorized redirect URIs: `http://localhost:5173`, etc.
7. Copy the Client ID

### Step 2: Backend Configuration
Ensure your backend has:
- Google Client ID configured for validation
- Email service configured for sending password reset emails
- CORS configured to accept frontend requests

### Step 3: Test the Features

#### Forgot Password Flow:
1. Visit `/forgot_password`
2. Enter an email address
3. Backend sends reset email with link: `{frontendUrl}/reset_password?token={token}`
4. User clicks link and is redirected to reset password page

#### Reset Password Flow:
1. User visits reset password link with token
2. Enters new password and confirmation
3. Submits form
4. Frontend validates token and updates password via API
5. Redirects to signin page on success

#### Google Login Flow:
1. Visit signin page
2. Click Google Sign In button
3. Google authentication popup appears
4. After successful auth, frontend sends idToken to backend
5. Backend validates and creates/updates user
6. Frontend saves tokens and redirects to home page

#### Facebook Login Flow:
1. Visit signin page
2. Click Facebook button (requests email permission)
3. Facebook popup appears; user approves
4. Frontend receives `accessToken` from FB SDK and dispatches action
5. Backend validates token with Facebook graph API and creates/updates user
6. Frontend saves tokens and redirects to home page

## Testing Checklist

- [ ] Forgot password email validation works
- [ ] Forgot password API is called with correct email
- [ ] Success message is displayed
- [ ] Reset password page loads with token
- [ ] Password validation rules work (min 6 chars, match)
- [ ] Reset password API is called with correct data
- [ ] User is redirected to signin after successful reset
- [ ] Google Sign In button renders correctly
- [ ] Google authentication popup opens
- [ ] User is created/updated correctly
- [ ] Tokens are saved in localStorage
- [ ] User is logged in after Google auth

## Troubleshooting

### Google Sign In button doesn't appear
- Check that VITE_GOOGLE_CLIENT_ID is in .env
- Check browser console for errors
- Verify Google SDK is loaded (check Network tab)

### Reset password token invalid
- Token has 1 hour expiry
- Users must use token within expiry window
- Each new forgot password request generates new token

### Backend returns CORS error
- Ensure backend has CORS headers configured
- Check that frontend URL is in CORS whitelist
- Verify API URL in .env matches backend

### Email not received
- Check backend email service configuration
- Check spam folder
- Verify email address is correct
- Check backend logs for errors

## API Endpoint Details

### Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "message": "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu."
}
```

### Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}

Response:
{
  "message": "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại."
}
```

### Google Login
```
POST /api/auth/google-login
Content-Type: application/json

{
  "idToken": "jwt_token_from_google"
}

Response:
{
  "accessToken": "jwt_access_token",
  "refreshToken": "refresh_token"
}
```

## Notes

1. The SocialLogin component now only shows Google button (via Google SDK) and buttons for Facebook/GitHub with placeholder messages
2. Facebook and GitHub login still show "not supported" message as backend doesn't implement them
3. All new auth flows use the standard error/success handling with Redux
4. Password reset tokens expire after 1 hour
5. All error messages from backend are displayed to users
