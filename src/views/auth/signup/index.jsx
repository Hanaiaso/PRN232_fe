import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { SocialLogin } from '@/components/common';
import { CustomInput } from '@/components/formik';
import { SIGNIN } from '@/constants/routes';
import { Field, Form, Formik } from 'formik';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import PropType from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '@/redux/actions/authActions';
import { setAuthenticating, setAuthStatus } from '@/redux/actions/miscActions';
import * as Yup from 'yup';

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email is not valid.')
    .required('Email is required.'),
  password: Yup.string()
    .required('Password is required.')
    .min(8, 'Password length should be at least 8 characters.')
    .matches(/[A-Z\W]/g, 'Password should contain at least 1 uppercase letter.'),
  name: Yup.string()
    .required('Name is required.')
    .min(4, 'Name should be at least 4 characters.')
});

const SignUp = ({ history }) => {
  const { isAuthenticating, authStatus } = useSelector((state) => ({
    isAuthenticating: state.app.isAuthenticating,
    authStatus: state.app.authStatus
  }));
  const dispatch = useDispatch();
  const [accountType, setAccountType] = useState('personal');

  useScrollTop();
  useDocumentTitle('Sign Up | Salinaka');

  useEffect(() => () => {
    dispatch(setAuthStatus(null));
    dispatch(setAuthenticating(false));
  }, []);

  const onClickSignIn = () => history.push(SIGNIN);

  const onFormSubmit = (form) => {
    dispatch(signUp({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password.trim(),
      confirmPassword: form.password.trim(),
      accountType
    }));
  };

  return (
    <div className="auth-content">
      {authStatus?.success && (
        <div className="loader">
          <h3 className="toast-success auth-success">
            {authStatus?.message}
            <LoadingOutlined />
          </h3>
        </div>
      )}
      {!authStatus?.success && (
        <>
          {authStatus?.message && (
            <h5 className="text-center toast-error">
              {authStatus?.message}
            </h5>
          )}
          <div className={`auth ${authStatus?.message && (!authStatus?.success && 'input-error')}`}>
            <div className="auth-main">
              <h3>Sign up to Salinaka</h3>
              <div className="account-type-buttons">
                <button
                  className={`button ${accountType === 'personal' ? 'button-primary' : 'button-border button-border-gray'}`}
                  onClick={() => setAccountType('personal')}
                  type="button"
                  disabled={isAuthenticating}
                >
                  Personal
                </button>
                <button
                  className={`button ${accountType === 'business' ? 'button-primary' : 'button-border button-border-gray'}`}
                  onClick={() => setAccountType('business')}
                  type="button"
                  disabled={isAuthenticating}
                >
                  Business
                </button>
              </div>
              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  password: ''
                }}
                validateOnChange
                validationSchema={SignInSchema}
                onSubmit={onFormSubmit}
              >
                {() => (
                  <Form>
                    <div className="auth-field">
                      <Field
                        disabled={isAuthenticating}
                        name="name"
                        type="text"
                        label={accountType === 'personal' ? '* Full Name' : '* Business Name'}
                        placeholder={accountType === 'personal' ? 'John Doe' : 'Business Name'}
                        style={{ textTransform: 'capitalize' }}
                        component={CustomInput}
                      />
                    </div>
                    <div className="auth-field">
                      <Field
                        disabled={isAuthenticating}
                        name="email"
                        type="email"
                        label={accountType === 'personal' ? '* Email' : '* Business Email'}
                        placeholder={accountType === 'personal' ? 'test@example.com' : 'business@example.com'}
                        component={CustomInput}
                      />
                    </div>
                    <div className="auth-field">
                      <Field
                        disabled={isAuthenticating}
                        name="password"
                        type="password"
                        label="* Password"
                        placeholder="Your Password"
                        component={CustomInput}
                      />
                    </div>
                    <br />
                    <div className="auth-field auth-action auth-action-signup">
                      <button
                        className="button auth-button"
                        disabled={isAuthenticating}
                        type="submit"
                      >
                        {isAuthenticating ? 'Signing Up' : 'Sign Up'}
                        &nbsp;
                        {isAuthenticating ? <LoadingOutlined /> : <ArrowRightOutlined />}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="auth-divider">
              <h6>OR</h6>
            </div>
            <SocialLogin isLoading={isAuthenticating} />
          </div>
          <div className="auth-message">
            <span className="auth-info">
              <strong>Already have an account?</strong>
            </span>
            <button
              className="button button-small button-border button-border-gray"
              disabled={isAuthenticating}
              onClick={onClickSignIn}
              type="button"
            >
              Sign In
            </button>
          </div>
        </>
      )}
    </div>
  );
};

SignUp.propTypes = {
  history: PropType.shape({
    push: PropType.func
  }).isRequired
};

export default SignUp;
