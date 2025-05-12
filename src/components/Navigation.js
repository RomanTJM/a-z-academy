import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ cartItemsCount }) => {
  return (
    <nav className="navigation">
      <Link to="/" className="nav-link">Каталог</Link>
      <Link to="/cart" className="cart-link">
        Корзина {cartItemsCount > 0 && `(${cartItemsCount})`}
      </Link>
    </nav>
  );
};

export default Navigation; 