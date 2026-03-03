import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { CustomInput } from '@/components/formik';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { confirmResetPassword } from '@/redux/actions/authActions';
import { setAuthStatus } from '@/redux/actions/miscActions';
import * as Yup from 'yup';

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required.')
});

const ResetPassword = ({ location }) => {
  const { authStatus, isAuthenticating } = useSelector((state) => ({
    authStatus: state.app.authStatus,
    isAuthenticating: state.app.isAuthenticating
  }));

  const dispatch = useDispatch();
  const [token, setToken] = useState('');

  useScrollTop();
  useDocumentTitle('Reset Password | Salinaka');

  useEffect(() => {
    // Get token from query params
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');

    if (!tokenFromUrl) {
      dispatch(setAuthStatus({
        success: false,
        message: 'Invalid or expired reset link. Please request a new one.',
        isError: true
      }));
    } else {
      setToken(tokenFromUrl);
    }
  }, [location.search, dispatch]);

  const onSubmitForm = (form) => {
    if (token) {
      dispatch(confirmResetPassword(token, form.password, form.confirmPassword));
    }
  };

  return (
    <div className="auth-content">
      {authStatus?.message && (
        <h5 className={`text-center ${authStatus?.success ? 'toast-success' : 'toast-error'}`}>
          {authStatus.message}
        </h5>
      )}
      {!authStatus?.success && token && (
        <div className="auth">
          <div className="auth-main">
            <h3>Reset Your Password</h3>
            <br />
            <div className="auth-wrapper">
              <Formik
                initialValues={{
                  password: '',
                  confirmPassword: ''
                }}
                validateOnChange
                validationSchema={ResetPasswordSchema}
                onSubmit={onSubmitForm}
              >
                {() => (
                  <Form>
                    <div className="auth-field">
                      <Field
                        disabled={isAuthenticating}
                        name="password"
                        type="password"
                        label="New Password"
                        placeholder="Enter your new password"
                        component={CustomInput}
                      />
                    </div>
                    <div className="auth-field">
                      <Field
                        disabled={isAuthenticating}
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm your new password"
                        component={CustomInput}
                      />
                    </div>
                    <br />
                    <div className="auth-field auth-action">
                      <button
                        className="button auth-button"
                        disabled={isAuthenticating}
                        type="submit"
                      >
                        {isAuthenticating ? 'Resetting Password' : 'Reset Password'}
                        &nbsp;
                        {isAuthenticating ? <LoadingOutlined /> : <CheckOutlined />}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
