import React, { useEffect, useState } from 'react';
import axios from 'axios';
import URL from '../../utils/constants/url';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(URL.GET_ALL_ORDER);
        setOrders(response.data);
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`${URL.UPDATE_ORDER}/${id}`, { status: newStatus });
      const updatedOrder = response.data;

      setOrders(prev =>
        prev.map(order => order._id === id ? updatedOrder : order)
      );
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading orders...</p>;

  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === 'Processed' && b.status !== 'Processed') return 1;
    if (a.status !== 'Processed' && b.status === 'Processed') return -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">📦 Order List</h2>

      {sortedOrders.length === 0 ? (
        <div className="alert alert-info text-center">No orders at the moment.</div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered table-hover align-middle" style={{ fontSize: '1rem' }}>
            <thead className="table-dark text-center">
              <tr>
                <th className="px-3">ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Address</th>
                <th>Total ($)</th>
                <th>Status</th>
                <th>Date</th>
                <th>Products</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map(order => (
                <tr key={order._id} style={{ verticalAlign: 'middle' }}>
                  <td className="small px-3">{order._id}</td>
                  <td>{order.email || 'Not provided'}</td>

                  <td>
                    <strong>{order.customer?.lastName}</strong><br />
                    <span>{order.customer?.firstName}</span>
                  </td>

                  <td>
                    <div>{order.customer?.address}</div>
                    <small className="text-muted">{order.customer?.postalCode}</small>
                  </td>

                  <td className="text-end">${order.totalAmount?.toFixed(2) || '0.00'}</td>

                  <td className="text-center">
                    <span className={`badge rounded-pill px-3 py-2 ${order.status === 'Processed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {order.status}
                    </span>
                  </td>

                  <td>{new Date(order.createdAt).toLocaleString()}</td>

                  <td>
                    <ul className="list-unstyled mb-0">
                      {order.orders?.map((item, idx) => (
                        <li key={idx} className="mb-1">
                          <span className="badge bg-primary me-1">{item.quantity}×</span>
                          {item.name}
                          <span className="badge bg-light text-dark float-end border">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="text-center">
                    {order.status !== 'Processed' ? (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleUpdateStatus(order._id, 'Processed')}
                      >
                        Mark as processed
                      </button>
                    ) : (
                      <span className="text-muted">✓ Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
