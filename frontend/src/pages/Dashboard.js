import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell
} from 'recharts';

const COLORS = ['#4f7ef8', '#22d3b8', '#f5a623', '#f05d5e', '#a855f7', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1e2a', border: '1px solid #252b3b', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#7a8099', fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#e8eaf2', fontWeight: 600, fontFamily: 'JetBrains Mono' }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/reports/summary').then(({ data }) => {
      setSummary(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><span className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-subtitle">
          {user.role === 'admin' ? 'Overview of all performance data' : `Welcome back, ${user.name}`}
        </p>
      </div>

      {summary && (
        <>
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-label">Total Records</div>
              <div className="stat-value">{summary.totalRecords}</div>
              <div className="stat-sub">Performance entries</div>
            </div>
            <div className="stat-card teal">
              <div className="stat-label">Average Score</div>
              <div className="stat-value">{summary.avgScore}</div>
              <div className="stat-sub">Out of 100</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-label">Categories</div>
              <div className="stat-value">{summary.categoryStats.length}</div>
              <div className="stat-sub">Tracked areas</div>
            </div>
          </div>

          <div className="grid-2">
            {summary.categoryStats.length > 0 && (
              <div className="card">
                <div className="card-title">Performance by Category</div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={summary.categoryStats} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#252b3b" />
                    <XAxis dataKey="category" tick={{ fill: '#7a8099', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#7a8099', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
                      {summary.categoryStats.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {summary.monthlyStats.length > 0 && (
              <div className="card">
                <div className="card-title">Monthly Trend</div>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={summary.monthlyStats} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#252b3b" />
                    <XAxis dataKey="month" tick={{ fill: '#7a8099', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#7a8099', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="avgScore" stroke="#4f7ef8" strokeWidth={2} dot={{ fill: '#4f7ef8', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {summary.categoryStats.length === 0 && (
            <div className="card">
              <div className="empty-state">
                <div className="icon">◈</div>
                <p>No performance data yet. {user.role === 'admin' ? 'Add records to see analytics.' : 'Ask your admin to add performance data.'}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
