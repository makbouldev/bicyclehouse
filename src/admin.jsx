import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { PRODUCTS, MOCK_ORDERS } from './data/products';
import AdminDashboard from './components/AdminDashboard';
import './index.css';
import './App.css';

// Import Firebase database config
import { db, isFirebaseConfigured } from './firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';

function AdminApp() {
  // Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(isFirebaseConfigured);

  // Admin Authentication State (tab-session persistent)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('bh_admin_logged') === 'true';
  });

  // Sync state data from Firestore or LocalStorage
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // LocalStorage mode fallback
      const savedProducts = localStorage.getItem('bh_products');
      setProducts(savedProducts ? JSON.parse(savedProducts) : PRODUCTS);

      const savedOrders = localStorage.getItem('bh_orders');
      setOrders(savedOrders ? JSON.parse(savedOrders) : MOCK_ORDERS);

      const savedCategories = localStorage.getItem('bh_categories');
      setCategories(savedCategories ? JSON.parse(savedCategories) : [
        { id: 'les-pneu', name: 'les pneu' },
        { id: 'les-gidon', name: 'les gidon' },
        { id: 'les-selle', name: 'les selle' },
        { id: 'les-potonce', name: 'les potonce' },
        { id: 'les-frein', name: 'les frein' },
        { id: 'les-accesoires', name: 'les accesoires' }
      ]);
      return;
    }

    // Firebase Firestore mode active
    setIsDataLoading(true);

    // 1. Sync Categories with Seeding if empty
    const unsubCategories = onSnapshot(collection(db, 'categories'), async (snapshot) => {
      let catsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (snapshot.empty) {
        console.log("Firestore categories are empty. Seeding defaults...");
        const defaultCats = [
          { id: 'les-pneu', name: 'les pneu' },
          { id: 'les-gidon', name: 'les gidon' },
          { id: 'les-selle', name: 'les selle' },
          { id: 'les-potonce', name: 'les potonce' },
          { id: 'les-frein', name: 'les frein' },
          { id: 'les-accesoires', name: 'les accesoires' }
        ];

        // Seed Categories
        for (const cat of defaultCats) {
          await setDoc(doc(db, 'categories', cat.id), { name: cat.name });
        }

        // Seed Products
        for (const prod of PRODUCTS) {
          await setDoc(doc(db, 'products', prod.id.toString()), {
            title: prod.title,
            brand: prod.brand,
            category: prod.category,
            categoryLabel: prod.categoryLabel,
            price: prod.price,
            oldPrice: prod.oldPrice,
            discount: prod.discount,
            image: prod.image,
            images: prod.images || [prod.image],
            description: prod.description || '',
            isSoldOut: prod.isSoldOut || false,
            rating: prod.rating || 5.0,
            reviewsCount: prod.reviewsCount || 0,
            variants: prod.variants || null
          });
        }

        // Seed Mock Orders
        for (const order of MOCK_ORDERS) {
          await setDoc(doc(db, 'orders', order.id.toString()), order);
        }

        console.log("Seeding complete!");
      } else {
        setCategories(catsList);
      }
    });

    // 2. Sync Products
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const prodsList = snapshot.docs.map(doc => ({ id: isNaN(doc.id) ? doc.id : Number(doc.id), ...doc.data() }));
        setProducts(prodsList);
      }
    });

    // 3. Sync Orders
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({ id: isNaN(doc.id) ? doc.id : Number(doc.id), ...doc.data() }));
      ordersList.sort((a, b) => b.id - a.id);
      setOrders(ordersList);
      setIsDataLoading(false);
    });

    return () => {
      unsubCategories();
      unsubProducts();
      unsubOrders();
    };
  }, []);

  // Write state modifications back to local storage when in fallback mode
  useEffect(() => {
    if (!isFirebaseConfigured && products.length > 0) {
      localStorage.setItem('bh_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (!isFirebaseConfigured && orders.length > 0) {
      localStorage.setItem('bh_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (!isFirebaseConfigured && categories.length > 0) {
      localStorage.setItem('bh_categories', JSON.stringify(categories));
    }
  }, [categories]);

  return (
    <div className="min-h-screen py-4 px-3 px-lg-5" style={{ backgroundColor: '#FCFCFC' }}>
      {isDataLoading && (
        <div className="position-fixed w-100 h-100 top-0 start-0 bg-white bg-opacity-75 d-flex justify-content-center align-items-center" style={{ zIndex: 2000 }}>
          <div className="spinner-border text-orange" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}
      <AdminDashboard 
        products={products}
        setProducts={setProducts}
        orders={orders}
        setOrders={setOrders}
        categories={categories}
        setCategories={setCategories}
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
