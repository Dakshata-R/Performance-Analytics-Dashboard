import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import ScoreBar from '../components/ScoreBar';

const MyPerformance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '' });

  const fetchData = () => {
    const params = {};
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.category) params.category = filters.category;
    API.get('/performance', { params }).then(({ data }) => { setRecords(data); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, []);

  const categories = [...new Set(records.map(r => r.category))];

  if (loading) return <div className="loading-page"><span className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">My Performance</h2>
        <p className="page-subtitle">Your performance history and records</p>
      </div>

      <div className="filters">
        <div className="form-group">
          <label className="form-label">From</label>
          <input type="date" className="form-control" value={filters.startDate}
            onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">To</label>
          <input type="date" className="form-control" value={filters.endDate}
            onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-control" value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn btn-ghost" onClick={fetchData}>Apply</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Score</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r._id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(r.date).toLocaleDateString()}</td>
                  <td><span className="badge badge-primary">{r.category}</span></td>
                  <td style={{ minWidth: 180 }}><ScoreBar score={r.score} /></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{r.remarks || '—'}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={4}><div className="empty-state"><div className="icon">◈</div><p>No records assigned yet</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPerformance;
