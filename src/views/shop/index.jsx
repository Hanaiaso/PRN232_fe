/* eslint-disable react/jsx-props-no-spreading */
import { AppliedFilters, AuctionItem, ProductGrid, ProductList } from '@/components/product';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { selectFilter } from '@/selectors/selector';

const Shop = () => {
  useDocumentTitle('Shop | Salinaka');
  useScrollTop();

  const store = useSelector((state) => ({
    filteredProducts: state.products.items, // Backend already filtered this
    products: state.products,
    requestStatus: state.app.requestStatus,
    isLoading: state.app.loading
  }), shallowEqual);

  return (
    <main className="content">
      <section className="product-list-wrapper">
        <div className="display-header">
          <h1>Live Auctions</h1>
        </div>
        <div className="product-grid">
          {[
            {
              id: 'auction_1',
              name: 'Gọng Kính Designer Limited Edition',
              brand: 'Salinaka Premium',
              price: 2300000,
              image: 'https://firebasestorage.googleapis.com/v0/b/salinaka-ecommerce.appspot.com/o/products%2F7l3Z50PEBWnYUAlTPwnk?alt=media&token=52424724-1f63-4470-988a-0a4e764a8543',
            },
            {
              id: 'auction_2',
              name: 'Luxury Gold Necklace',
              brand: 'Gold House',
              price: 15000000,
              image: 'https://firebasestorage.googleapis.com/v0/b/salinaka-ecommerce.appspot.com/o/products%2FALz5M4DI7MF7CdZrq3gS?alt=media&token=8d33ea34-2de3-466b-9b3d-27015e9cd540',
            },
            {
              id: 'auction_3',
              name: 'Vintage Denim Jacket',
              brand: 'Denim Co',
              price: 850000,
              image: 'https://firebasestorage.googleapis.com/v0/b/salinaka-ecommerce.appspot.com/o/products%2F5N85046200?alt=media&token=8d33ea34-2de3-466b-9b3d-27015e9cd540',
            }
          ].map((product) => (
            <AuctionItem key={product.id} product={product} />
          ))}
        </div>
        <br />
        <div className="display-header">
          <h1>All Products</h1>
        </div>
        <AppliedFilters filteredProductsCount={store.filteredProducts.length} />
        <ProductList {...store}>
          <ProductGrid products={store.filteredProducts} />
        </ProductList>
      </section>
    </main>
  );
};

export default Shop;
