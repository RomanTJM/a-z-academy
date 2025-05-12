import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="product-list">
      <h1>Каталог товаров</h1>
      <div className="products-grid">
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-card">
            <img 
              src={product.colors[0].images[0]} 
              alt={product.name} 
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p>от {product.colors[0].price} ₽</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 