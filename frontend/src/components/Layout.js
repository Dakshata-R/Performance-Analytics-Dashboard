import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => (
  <div className="layout">
    <Sidebar />
    <main className="main">{children}</main>
  </div>
);

export default Layout;
