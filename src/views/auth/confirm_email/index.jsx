import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { confirmEmail as confirmEmailApi } from '@/api/auth';
import { SIGNIN } from '@/constants/routes';

const useQuery = () => new URLSearchParams(useLocation().search);

const ConfirmEmail = () => {
  const query = useQuery();
  const token = query.get('token');
  const [status, setStatus] = useState({ loading: true, message: null, error: false });

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus({ loading: false, message: 'Token không hợp lệ', error: true });
        return;
      }
      try {
        const res = await confirmEmailApi(token);
        setStatus({ loading: false, message: res || 'Xác nhận email thành công', error: false });
      } catch (e) {
        setStatus({ loading: false, message: e.message || 'Xác nhận email thất bại', error: true });
      }
    };
    run();
  }, [token]);

  return (
    <div className="auth-content">
      <div className="auth">
        <div className="auth-main">
          <h3>{status.loading ? 'Đang xử lý...' : (status.error ? 'Lỗi' : 'Thành công')}</h3>
          <p>{status.loading ? 'Vui lòng chờ...' : status.message}</p>
          {!status.loading && <Link to={SIGNIN}>Quay lại đăng nhập</Link>}
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;