import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import URL from "../../../utils/constants/url";

const AdminNewsletterAdd = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [picture, setPicture] = useState(null); // 🖼️ nouvelle image
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("message", message);
    if (picture) formData.append("picture", picture);

    axios.post(URL.CREATE_NEWSLETTER, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        setSuccess("✅ Newsletter successfully created!");
        setSubject("");
        setMessage("");
        setPicture(null);

        setTimeout(() => {
          navigate("/admin/newsletter");
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setSuccess("❌ An error occurred while creating the newsletter.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow border-0">
        <div className="card-body">
          <h2 className="card-title text-center mb-4 text-primary">
            ➕ Create a Newsletter
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Subject</label>
              <input
                type="text"
                className="form-control"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Back to School Info"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Message</label>
              <textarea
                className="form-control"
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your newsletter content here..."
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Picture (optional)</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setPicture(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? "Saving..." : "✅ Save"}
            </button>

            {success && (
              <div className="alert alert-info mt-4 text-center" role="alert">
                {success}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletterAdd;
