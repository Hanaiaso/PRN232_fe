import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { useDidMount, useDocumentTitle, useScrollTop } from '@/hooks';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '@/redux/actions/authActions';

const ForgotPassword = () => {
  const { authStatus, isAuthenticating } = useSelector((state) => ({
    isAuthenticating: state.app.isAuthenticating,
    authStatus: state.app.authStatus
  }));
  const dispatch = useDispatch();
  const didMount = useDidMount();
  const [forgotPWStatus, setForgotPWStatus] = useState({});
  const [isSendingForgotPWRequest, setIsSending] = useState(false);
  const [field, setField] = useState({});

  useScrollTop();
  useDocumentTitle('Forgot Password | Salinaka');
  useEffect(() => {
    if (didMount) {
      setForgotPWStatus(authStatus);
      setIsSending(isAuthenticating);
    }
  }, [authStatus, isAuthenticating]);

  const onEmailChange = (e) => {
    const email = e.target.value;
    const error = !email || !email.includes('@') ? 'Valid email required' : null;
    setField({ email, error });
  };

  const onSubmitEmail = () => {
    if (!!field.email && !field.error) {
      dispatch(forgotPassword(field.email));
    }
  };

  return (
    <div className="forgot_password">
      {forgotPWStatus?.message && (
        <h5 className={`text-center ${authStatus?.success ? 'toast-success' : 'toast-error'}`}>
          {authStatus.message}
        </h5>
      )}
      <h2>Forgot Your Password?</h2>
      <p>Enter your email address and we will send you a password reset email.</p>
      <br />
      <input
        className="input-form"
        label="* Email"
        maxLength={40}
        onChange={onEmailChange}
        placeholder="Enter your email"
        readOnly={isSendingForgotPWRequest || authStatus?.success}
        type="email"
        style={{ width: '100%' }}
        value={field.email || ''}
      />
      <br />
      <br />
      <button
        className="button w-100-mobile"
        disabled={isSendingForgotPWRequest || authStatus?.success || !!field.error}
        onClick={onSubmitEmail}
        type="button"
      >
        {isSendingForgotPWRequest ? <LoadingOutlined /> : <CheckOutlined />}
        &nbsp;
        {isSendingForgotPWRequest ? 'Sending Password Reset Email' : 'Send Password Reset Email'}
      </button>
    </div>
  );
};

export default ForgotPassword;
