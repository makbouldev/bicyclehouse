import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { PRODUCTS, MOCK_ORDERS } from './data/products';
import AdminDashboard from './components/AdminDashboard';
import './index.css';
import './App.css';

function AdminApp() {
  // Local Database States (backed by localStorage)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('bh_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('bh_orders');
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  // Admin Authentication State (tab-session persistent)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('bh_admin_logged') === 'true';
  });

  // Persist products to localStorage
  useEffect(() => {
    localStorage.setItem('bh_products', JSON.stringify(products));
  }, [products]);

  // Persist orders to localStorage
  useEffect(() => {
    localStorage.setItem('bh_orders', JSON.stringify(orders));
  }, [orders]);

  return (
    <div className="min-h-screen py-4 px-3 px-lg-5" style={{ backgroundColor: '#FCFCFC' }}>
      <AdminDashboard 
        products={products}
        setProducts={setProducts}
        orders={orders}
        setOrders={setOrders}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('admin-root')).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
