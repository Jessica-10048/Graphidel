import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router'; 
import URL from '../../../utils/constants/url';
import axios from 'axios';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);

  // 🔄 Récupère les données du produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${URL.GET_PRODUCT}/${id}`);
        const { name, description, price, image } = res.data;
        setForm({ name, description, price, image: null });
        setPreview(`http://localhost:8000/${image}`);
      } catch (err) {
        console.error('Erreur lors de la récupération du produit', err);
      }
    };
    fetchProduct();
  }, [id]);

  // 📝 Gère les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0])); 
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 💾 Gère la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    if (form.image) formData.append('image', form.image);

    try {
      await axios.put(`${URL.UPDATE_PRODUCT}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/products');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du produit', err);
    }
  };

  return (
   <div className="admin-form-container">
      <h2>✏️ Edit a product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="admin-form">
        <label>
          Product name :
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description :
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Price $:
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Picture :
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        {preview && <img src={preview} alt="Aperçu" width="200" style={{ marginTop: '10px', borderRadius: '10px' }} />}

        <button type="submit" className="btn-save">💾 Save changes</button>
      </form>
    </div>
  );
};

export default EditProduct;
