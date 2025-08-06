import { useEffect, useState } from "react";
import { Link } from "react-router"; // ✅ Corrigé ici aussi
import axios from "axios";
import URL from "../../../utils/constants/url";

const AdminNewsletter = () => {
  const [newsletters, setNewsletters] = useState([]);

  const fetchNewsletters = () => {
    axios.get(URL.GET_ALL_NEWSLETTER)
      .then(res => setNewsletters(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this newsletter?")) {
      axios.delete(`${URL.DELETE_NEWSLETTER}/${id}`)
        .then(() => fetchNewsletters())
        .catch(err => console.error(err));
    }
  };

 return (
  <div className="container mt-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>📬 All Newsletters</h2>

      <div className="d-flex gap-2">
        {/* Lien vers la page des abonnés */}
        <Link to="/admin/subscribers" className="btn btn-outline-primary">
          👥 Subscribers
        </Link>

        {/* Lien vers la création d'une newsletter */}
        <Link to="/admin/newsletter/add" className="btn btn-outline-success">
          ➕ New Newsletter
        </Link>
      </div>
    </div>

    {newsletters.length === 0 ? (
      <p>No newsletters available yet.</p>
    ) : (
      <ul className="list-group">
        {newsletters.map((n) => (
          <li
            key={n._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center gap-3">
              <img
                src={`http://localhost:8000/uploads/${n.picture || "default-picture.jpg"}`}
                alt="Newsletter"
                style={{
                  width: "80px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
              <div>
                <strong>{n.subject}</strong>
                <br />
                <small className="text-muted">
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              </div>
            </div>

            <div>
              <Link
                to={`/admin/newsletter/edit/${n._id}`}
                className="btn btn-sm btn-warning me-2"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={() => handleDelete(n._id)}
                className="btn btn-sm btn-danger"
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);
};

export default AdminNewsletter;
