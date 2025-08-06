import React, { useState } from 'react';
import axios from 'axios';
import URL from'../../../utils/constants/url';
const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview();
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!name || !price || !image) {
    setMessage('Please fill in all the required fields.');
    return;
  }

  const formData = new FormData();
  formData.append('name', name.toString());
  formData.append('description', description.toString());
  formData.append('price', price.toString());
  formData.append('image', image);

  try {
    const res = await axios.post(URL.POST_PRODUCT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setMessage(res.data.message);
    setName('');
    setDescription('');
    setPrice('');
    setImage(null);
    setPreview(null);
  } catch (error) {
    console.error(error);
    setMessage('Error when adding.');
  }
};


  return (
    <section className="form-card-add d-flex ">
      <h2 className='form-card'>Add a product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
        className='form-group'
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
        className='form-group'
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
        className='form-group'
          type="number"
          placeholder="Price ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input className='form-group' type="file" accept="image/*" onChange={handleImageChange} required />

        {preview && <img src={preview} alt="Overview" width="200" style={{ marginTop: '10px' }} />}

        <button type="submit" className="cta-button">Add a product</button>
      </form>

      {message && <p>{message}</p>}
    </section>
  );
};

export default AddProduct;
