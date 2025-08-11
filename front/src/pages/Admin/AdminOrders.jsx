import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import URL from '../../utils/constants/url';

// Helpers
const currencyFmt = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
const normalizeStatus = (s) => (s || '').toString().trim();
const isPending   = (s) => normalizeStatus(s).toLowerCase() === 'pending';
const isProcessed = (s) => normalizeStatus(s).toLowerCase() === 'processed';
const isShipped   = (s) => normalizeStatus(s).toLowerCase() === 'shipped';

const statusClass = (s) => {
  const v = normalizeStatus(s).toLowerCase();
  if (v === 'pending') return 'bg-warning text-dark';
  if (v === 'processed') return 'bg-info text-dark';
  if (v === 'shipped') return 'bg-success';
  return 'bg-secondary';
};

const dateFmt = (d) =>
  d ? new Date(d).toLocaleString('fr-FR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }) : '—';

// Fallbacks lignes produits
const getLines = (order) =>
  order?.orders ??
  order?.items ??
  order?.products ??
  order?.meta?.items ??
  [];

const getLineLabel = (line) => line?.name ?? line?.title ?? line?.productName ?? 'Product';
const getLineQty   = (line) => Number(line?.quantity ?? line?.qty ?? 0);
const getLinePrice = (line) => Number(line?.price ?? line?.unitPrice ?? 0);

// Total
const getTotal = (order) => {
  if (order?.totalAmount != null) return Number(order.totalAmount);
  const lines = getLines(order);
  return lines.reduce((sum, l) => sum + getLinePrice(l) * getLineQty(l), 0);
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await axios.get(URL.GET_ALL_ORDER, { signal: controller.signal });
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setOrders(data);
      } catch (e) {
        if (axios.isCancel(e)) return;
        console.error('Error loading orders:', e);
        setErr('Unable to load orders.');
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await axios.put(`${URL.UPDATE_ORDER}/${id}`, { status: newStatus });
      const updatedOrder = res.data?.order || res.data;
      setOrders(prev => prev.map(o => (o._id === id ? { ...o, ...updatedOrder } : o)));
    } catch (e) {
      console.error('Error updating order status:', e);
      alert('The status update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const sortedOrders = useMemo(() => {
    const copy = [...orders];
    copy.sort((a, b) => {
      // Tri : Pending en premier, puis Processed, puis Shipped
      if (isPending(a.status) && !isPending(b.status)) return -1;
      if (!isPending(a.status) && isPending(b.status)) return 1;
      if (isProcessed(a.status) && isShipped(b.status)) return -1;
      if (isShipped(a.status) && isProcessed(b.status)) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return copy;
  }, [orders]);

  if (loading) return <p className="text-center mt-5">Loading orders...</p>;
  if (err) return <div className="alert alert-danger my-5 text-center">{err}</div>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">📦 Order List</h2>

      {sortedOrders.length === 0 ? (
        <div className="alert alert-info text-center">No orders at this time.</div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered table-hover align-middle" style={{ fontSize: '1rem' }}>
            <thead className="table-dark text-center">
              <tr>
                <th className="px-3">ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Address</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Products</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map(order => {
                const lines = getLines(order);
                const total = getTotal(order);

                return (
                  <tr key={order._id} style={{ verticalAlign: 'middle' }}>
                    <td className="small px-3">{order._id}</td>
                    <td>{order.email || 'Not provided'}</td>

                    <td>
                      <strong>{order.customer?.lastName || '—'}</strong><br />
                      <span>{order.customer?.firstName || ''}</span>
                    </td>

                    <td>
                      <div>{order.customer?.address || '—'}</div>
                      <small className="text-muted">
                        {order.customer?.postalCode || ''}
                        {order.customer?.city ? ` • ${order.customer.city}` : ''}
                      </small>
                    </td>

                    <td className="text-end">{currencyFmt.format(total)}</td>

                    <td className="text-center">
                      <span className={`badge rounded-pill px-3 py-2 ${statusClass(order.status)}`}>
                        {normalizeStatus(order.status) || 'Pending'}
                      </span>
                    </td>

                    <td>{dateFmt(order.createdAt)}</td>

                    <td>
                      <ul className="list-unstyled mb-0">
                        {lines.map((item, idx) => {
                          const qty = getLineQty(item);
                          const price = getLinePrice(item);
                          return (
                            <li key={idx} className="mb-1">
                              <span className="badge bg-primary me-1">{qty}×</span>
                              {getLineLabel(item)}
                              <span className="badge bg-light text-dark float-end border">
                                {currencyFmt.format(price * qty)}
                              </span>
                            </li>
                          );
                        })}
                        {lines.length === 0 && <li className="text-muted">—</li>}
                      </ul>
                    </td>

                    <td className="text-center">
                      {/* Pending → bouton Processed */}
                      {isPending(order.status) && (
                        <button
                          className="btn btn-sm btn-outline-info me-2"
                          onClick={() => {
                            if (window.confirm('Mark this order as Processed?')) {
                              handleUpdateStatus(order._id, 'Processed');
                            }
                          }}
                          disabled={updatingId === order._id}
                        >
                          {updatingId === order._id ? 'Updating…' : 'Mark as processed'}
                        </button>
                      )}

                      {/* Processed → bouton Shipped */}
                      {isProcessed(order.status) && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => {
                            if (window.confirm('Mark this order as Shipped?')) {
                              handleUpdateStatus(order._id, 'Shipped');
                            }
                          }}
                          disabled={updatingId === order._id}
                        >
                          {updatingId === order._id ? 'Updating…' : 'Mark as shipped'}
                        </button>
                      )}

                      {/* Shipped → juste une icône */}
                      {isShipped(order.status) && <span className="text-muted">✓ Sent</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
