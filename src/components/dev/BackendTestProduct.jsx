import { useBasket } from '@/hooks';
import React from 'react';

const BackendTestProduct = () => {
    const { addToBasket, isItemOnBasket } = useBasket();

    // Valid Product Data for Backend Testing
    // Assuming ProductID=1 and VariantID=1 exist in your seeded DB
    const testProduct = {
        id: 26, // Must be int matching DB
        variantId: 20, // Must be int matching DB
        name: "Backend Test Product",
        price: 99.99,
        image: "https://placehold.co/150",
        description: "This is a product added directly to test backend integration.",
        quantity: 1,
        sizes: [42, 43],
        availableColors: ['#000000']
    };

    const handleAdd = () => {
        addToBasket(testProduct);
    };

    return (
        <div className="product-display" style={{ border: '2px dashed red', padding: '20px', margin: '20px 0' }}>
            <div className="product-display-img">
                <img src={testProduct.image} alt="Test Product" style={{ width: '100px' }} />
            </div>
            <div className="product-display-details">
                <h2>{testProduct.name}</h2>
                <p className="text-subtle">{testProduct.description}</p>
                <p><strong>Price:</strong> ${testProduct.price}</p>
                <br />
                <button
                    className="button button-small"
                    onClick={handleAdd}
                    type="button"
                >
                    Test Add To Backend Cart
                </button>
            </div>
        </div>
    );
};

export default BackendTestProduct;
