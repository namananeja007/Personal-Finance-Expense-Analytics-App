import { NavLink, Outlet } from 'react-router-dom';
import { MdDashboard, MdListAlt, MdAddCircleOutline, MdPieChart, MdAccountBalanceWallet, MdMonetizationOn } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <MdDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <MdListAlt size={20} /> },
    { name: 'Add Transaction', path: '/transactions/new', icon: <MdAddCircleOutline size={20} /> },
    { name: 'Budget', path: '/budget', icon: <MdAccountBalanceWallet size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <MdPieChart size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <MdMonetizationOn size={32} className="text-primary" />
        <h2>FinTrack</h2>
      </div>
      <nav className="nav-menu">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Layout;
