import React, { useEffect, useState } from 'react';
import API from '../utils/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    API.get('/users').then(({ data }) => { setUsers(data); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (id) => {
    await API.patch(`/users/${id}/status`);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  if (loading) return <div className="loading-page"><span className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">User Management</h2>
        <p className="page-subtitle">Manage all registered users</p>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {u.name[0].toUpperCase()}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-warning'}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleStatus(u._id)}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6}><div className="empty-state"><p>No users found</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;