import { NavLink, Outlet } from 'react-router-dom';
import { MdDashboard, MdListAlt, MdAddCircleOutline, MdPieChart, MdAccountBalanceWallet, MdMonetizationOn, MdDeleteForever } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useTransactions from '../hooks/useTransactions';
import { toast } from 'react-toastify';

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

  const { resetApp } = useTransactions();

  const handleReset = () => {
    if (window.confirm('Are you ABSOLUTELY sure you want to delete all transactions and reset your budget? This action cannot be undone.')) {
      resetApp();
      toast.info('App successfully reset to default metrics.');
    }
  };

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

      <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <button className="nav-link text-danger" onClick={handleReset} style={{ width: '100%', justifyContent: 'flex-start' }} title="Clear all data">
          <MdDeleteForever size={20} />
          <span>Factory Reset</span>
        </button>
      </div>

    </aside>
  );
};

export default Layout;
