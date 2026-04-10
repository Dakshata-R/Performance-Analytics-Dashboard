import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import ScoreBar from '../components/ScoreBar';

const CATEGORIES = ['Technical', 'Communication', 'Leadership', 'Teamwork', 'Productivity', 'Creativity', 'Punctuality'];

const emptyForm = { userId: '', category: '', score: '', date: '', remarks: '' };

const Performance = () => {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '' });

  const fetchAll = () => {
    const params = {};
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.category) params.category = filters.category;
    API.get('/performance', { params }).then(({ data }) => { setRecords(data); setLoading(false); });
  };

  useEffect(() => {
    API.get('/users').then(({ data }) => setUsers(data));
    fetchAll();
  }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setError(''); setShowModal(true); };
  const openEdit = (r) => {
    setForm({ userId: r.userId._id, category: r.category, score: r.score, date: r.date?.slice(0, 10), remarks: r.remarks || '' });
    setEditId(r._id); setError(''); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await API.put(`/performance/${editId}`, form);
      else await API.post('/performance', form);
      setShowModal(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    await API.delete(`/performance/${id}`);
    fetchAll();
  };

  if (loading) return <div className="loading-page"><span className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Performance Data</h2>
        <p className="page-subtitle">Add and manage performance records</p>
      </div>

      <div className="filters">
        <div className="form-group">
          <label className="form-label">From Date</label>
          <input type="date" className="form-control" value={filters.startDate}
            onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">To Date</label>
          <input type="date" className="form-control" value={filters.endDate}
            onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-control" value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn btn-ghost" onClick={fetchAll}>Apply</button>
        <button className="btn btn-ghost" onClick={() => { setFilters({ startDate: '', endDate: '', category: '' }); setTimeout(fetchAll, 50); }}>Reset</button>
      </div>

      <div className="action-bar">
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{records.length} records</span>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Record</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Category</th>
                <th>Score</th>
                <th>Date</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r._id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500 }}>{r.userId?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.userId?.email}</div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{r.category}</span></td>
                  <td style={{ minWidth: 160 }}><ScoreBar score={r.score} /></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(r.date).toLocaleDateString()}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 200 }}>{r.remarks || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-ghost" onClick={() => openEdit(r)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={6}><div className="empty-state"><div className="icon">◈</div><p>No records found</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{editId ? 'Edit Record' : 'Add Performance Record'}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">User</label>
                <select className="form-control" required value={form.userId}
                  onChange={e => setForm({ ...form, userId: e.target.value })}>
                  <option value="">Select User</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" required value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="">Select</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Score (0–100)</label>
                  <input type="number" className="form-control" required min="0" max="100"
                    value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" required value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Remarks</label>
                <input type="text" className="form-control" placeholder="Optional notes..."
                  value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Add Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;