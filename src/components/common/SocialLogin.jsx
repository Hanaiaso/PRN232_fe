import { FacebookOutlined, GithubFilled } from '@ant-design/icons';
import PropType from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithFacebook, signInWithGithub, signInWithGoogle } from '@/redux/actions/authActions';

const SocialLogin = ({ isLoading }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load Google SDK
    if (window.google) {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (clientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLogin
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-button-container'),
          { theme: 'outline', size: 'large', width: '100%' }
        );
      } else {
        console.error('VITE_GOOGLE_CLIENT_ID chưa được cấu hình');
      }
    } else {
      console.error('Google SDK chưa load');
    }

    // Load Facebook SDK
    if (!window.FB) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
          cookie: true,
          xfbml: false,
          version: 'v13.0'
        });
      };
      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    }
  }, []);

  const handleGoogleLogin = (response) => {
    if (response.credential) {
      dispatch(signInWithGoogle(response.credential));
    }
  };

  const handleFacebookLogin = () => {
    if (!window.FB) {
      console.error('Facebook SDK không sẵn sàng');
      return;
    }
    if (location.protocol !== 'https:' && !location.hostname.match(/localhost/)) {
      console.error('Facebook login requires HTTPS. Use https://localhost or serve over SSL.');
      return;
    }
    // ensure FB.init has executed
    if (!window.FB.getLoginStatus) {
      console.error('Facebook SDK not initialized yet');
      return;
    }
    window.FB.login(
      (res) => {
        if (res.authResponse && res.authResponse.accessToken) {
          dispatch(signInWithFacebook(res.authResponse.accessToken));
        } else {
          console.error('Facebook login failed or cancelled');
        }
      },
      { scope: 'email' }
    );
  };

  const onSignInWithGithub = () => {
    dispatch(signInWithGithub());
  };

  return (
    <div className="auth-provider">
      <div id="google-button-container" style={{ marginBottom: '10px' }} />
      <button
        className="button auth-provider-button provider-facebook"
        disabled={isLoading}
        onClick={handleFacebookLogin}
        type="button"
      >
        {/* <i className="fab fa-facebook" /> */}
        <FacebookOutlined />
        Continue with Facebook
      </button>
      <button
        className="button auth-provider-button provider-github"
        disabled={isLoading}
        onClick={onSignInWithGithub}
        type="button"
      >
        <GithubFilled />
        Continue with GitHub
      </button>
    </div>
  );
};

SocialLogin.propTypes = {
  isLoading: PropType.bool.isRequired
};

export default SocialLogin;
