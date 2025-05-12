import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Navigation from './components/Navigation';

function App() {
  // Инициализация корзины из localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  // Сохранять корзину в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Состояния для уведомлений
  const [showAlert, setShowAlert] = useState(false);
  const [showAlreadyAlert, setShowAlreadyAlert] = useState(false);

  const handleShowAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const handleShowAlreadyAlert = () => {
    setShowAlreadyAlert(true);
    setTimeout(() => setShowAlreadyAlert(false), 2000);
  };

  const addToCart = (item) => {
    // Проверяем, нет ли уже такого товара в корзине
    const isItemInCart = cartItems.some(
      cartItem =>
        cartItem.productId === item.productId &&
        cartItem.colorId === item.colorId &&
        cartItem.sizeId === item.sizeId
    );

    if (!isItemInCart) {
      setCartItems([...cartItems, item]);
      handleShowAlert();
    } else {
      handleShowAlreadyAlert();
    }
  };

  const removeFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  return (
    <Router>
      <div className="app">
        <Navigation cartItemsCount={cartItems.length} />
        {showAlert && (
          <div className="cart-modal-overlay">
            <div className="cart-modal">
              Товар добавлен в корзину
            </div>
          </div>
        )}
        {showAlreadyAlert && (
          <div className="cart-modal-overlay">
            <div className="cart-modal">
              Товар уже добавлен в корзину
            </div>
          </div>
        )}
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route 
            path="/product/:id" 
            element={<ProductDetail addToCart={addToCart} />} 
          />
          <Route 
            path="/cart" 
            element={
              <Cart 
                cartItems={cartItems} 
                removeFromCart={removeFromCart} 
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
