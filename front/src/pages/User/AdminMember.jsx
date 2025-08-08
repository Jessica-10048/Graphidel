import React, { useEffect, useState } from 'react';
import axios from 'axios';
import URL from '../../utils/constants/url';
import { useNavigate } from 'react-router';

const AdminMember = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMembers = async () => {
    try {
      const res = await axios.get(URL.GET_ALL_USER);
      setMembers(res.data);
    } catch (error) {
      console.error("❌ Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("❗ Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${URL.DELETE_USER}/${id}`);
      setMembers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">👥 Manage Members</h2>

      {loading ? (
        <p>Loading...</p>
      ) : members.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className={`btn btn-sm ${user.role === 'admin' ? 'btn-success' : 'btn-secondary'}`}
                    disabled
                  >
                    {user.role}
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => handleDelete(user._id)}
                  >
                    🗑 Delete
                  </button>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => navigate(`/admin/user/update/${user._id}`)}
                  >
                    ✏️ Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMember;
