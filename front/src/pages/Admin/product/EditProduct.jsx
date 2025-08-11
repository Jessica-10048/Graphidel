import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import URL from "../../../utils/constants/url";
import axios from "axios";

const API_HOST = "http://localhost:8000";

// 1) util: normalise chemin windows -> web
const toWebPath = (p) => (p ? p.replace(/\\/g, "/") : null);

// 2) util: transforme une valeur BDD en URL affichable - CORRIGÉ pour votre structure réelle
const resolveImageUrl = (raw) => {
  if (!raw) return null;
  
  const s = toWebPath(String(raw)).trim();
  console.log("Raw image path:", raw, "-> cleaned:", s);
  
  // Si c'est déjà une URL complète, on la retourne
  if (/^https?:\/\//i.test(s) || s.startsWith("blob:") || s.startsWith("data:")) {
    return s;
  }
  
  // D'après les logs: "uploads/public/144a6d2c.jpg"
  // Donc le fichier est dans uploads/public/, pas uploads/public/products/
  
  let finalUrl;
  
  // Si le chemin commence par "uploads/" et contient "public/"
  if (s.startsWith("uploads/") && s.includes("public/")) {
    finalUrl = `${API_HOST}/${s}`;
  }
  // Si c'est juste un nom de fichier
  else if (!s.includes("/")) {
    finalUrl = `${API_HOST}/uploads/public/${s}`;
  }
  // Si le chemin commence par "uploads/" mais sans "public/"
  else if (s.startsWith("uploads/")) {
    finalUrl = `${API_HOST}/${s}`;
  }
  // Pour les autres cas
  else {
    finalUrl = `${API_HOST}/uploads/public/${s}`;
  }
  
  console.log("Final image URL:", finalUrl);
  return finalUrl;
};

// 3) util: calcule le prix promo
const calcPromo = (price, discount) => {
  const p = Number(price);
  const d = Number(discount);
  if (!Number.isFinite(p) || !Number.isFinite(d)) return "";
  const promoPrice = p - (p * d) / 100;
  return promoPrice.toFixed(2);
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    promo: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [imageError, setImageError] = useState(false); // Nouvel état pour gérer les erreurs
  const localPreviewRef = useRef(null);

  // 🔄 Récupération des données produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${URL.GET_PRODUCT}/${id}`);
        const doc = res.data || {};
        console.log("DOC from API", doc);

        const { name, description, price, promo } = doc;
        const existingDiscount =
          Number.isFinite(Number(doc.discount)) ? String(doc.discount) : "";

        const derivedDiscount =
          Number(price) && Number(promo)
            ? (((Number(price) - Number(promo)) / Number(price)) * 100).toFixed(2)
            : existingDiscount;

        setForm({
          name: name ?? "",
          description: description ?? "",
          price: price ?? "",
          promo: promo ?? "",
          discount: derivedDiscount,
          image: null,
        });

        // Aperçu depuis la BDD: images[0] prioritaire, sinon champ legacy image/picture
        const firstImage =
          Array.isArray(doc.images) && doc.images.length ? doc.images[0] : null;
        const legacy = doc.image || doc.picture || null;

        const imageToUse = firstImage || legacy;
        console.log("Image from DB:", imageToUse);

        if (imageToUse) {
          const u = resolveImageUrl(imageToUse);
          setPreview(u);
          setImageError(false);
          console.log("Preview URL (db) =", u);
        } else {
          setPreview(null);
          console.log("No image found in database");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du produit", err?.response?.data || err);
      }
    };

    fetchProduct();

    return () => {
      if (localPreviewRef.current) {
        globalThis.URL.revokeObjectURL(localPreviewRef.current);
        localPreviewRef.current = null;
      }
    };
  }, [id]);

  // 📝 Gestion des changements
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));

      if (localPreviewRef.current) {
        globalThis.URL.revokeObjectURL(localPreviewRef.current);
        localPreviewRef.current = null;
      }
      
      const localUrl = globalThis.URL.createObjectURL(file);
      localPreviewRef.current = localUrl;
      setPreview(localUrl);
      setImageError(false);
      console.log("Preview URL (local) =", localUrl);
      return;
    }

    if (name === "price" || name === "discount") {
      const updated = { ...form, [name]: value };
      updated.promo = calcPromo(updated.price, updated.discount);
      setForm(updated);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Gestionnaire d'erreur d'image corrigé (sans new URL())
  const handleImageError = (e) => {
    console.warn("Image failed to load:", e.currentTarget.src);
    setImageError(true);
    
    const currentSrc = e.currentTarget.src;
    
    // Extraire le nom du fichier depuis l'URL actuelle
    const filename = currentSrc.split('/').pop();
    
    // Essayer différentes variantes d'URL
    const fallbackUrls = [
      `${API_HOST}/uploads/${filename}`,           // uploads direct
      `${API_HOST}/uploads/public/products/${filename}`, // uploads/public/products
      `${API_HOST}/products/${filename}`,         // products alias
      `${API_HOST}/${filename}`,                  // A la racine
    ];
    
    // Essayer la première URL de fallback qui n'a pas encore été testée
    const nextFallback = fallbackUrls.find(fallbackUrl => fallbackUrl !== currentSrc);
    
    if (nextFallback && !imageError) {
      console.log("Trying fallback URL:", nextFallback);
      setPreview(nextFallback);
    }
  };

  // 💾 Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("promo", form.promo);
      fd.append("discount", form.discount);
      if (form.image) fd.append("image", form.image);

      await axios.put(`${URL.UPDATE_PRODUCT}/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (localPreviewRef.current) {
        globalThis.URL.revokeObjectURL(localPreviewRef.current);
        localPreviewRef.current = null;
      }

      navigate("/admin/products");
    } catch (err) {
      console.error("Update error", err?.response?.data || err.message || err);
      alert("Erreur lors de la mise à jour du produit.");
    }
  };

  return (
    <div className="admin-form-container">
      <h2>✏️ Edit a product</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="admin-form">
        <label>
          Product name :
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Description :
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>

        <label>
          Price £:
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
        </label>

        <label>
          Discount (%):
          <input name="discount" type="number" step="0.01" value={form.discount} onChange={handleChange} />
        </label>

        <label>
          Promo price £:
          <input name="promo" type="number" step="0.01" value={form.promo} readOnly />
        </label>

        <label>
          Picture :
          <input name="image" type="file" accept="image/*" onChange={handleChange} />
        </label>

        {/* Affichage de l'image avec gestion d'erreur améliorée */}
        {preview && !imageError ? (
          <div style={{ marginTop: 10 }}>
            <img
              src={preview}
              alt="Aperçu"
              width="220"
              style={{ borderRadius: 10, display: "block" }}
              onError={handleImageError}
              onLoad={() => console.log("Image loaded successfully:", preview)}
            />
            <a href={preview} target="_blank" rel="noreferrer">Ouvrir l'image</a>
            <p style={{ fontSize: 12, color: "#666", marginTop: 5 }}>
              URL: {preview}
            </p>
          </div>
        ) : preview && imageError ? (
          <div style={{ marginTop: 10 }}>
            <div
              style={{
                width: 220, height: 140, borderRadius: 10,
                display: "grid", placeItems: "center",
                border: "2px solid #ff6b6b", fontSize: 12, color: "#ff6b6b",
                backgroundColor: "#ffe0e0"
              }}
            >
              ❌ Image introuvable
            </div>
            <p style={{ fontSize: 12, color: "#ff6b6b", marginTop: 5 }}>
              URL tentée: {preview}
            </p>
          </div>
        ) : (
          <div
            style={{
              width: 220, height: 140, marginTop: 10, borderRadius: 10,
              display: "grid", placeItems: "center",
              border: "1px dashed #aaa", fontSize: 12, color: "#666",
            }}
          >
            Pas d'image pour ce produit
          </div>
        )}

        <button type="submit" className="btn-save">💾 Save changes</button>
      </form>
      
      {/* Section de débogage - à retirer en production */}
      <div style={{ marginTop: 20, padding: 10, backgroundColor: "#f5f5f5", fontSize: 12 }}>
        <strong>Debug info:</strong>
        <br />Preview: {preview || "null"}
        <br />Image Error: {imageError ? "true" : "false"}
        <br />API Host: {API_HOST}
      </div>
    </div>
  );
};

export default EditProduct;