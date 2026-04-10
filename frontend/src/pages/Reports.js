import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get('/reports/summary'), API.get('/performance')])
      .then(([s, r]) => { setSummary(s.data); setRecords(r.data); setLoading(false); });
  }, []);

  const exportCSV = () => {
    const headers = ['Date', 'User', 'Category', 'Score', 'Remarks'];
    const rows = records.map(r => [
      new Date(r.date).toLocaleDateString(),
      r.userId?.name || '',
      r.category,
      r.score,
      r.remarks || ''
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `performance_report_${Date.now()}.csv`; a.click();
  };

  const exportPDF = () => {
    window.print();
  };

  if (loading) return <div className="loading-page"><span className="spinner" /></div>;

  const radarData = summary?.categoryStats?.map(c => ({ subject: c.category, A: parseFloat(c.avgScore) }));

  return (
    <div>
      <div className="action-bar">
        <div>
          <h2 className="page-title">Reports</h2>
          <p className="page-subtitle">Performance summary and exports</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={exportCSV}>⬇ Export CSV</button>
          <button className="btn btn-ghost" onClick={exportPDF}>⬇ Export PDF</button>
        </div>
      </div>

      {summary && (
        <>
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card blue">
              <div className="stat-label">Total Records</div>
              <div className="stat-value">{summary.totalRecords}</div>
            </div>
            <div className="stat-card teal">
              <div className="stat-label">Overall Average</div>
              <div className="stat-value">{summary.avgScore}</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Top Category</div>
              <div className="stat-value" style={{ fontSize: 18, marginTop: 8 }}>
                {summary.categoryStats.sort((a,b) => b.avgScore - a.avgScore)[0]?.category || '—'}
              </div>
            </div>
          </div>

          <div className="grid-2">
            {radarData?.length > 0 && (
              <div className="card">
                <div className="card-title">Category Radar</div>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#252b3b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#7a8099', fontSize: 12 }} />
                    <Radar name="Score" dataKey="A" stroke="#4f7ef8" fill="#4f7ef8" fillOpacity={0.2} />
                    <Tooltip contentStyle={{ background: '#1a1e2a', border: '1px solid #252b3b', borderRadius: 8 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="card">
              <div className="card-title">Category Breakdown</div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Avg Score</th>
                      <th>Records</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.categoryStats.map(c => (
                      <tr key={c.category}>
                        <td><span className="badge badge-primary">{c.category}</span></td>
                        <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: '#4f7ef8' }}>{c.avgScore}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{c.count}</td>
                      </tr>
                    ))}
                    {summary.categoryStats.length === 0 && (
                      <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No data</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
