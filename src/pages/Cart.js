import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, removeFromCart }) => {
  return (
    <div className="cart">
      <Link to="/" className="cart-back">назад</Link>
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.image} alt={item.productName} />
            <h3>{item.productName}</h3>
            <div className="cart-info">
              цвет: {item.colorName}<br />
              размер: {item.sizeLabel}<br />
              цена: {item.price}
            </div>
            <button className="remove-btn" onClick={() => removeFromCart(index)}>
              удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart; 