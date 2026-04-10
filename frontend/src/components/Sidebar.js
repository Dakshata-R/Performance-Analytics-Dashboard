import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const userLinks = [
    { path: '/dashboard', icon: '▦', label: 'Dashboard' },
    { path: '/my-performance', icon: '◈', label: 'My Performance' },
    { path: '/reports', icon: '⊞', label: 'Reports' },
  ];

  const adminLinks = [
    { path: '/dashboard', icon: '▦', label: 'Dashboard' },
    { path: '/users', icon: '◎', label: 'Users' },
    { path: '/performance', icon: '◈', label: 'Performance Data' },
    { path: '/reports', icon: '⊞', label: 'Reports' },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Performance<br /><span>Insights</span></h1>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <button key={l.path} className={isActive(l.path)} onClick={() => navigate(l.path)}>
            <span className="icon">{l.icon}</span>
            {l.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button className="nav-link" style={{ marginTop: 8 }} onClick={logout}>
          <span className="icon">⤴</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
