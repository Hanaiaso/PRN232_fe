# Hướng dẫn tạo màn hình mới trong dự án

## 1. Cấu trúc thư mục (Folder Structure)

```
src/
├── api/
│   └── endpoints/          # API calls (getProducts, getFeaturedProducts, etc.)
├── components/             # Reusable components (Button, Modal, etc.)
│   ├── common/            # Common components (Navigation, Header, etc.)
│   ├── product/           # Product-specific components
│   └── basket/            # Basket-specific components
├── hooks/                 # Custom hooks (useProduct, useFeaturedProducts, etc.)
├── views/                 # Page/Screen components
│   ├── home/
│   ├── shop/
│   ├── view_product/      # Product detail page
│   └── [your-new-page]/   # Thêm folder mới cho màn hình mới
├── routers/               # Routing configuration (AppRouter.jsx)
├── redux/
│   ├── actions/           # Redux actions
│   ├── reducers/          # Redux reducers
│   └── sagas/             # Redux sagas (side effects)
└── constants/
    └── routes.js          # Route paths
```

## 2. Các bước tạo màn hình mới

### Bước 1: Thêm API endpoint (nếu cần)
**File:** `src/api/endpoints/product.js` (hoặc tạo file mới)

```javascript
export const getYourData = async (params) => {
  try {
    const url = `${PRODUCT_CONFIG.BASE_URL}/your-endpoint`;
    const data = await apiCall(url);
    return transformData(data);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Bước 2: Tạo custom hook (nếu cần)
**File:** `src/hooks/useYourData.js`

```javascript
import { useEffect, useState } from 'react';
import { getYourData } from '@/api/endpoints/product';

const useYourData = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getYourData();
      setData(result);
      setLoading(false);
    } catch (e) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, fetchData, isLoading, error };
};

export default useYourData;
```

### Bước 3: Tạo components (nếu cần)
**Folder:** `src/components/your-feature/`
- Tạo các component UI nhỏ ở đây (ItemCard.jsx, ItemList.jsx, etc.)

### Bước 4: Tạo view/page component
**File:** `src/views/your-page/YourPage.jsx`

```javascript
import { useYourData } from '@/hooks';

const YourPage = () => {
  const { data, isLoading, error } = useYourData();

  if (isLoading) return <Preloader />;
  if (error) return <MessageDisplay message={error} />;

  return (
    <div className="your-page">
      {/* Render data */}
    </div>
  );
};

export default YourPage;
```

### Bước 5: Thêm route
**File:** `src/constants/routes.js`

```javascript
export const ROUTE_PATHS = {
  // ... existing routes
  YOUR_PAGE: '/your-page'
};
```

### Bước 6: Thêm vào Router
**File:** `src/routers/AppRouter.jsx`

```javascript
import YourPage from '@/views/your-page/YourPage';

const AppRouter = () => (
  <Routes>
    {/* ... existing routes */}
    <Route path={ROUTE_PATHS.YOUR_PAGE} element={<YourPage />} />
  </Routes>
);
```

## 3. Quy ước đặt tên

| Loại | Quy ước | Ví dụ |
|------|--------|-------|
| View/Page | PascalCase | `ProductDetail.jsx` |
| Component | PascalCase | `ProductCard.jsx` |
| Hook | camelCase với prefix `use` | `useProductDetail.js` |
| API function | camelCase | `getProductById()` |
| Route constant | UPPER_CASE | `PRODUCT_DETAIL` |
| CSS class | kebab-case | `.product-card` |

## 4. Import aliases (Path mapping)
Sử dụng `@` để import từ `src/`:
```javascript
import { useProduct } from '@/hooks';
import ProductCard from '@/components/product/ProductCard';
import { ROUTE_PATHS } from '@/constants/routes';
```

## 5. Redux (Nếu state phức tạp)
Nếu cần quản lý state toàn cục:

**File:** `src/redux/actions/yourActions.js`
**File:** `src/redux/reducers/yourReducer.js`
**File:** `src/redux/sagas/yourSaga.js`

Sau đó kết nối trong `src/redux/store/` và `rootSaga.js`

---