import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import URL from "../../../utils/constants/url";

const AdminNewsletterEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [currentPicture, setCurrentPicture] = useState(null);
  const [newPicture, setNewPicture] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios.get(`${URL.GET_NEWSLETTER}/${id}`)
      .then((res) => {
        setSubject(res.data.subject);
        setMessage(res.data.message);
        setCurrentPicture(res.data.picture);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("message", message);
    if (newPicture) formData.append("picture", newPicture);

    axios.put(`${URL.UPDATE_NEWSLETTER}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        setSuccess("✅ Newsletter successfully updated!");
        setTimeout(() => navigate("/admin/newsletter"), 1000);
      })
      .catch(() => setSuccess("❌ Failed to update newsletter."));
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "750px" }}>
      <div className="card shadow-lg border-0">
        <div className="card-header bg-light text-dark text-center py-3">
          <h3 className="mb-0">✏️ Edit Newsletter</h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>

            {/* Subject */}
            <div className="mb-4">
              <label className="form-label fw-bold">📝 Subject</label>
              <input
                type="text"
                className="form-control"
                placeholder="Newsletter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            {/* Message */}
            <div className="mb-4">
              <label className="form-label fw-bold">💬 Message</label>
              <textarea
                className="form-control"
                rows="6"
                placeholder="Newsletter content"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            {/* Current image */}
            {currentPicture && (
              <div className="mb-4">
                <label className="form-label fw-bold">🖼️ Current Image</label>
                <div className="text-center">
                  <img
                    src={`http://localhost:8000/uploads/${currentPicture}`}
                    alt="Newsletter"
                    className="img-thumbnail rounded shadow-sm"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                </div>
              </div>
            )}

            {/* Replace image */}
            <div className="mb-4">
              <label className="form-label fw-bold">🔁 Replace Image (optional)</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setNewPicture(e.target.files[0])}
              />
            </div>

            {/* Submit button */}
            <div className="d-grid">
              <button className="btn btn-success btn-lg">
                💾 Save Changes
              </button>
            </div>

            {/* Status message */}
            {success && (
              <div className="alert alert-info mt-4 text-center">
                {success}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletterEdit;
