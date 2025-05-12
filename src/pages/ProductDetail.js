import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, getSizes } from '../services/api';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [productData, sizesData] = await Promise.all([
        getProduct(id),
        getSizes()
      ]);
      setProduct(productData);
      setSizes(sizesData);
      if (productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
    };
    fetchData();
  }, [id]);

  if (!product || !selectedColor) return <div>Загрузка...</div>;

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setCurrentImageIndex(0);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (selectedColor && selectedSize) {
      addToCart({
        productId: product.id,
        productName: product.name,
        colorId: selectedColor.id,
        colorName: selectedColor.name,
        sizeId: selectedSize.id,
        sizeLabel: selectedSize.label,
        price: selectedColor.price,
        image: selectedColor.images[0]
      });
      setSelectedSize(null);
      setSelectedColor(product.colors[0]);
      setCurrentImageIndex(0);
    }
  };

  const changeImageWithFade = (newIndex) => {
    setFade(true);
    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setFade(false);
    }, 400);
  };

  const handlePrevImage = () => {
    changeImageWithFade((currentImageIndex - 1 + selectedColor.images.length) % selectedColor.images.length);
  };

  const handleNextImage = () => {
    changeImageWithFade((currentImageIndex + 1) % selectedColor.images.length);
  };

  // --- Свайп для мобильных устройств ---
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handlePrevImage();
      } else {
        handleNextImage();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <div className="product-content">
        <div className="product-images">
        <button 
            className="button-slider" 
            onClick={handlePrevImage}  
            aria-label="Предыдущее изображение"
          >
            ◀
          </button>
          <img 
            src={selectedColor.images[currentImageIndex]} 
            alt={`${product.name} ${selectedColor.name}`} 
            className={`product-main-image${fade ? ' fade' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
          <button
            className="button-slider" 
            onClick={handleNextImage} 
            aria-label="Предыдущее изображение"
          >
            ▶
          </button>
        </div>
        <div className="image-thumbnails">
          {selectedColor.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} ${selectedColor.name} ${index + 1}`}
              onClick={() => changeImageWithFade(index)}
              className={currentImageIndex === index ? 'active' : ''}
            />
          ))}
        </div>
        <div className="product-info">
          <div className="colors">
            <h3>Цвет:</h3>
            {product.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleColorChange(color)}
                className={selectedColor.id === color.id ? 'active' : ''}
              >
                {color.name}
              </button>
            ))}
          </div>
          <div className="sizes">
            <h3>Размер:</h3>
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => handleSizeChange(size)}
                className={selectedSize?.id === size.id ? 'active' : ''}
                disabled={!selectedColor.sizes.includes(size.id)}
              >
                {size.label}
              </button>
            ))}
          </div>
          <p className="price">{selectedColor.price} ₽</p>
          <p className="description">{selectedColor.description}</p>
          <button 
            className="add-basket-button"
            onClick={handleAddToCart}
            disabled={!selectedSize}
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 