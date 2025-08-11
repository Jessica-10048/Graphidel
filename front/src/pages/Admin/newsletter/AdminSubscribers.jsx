import { useEffect, useState } from "react";
import axios from "axios";
import URL from "../../../utils/constants/url";

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);

  const fetchSubscribers = () => {
    axios.get(URL.GET_ALL_SUBSCRIBERS)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setSubscribers(res.data);
        } else {
          console.error("Unexpected response format:", res.data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = (id) => {
    // if (window.confirm("Delete this subscriber?")) {
    //   axios.delete(`http://localhost:8000/api/newsletter/subscriber/${id}`)
    //     .then(() => fetchSubscribers())
    //     .catch((err) => console.error(err));
    // }
  };

  const handleExport = () => {
    const csv = [
      ["Email", "Date"],
      ...subscribers.map(s => [s.email, new Date(s.subscribedAt).toLocaleString()])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 Subscribers 
          <span className="badge bg-secondary ms-2">{subscribers.length}</span>
        </h2>

        {/* {subscribers.length > 0 && (
          <button onClick={handleExport} className="btn btn-outline-secondary">
            📤 Export CSV
          </button> 
         )} */}
      </div>

      {subscribers.length === 0 ? (
        <p>No subscribers yet.</p>
      ) : (
        <ul className="list-group">
          {subscribers.map((s) => (
            <li key={s._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
               
                <div>
                  <strong>{s.email}</strong><br />
                  <small className="text-muted">🕒 {new Date(s.subscribedAt).toLocaleString()}</small>
                </div>
              </div>

              <button onClick={() => handleDelete(s._id)} className="btn btn-sm btn-danger">
                ❌ Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminSubscribers;
