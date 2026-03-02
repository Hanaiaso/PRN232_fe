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
