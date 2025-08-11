import React, { useState } from 'react';
import axios from 'axios';
import URL from '../../../utils/constants/url'; // Tu gardes le nom 'URL'

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [promo, setPromo] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [message, setMessage] = useState('');

  // Calcul automatique du prix promo
  const calculatePromo = (priceValue, discountValue) => {
    if (!priceValue || !discountValue) return '';
    const promoPrice = priceValue - (priceValue * discountValue / 100);
    return promoPrice.toFixed(2);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const filePreviews = files.map((file) => window.URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value);
    setPromo(calculatePromo(value, discount));
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    setDiscount(value);
    setPromo(calculatePromo(price, value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || images.length === 0) {
      setMessage('Please fill in all the required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('promo', promo);
    formData.append('discount',discount);

    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const res = await axios.post(URL.POST_PRODUCT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(res.data.message || 'Product added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setPromo('');
      setDiscount('');
      setImages([]);
      setPreviews([]);
    } catch (error) {
      console.error(error);
      setMessage('Error when adding the product.');
    }
  };

  return (
    <section className="form-card-add d-flex">
      <h2 className="form-card">Add a product</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          className="form-group"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          className="form-group"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="form-group"
          type="number"
          placeholder="Price (£)"
          value={price}
          onChange={handlePriceChange}
          required
        />

        <input
          className="form-group"
          type="number"
          placeholder="Discount (%)"
          value={discount}
          onChange={handleDiscountChange}
        />

        <input
          className="form-group"
          type="number"
          placeholder="Promo Price (£)"
          value={promo}
          readOnly
        />

        <input
          className="form-group"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          required
        />

        {previews.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
            {previews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index}`}
                width="200"
                style={{ marginRight: '10px', marginBottom: '10px' }}
              />
            ))}
          </div>
        )}

        <button type="submit" className="cta-button">
          Add a product
        </button>
      </form>

      {message && <p style={{ marginTop: '15px' }}>{message}</p>}
    </section>
  );
};

export default AddProduct;
