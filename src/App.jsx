import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  MessageSquare, 
  User, 
  Search, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight, 
  ArrowLeft, 
  Check, 
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Send,
  CheckCircle,
  HelpCircle,
  Info,
  LayoutGrid
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';

// Import subcomponents
import Promobar from './components/Promobar';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import ProductGrid from './components/ProductGrid';
import AdminDashboard from './components/AdminDashboard';

// Import mock data
import { PRODUCTS, CATEGORIES, MOCK_ORDERS } from './data/products';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

function App() {
  // Navigation & Page State
  const [currentView, setView] = useState('shop'); // 'shop', 'checkout', 'blog', 'about', 'contact', 'faqs'
  
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

  // Compute dynamic category counts
  const dynamicCategories = [
    { id: 'all', name: 'Toutes les catégories', count: products.length },
    { id: 'les-pneu', name: 'les pneu', count: products.filter(p => p.category === 'les-pneu').length },
    { id: 'les-gidon', name: 'les gidon', count: products.filter(p => p.category === 'les-gidon').length },
    { id: 'les-selle', name: 'les selle', count: products.filter(p => p.category === 'les-selle').length },
    { id: 'les-potonce', name: 'les potonce', count: products.filter(p => p.category === 'les-potonce').length },
    { id: 'les-frein', name: 'les frein', count: products.filter(p => p.category === 'les-frein').length },
    { id: 'les-accesoires', name: 'les accesoires', count: products.filter(p => p.category === 'les-accesoires').length }
  ];

  // Filtering & Catalog State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Cart State
  const [cart, setCart] = useState([]);
  
  // UI Panels / Modals
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});

  // Reset active image index and initialize variants when selected product changes
  useEffect(() => {
    setActiveImageIndex(0);
    if (selectedProduct && selectedProduct.variants) {
      const initial = {};
      selectedProduct.variants.forEach((v) => {
        const firstOpt = v.options[0];
        initial[v.name] = firstOpt.hasOwnProperty('value') ? firstOpt.value : firstOpt;
      });
      setSelectedVariants(initial);
    } else {
      setSelectedVariants({});
    }
  }, [selectedProduct]);
  
  // Toast notifications
  const [toast, setToast] = useState(null);

  // Checkout Wizard State
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Review, 2: Shipping & Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'card'
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: ''
  });
  
  // FAQs Accordion State
  const [openFaqId, setOpenFaqId] = useState(null);



  // Contact form submission state
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // On mount: Check URL for product parameter and set initial modal state + popstate listener
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productSlug = params.get('product');
    if (productSlug) {
      const prod = products.find(p => slugify(p.title) === productSlug);
      if (prod) {
        setSelectedProduct(prod);
      }
    }

    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const currentProductSlug = currentParams.get('product');
      if (currentProductSlug) {
        const prod = products.find(p => slugify(p.title) === currentProductSlug);
        setSelectedProduct(prod || null);
      } else {
        setSelectedProduct(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  // Sync selectedProduct state changes with the URL search parameters (?product=slug)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentProductSlug = params.get('product');

    if (selectedProduct) {
      const targetSlug = slugify(selectedProduct.title);
      if (currentProductSlug !== targetSlug) {
        const url = new URL(window.location);
        url.searchParams.set('product', targetSlug);
        window.history.pushState({}, '', url);
      }
    } else {
      if (currentProductSlug !== null) {
        const url = new URL(window.location);
        url.searchParams.delete('product');
        window.history.pushState({}, '', url);
      }
    }
  }, [selectedProduct]);

  // Scroll to top of the page on view or category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView, activeCategory]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Cart Operations
  const handleAddToCart = (product, variants = {}) => {
    if (product.isSoldOut) {
      showToast('Désolé, ce produit est épuisé !', 'danger');
      return;
    }

    // Default variants if none selected (e.g. from shop grid directly)
    const defaultVariants = {};
    if (product.variants) {
      product.variants.forEach((v) => {
        const firstOpt = v.options[0];
        defaultVariants[v.name] = firstOpt.hasOwnProperty('value') ? firstOpt.value : firstOpt;
      });
    }
    const finalVariants = Object.keys(variants).length > 0 ? variants : defaultVariants;
    
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => {
        if (item.product.id !== product.id) return false;
        const itemVars = item.selectedVariants || {};
        return Object.entries(finalVariants).every(([key, value]) => itemVars[key] === value);
      });

      if (existingItem) {
        showToast(`Quantité augmentée pour ${product.title}`);
        return prevCart.map((item) => {
          const itemVars = item.selectedVariants || {};
          const isMatch = item.product.id === product.id && 
            Object.entries(finalVariants).every(([key, value]) => itemVars[key] === value);
          
          return isMatch 
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
      } else {
        showToast(`Ajouté au panier : ${product.title}`);
        return [...prevCart, { product, quantity: 1, selectedVariants: finalVariants }];
      }
    });
  };

  const handleUpdateQty = (productId, delta, selectedVariants = {}) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        const itemVars = item.selectedVariants || {};
        const isMatch = item.product.id === productId && 
          Object.entries(selectedVariants).every(([key, value]) => itemVars[key] === value);
        
        if (isMatch) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleRemoveFromCart = (productId, selectedVariants = {}) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((item) => {
        const itemVars = item.selectedVariants || {};
        return item.product.id === productId && 
          Object.entries(selectedVariants).every(([key, value]) => itemVars[key] === value);
      });
      if (itemToRemove) {
        showToast(`Retiré du panier : ${itemToRemove.product.title}`, 'warning');
      }
      return prevCart.filter((item) => {
        const itemVars = item.selectedVariants || {};
        const isMatch = item.product.id === productId && 
          Object.entries(selectedVariants).every(([key, value]) => itemVars[key] === value);
        return !isMatch;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);


  // Filter & Sort Products
  const getFilteredProducts = () => {
    let result = [...products];

    // Search query filter (checks title, brand, category)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) => 
          p.title.toLowerCase().includes(query) || 
          p.brand.toLowerCase().includes(query) ||
          p.categoryLabel.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Sort order
    if (sortBy === 'popularity') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  };

  const filteredProducts = getFilteredProducts();

  // Checkout operations
  const handleCheckoutFormChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Votre panier est vide', 'danger');
      return;
    }

    const getFrenchDate = () => {
      const date = new Date();
      const months = ['Janv', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
      const day = String(date.getDate()).padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day} ${month} ${year}, ${hours}:${minutes}`;
    };

    const newOrder = {
      id: Date.now(),
      date: getFrenchDate(),
      customer: {
        fullName: checkoutForm.fullName,
        phone: checkoutForm.phone,
        city: checkoutForm.city,
        address: checkoutForm.address
      },
      items: cart.map(item => ({
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          image: item.product.image,
          brand: item.product.brand
        },
        quantity: item.quantity,
        selectedVariants: item.selectedVariants
      })),
      total: cartTotal + (cartTotal >= 600 ? 0 : 35),
      status: 'En attente'
    };

    setOrders(prev => [newOrder, ...prev]);

    // Process to Step 3 (Success)
    setCheckoutStep(3);
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
    showToast('Commande validée avec succès !');
  };

  const handleResetCheckout = () => {
    clearCart();
    setCheckoutStep(1);
    setView('shop');
    setCheckoutForm({
      fullName: '',
      phone: '',
      city: '',
      address: ''
    });
  };



  return (
    <div className="min-h-screen d-flex flex-column" style={{ backgroundColor: '#FCFCFC' }}>
      {/* Promobar */}
      <Promobar />

      {/* Main Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (currentView !== 'shop') setView('shop');
        }}
        cartItemsCount={cartItemsCount}
        cartTotal={cartTotal}
        onCartClick={() => setCartOpen(true)}
        setView={(v) => {
          setView(v);
          setMobileSidebarOpen(false);
          setMobileMenuOpen(false);
        }}
        currentView={currentView}
        onMobileMenuToggle={() => setMobileMenuOpen(prev => !prev)}
      />

      {/* Floating System-Wide Toast Notifications */}
      {toast && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100, marginTop: '70px' }}>
          <div 
            className={`toast show align-items-center text-white bg-${toast.type === 'danger' ? 'danger' : toast.type === 'warning' ? 'warning' : 'dark'} border-0 shadow-lg`} 
            role="alert" 
            style={{ borderRadius: '50px', padding: '0.4rem 1.2rem' }}
          >
            <div className="d-flex align-items-center gap-2">
              {toast.type === 'danger' ? (
                <X size={16} />
              ) : toast.type === 'warning' ? (
                <Info size={16} />
              ) : (
                <Check size={16} className="text-success" />
              )}
              <div className="toast-body fw-bold py-2" style={{ fontSize: '0.85rem' }}>
                {toast.message}
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white ms-auto" 
                onClick={() => setToast(null)}
                style={{ fontSize: '0.65rem' }}
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Backdrop menu */}
      {mobileMenuOpen && (
        <div 
          className="position-fixed w-100 h-100 bg-black bg-opacity-50"
          style={{ zIndex: 1040, top: 0, left: 0 }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="bg-white h-100 w-75 p-4 shadow-lg d-flex flex-column gap-3 animation-slide-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold fs-5 text-orange">Menu</span>
              <button className="btn-close" onClick={() => setMobileMenuOpen(false)}></button>
            </div>
            <button 
              onClick={() => { setView('shop'); setMobileMenuOpen(false); }}
              className={`btn btn-link text-start text-dark text-decoration-none fw-bold border-bottom pb-2 ${currentView === 'shop' ? 'text-orange' : ''}`}
            >
              Boutique
            </button>

            <button 
              onClick={() => { setView('about'); setMobileMenuOpen(false); }}
              className={`btn btn-link text-start text-dark text-decoration-none fw-bold border-bottom pb-2 ${currentView === 'about' ? 'text-orange' : ''}`}
            >
              À Propos
            </button>
            <button 
              onClick={() => { setView('contact'); setMobileMenuOpen(false); }}
              className={`btn btn-link text-start text-dark text-decoration-none fw-bold border-bottom pb-2 ${currentView === 'contact' ? 'text-orange' : ''}`}
            >
              Contactez-Nous
            </button>
            <button 
              onClick={() => { setView('faqs'); setMobileMenuOpen(false); }}
              className={`btn btn-link text-start text-dark text-decoration-none fw-bold border-bottom pb-2 ${currentView === 'faqs' ? 'text-orange' : ''}`}
            >
              FAQs
            </button>
          </div>
        </div>
      )}

      {/* Main Container Wrapper */}
      <main className="flex-grow-1 container-fluid px-3 px-lg-5 py-4 pb-5">
        
        {/* CONDITIONAL ROUTING FOR VIEWS */}
        
        {/* Admin Dashboard view */}
        {currentView === 'admin' && (
          <AdminDashboard 
            products={products}
            setProducts={setProducts}
            orders={orders}
            setOrders={setOrders}
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
          />
        )}
        
        {/* 1. SHOP VIEW */}
        {currentView === 'shop' && (
          <div>
            <HeroBanner activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={dynamicCategories} />
            
            <div className="row g-4 mt-2">
              {/* Sidebar Filters */}
              <div className="col-lg-3 d-none d-lg-block">
                <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={dynamicCategories} />
              </div>

              {/* Mobile Sidebar Modal */}
              {mobileSidebarOpen && (
                <div 
                  className="position-fixed w-100 h-100 bg-black bg-opacity-50"
                  style={{ zIndex: 1050, top: 0, left: 0 }}
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <div 
                    className="bg-white h-100 p-4 shadow-lg d-flex flex-column position-absolute end-0"
                    style={{ width: '280px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold m-0">Filtres</h5>
                      <button className="btn-close" onClick={() => setMobileSidebarOpen(false)}></button>
                    </div>
                    <Sidebar 
                      activeCategory={activeCategory} 
                      setActiveCategory={setActiveCategory} 
                      onClose={() => setMobileSidebarOpen(false)}
                      categories={dynamicCategories}
                    />
                  </div>
                </div>
              )}

              {/* Main Product Catalog */}
              <div className="col-lg-9">
                <Toolbar
                  filteredCount={filteredProducts.length}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onSidebarToggle={() => setMobileSidebarOpen(true)}
                />
                
                <ProductGrid
                  products={filteredProducts}
                  onAddToCart={handleAddToCart}
                  onProductClick={(p) => setSelectedProduct(p)}
                  viewMode={viewMode}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            </div>
          </div>
        )}


        {/* 3. CHECKOUT VIEW */}
        {currentView === 'checkout' && (
          <div className="py-3">
            <h1 className="h2 fw-bold text-center mb-4" style={{ fontFamily: 'var(--pk-font-heading)' }}>
              Passer la Commande
            </h1>

            {/* Steps Nav */}
            <div className="d-flex justify-content-center align-items-center gap-3 gap-md-4 mb-5">
              <div className="d-flex align-items-center gap-2">
                <div className={`checkout-step ${checkoutStep === 1 ? 'active' : checkoutStep > 1 ? 'completed' : ''}`}>
                  {checkoutStep > 1 ? <Check size={14} /> : 1}
                </div>
                <span className="fw-bold d-none d-md-inline" style={{ fontSize: '0.9rem' }}>Vérification</span>
              </div>
              <div style={{ height: '2px', width: '30px', backgroundColor: '#E9ECEF' }}></div>
              <div className="d-flex align-items-center gap-2">
                <div className={`checkout-step ${checkoutStep === 2 ? 'active' : checkoutStep > 2 ? 'completed' : ''}`}>
                  {checkoutStep > 2 ? <Check size={14} /> : 2}
                </div>
                <span className="fw-bold d-none d-md-inline" style={{ fontSize: '0.9rem' }}>Livraison & Paiement</span>
              </div>
              <div style={{ height: '2px', width: '30px', backgroundColor: '#E9ECEF' }}></div>
              <div className="d-flex align-items-center gap-2">
                <div className={`checkout-step ${checkoutStep === 3 ? 'active' : ''}`}>3</div>
                <span className="fw-bold d-none d-md-inline" style={{ fontSize: '0.9rem' }}>Confirmation</span>
              </div>
            </div>

            {/* STEP 1: REVIEW CART ITEMS */}
            {checkoutStep === 1 && (
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="bg-white border rounded-3 p-4 shadow-sm text-start">
                    <h4 className="fw-bold mb-4">Votre Panier</h4>
                    {cart.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-muted">Votre panier est actuellement vide.</p>
                        <button onClick={() => setView('shop')} className="btn btn-primary rounded-pill">
                          Retourner à la boutique
                        </button>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-borderless align-middle">
                          <thead>
                            <tr className="border-bottom text-muted" style={{ fontSize: '0.85rem' }}>
                              <th>Produit</th>
                              <th>Prix</th>
                              <th className="text-center">Quantité</th>
                              <th className="text-end">Total</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {cart.map((item, idx) => (
                              <tr key={`${item.product.id}-${idx}`} className="border-bottom">
                                <td>
                                  <div className="d-flex align-items-center gap-3 py-2">
                                    <div className="border rounded p-1" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                                      <img 
                                        src={item.product.image} 
                                        alt={item.product.title} 
                                        className="w-100 h-100 object-fit-contain" 
                                      />
                                    </div>
                                    <div>
                                      <h6 className="mb-0 fw-semibold text-truncate" style={{ maxWidth: '200px' }} title={item.product.title}>
                                        {item.product.title}
                                      </h6>
                                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                                        <div className="text-muted" style={{ fontSize: '0.72rem', lineHeight: '1.2' }}>
                                          {Object.entries(item.selectedVariants).map(([key, val]) => (
                                            <span key={key} className="me-2 d-inline-block">
                                              <strong>{key}:</strong> {val}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      <small className="text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>
                                        {item.product.brand}
                                      </small>
                                    </div>
                                  </div>
                                </td>
                                <td>{item.product.price} DH</td>
                                <td>
                                  <div className="d-flex justify-content-center align-items-center gap-2">
                                    <button 
                                      onClick={() => handleUpdateQty(item.product.id, -1, item.selectedVariants)}
                                      className="btn btn-outline-secondary btn-sm p-1 rounded-circle d-flex"
                                    >
                                      <Minus size={12} />
                                    </button>
                                    <span className="fw-bold px-2">{item.quantity}</span>
                                    <button 
                                      onClick={() => handleUpdateQty(item.product.id, 1, item.selectedVariants)}
                                      className="btn btn-outline-secondary btn-sm p-1 rounded-circle d-flex"
                                    >
                                      <Plus size={12} />
                                    </button>
                                  </div>
                                </td>
                                <td className="text-end fw-semibold">{item.product.price * item.quantity} DH</td>
                                <td className="text-end">
                                  <button 
                                    onClick={() => handleRemoveFromCart(item.product.id, item.selectedVariants)}
                                    className="btn btn-link text-muted p-0"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Checkout Summary */}
                <div className="col-lg-4">
                  <div className="bg-white border rounded-3 p-4 shadow-sm text-start">
                    <h4 className="fw-bold mb-4">Récapitulatif</h4>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Sous-total</span>
                      <span className="fw-semibold">{cartTotal} DH</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Livraison</span>
                      <span>
                        {cartTotal >= 600 ? (
                          <strong className="text-success">Gratuit</strong>
                        ) : (
                          '35 DH'
                        )}
                      </span>
                    </div>
                    {cartTotal < 600 && (
                      <div className="alert alert-warning py-2 px-3 mb-4" style={{ fontSize: '0.78rem' }}>
                        Ajoutez <strong>{600 - cartTotal} DH</strong> pour bénéficier de la <strong>livraison gratuite</strong> !
                      </div>
                    )}
                    <hr />
                    <div className="d-flex justify-content-between mb-4 mt-3">
                      <span className="fw-bold fs-5">Total à payer</span>
                      <span className="fw-bold fs-5 text-orange">
                        {cartTotal + (cartTotal >= 600 ? 0 : 35)} DH
                      </span>
                    </div>
                    <button 
                      onClick={() => setCheckoutStep(2)}
                      className="btn btn-primary w-100 rounded-pill py-2.5 d-flex align-items-center justify-content-center gap-2"
                      disabled={cart.length === 0}
                    >
                      <span>Continuer la commande</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING AND PAYMENT FORM */}
            {checkoutStep === 2 && (
              <form onSubmit={handleCheckoutSubmit} className="text-start">
                <div className="row g-4">
                  {/* Left Column: Address Form */}
                  <div className="col-lg-8">
                    <div className="bg-white border rounded-3 p-4 shadow-sm">
                      <h4 className="fw-bold mb-4">Détails de Livraison</h4>
                      
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold">Nom Complet <span className="text-danger">*</span></label>
                          <input 
                            type="text" 
                            name="fullName"
                            required
                            className="form-control"
                            value={checkoutForm.fullName}
                            onChange={handleCheckoutFormChange}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold">Téléphone <span className="text-danger">*</span></label>
                          <input 
                            type="tel" 
                            name="phone"
                            placeholder="0612345678"
                            required
                            className="form-control"
                            value={checkoutForm.phone}
                            onChange={handleCheckoutFormChange}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold">Ville <span className="text-danger">*</span></label>
                          <input 
                            type="text" 
                            name="city"
                            placeholder="Votre ville (ex: Casablanca, Marrakech...)"
                            required
                            className="form-control"
                            value={checkoutForm.city}
                            onChange={handleCheckoutFormChange}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold">Adresse Complète <span className="text-danger">*</span></label>
                          <input 
                            type="text" 
                            name="address"
                            placeholder="Numéro de rue, Quartier, Appartement..."
                            required
                            className="form-control"
                            value={checkoutForm.address}
                            onChange={handleCheckoutFormChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment methods - Cash on Delivery only */}
                    <div className="bg-white border rounded-3 p-4 shadow-sm mt-4">
                      <h4 className="fw-bold mb-3">Mode de Paiement</h4>
                      <div className="border rounded-3 p-3 bg-light bg-opacity-50">
                        <div className="fw-bold text-success mb-1">Paiement à la livraison (Cash on Delivery)</div>
                        <small className="text-muted">Payez en espèces à l'agent de livraison dès réception de votre colis. Simple et 100% sécurisé.</small>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary Checkout Bar */}
                  <div className="col-lg-4">
                    <div className="bg-white border rounded-3 p-4 shadow-sm sticky-top" style={{ top: '100px', zIndex: 10 }}>
                      <h4 className="fw-bold mb-4">Votre Commande</h4>
                      
                      <div className="max-h-200 overflow-y-auto mb-3">
                        {cart.map((item, idx) => (
                          <div key={`${item.product.id}-${idx}`} className="d-flex align-items-center justify-content-between mb-3 text-start">
                            <div className="d-flex align-items-center gap-2.5">
                              <div className="border rounded p-0.5" style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                                <img src={item.product.image} alt={item.product.title} className="w-100 h-100 object-fit-contain" />
                              </div>
                              <div>
                                <div className="small fw-bold text-truncate" style={{ maxWidth: '160px' }}>{item.product.title}</div>
                                {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                                  <div className="text-muted" style={{ fontSize: '0.65rem', lineHeight: '1.2' }}>
                                    {Object.entries(item.selectedVariants).map(([key, val]) => (
                                      <span key={key} className="me-1.5 d-inline-block">
                                        {key}: {val}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <small className="text-muted">{item.quantity} x {item.product.price} DH</small>
                              </div>
                            </div>
                            <span className="small fw-semibold">{item.product.price * item.quantity} DH</span>
                          </div>
                        ))}
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between mb-2 mt-3">
                        <span className="text-muted">Sous-total</span>
                        <span>{cartTotal} DH</span>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">Livraison</span>
                        <span>{cartTotal >= 600 ? 'Gratuit' : '35 DH'}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-4 pt-2 border-top">
                        <span className="fw-bold">Total à payer</span>
                        <span className="fw-bold text-orange fs-5">
                          {cartTotal + (cartTotal >= 600 ? 0 : 35)} DH
                        </span>
                      </div>

                      <button 
                        type="submit"
                        className="btn btn-primary w-100 rounded-pill py-2.5 d-flex align-items-center justify-content-center gap-2"
                      >
                        <CheckCircle size={18} />
                        <span>Confirmer la Commande</span>
                      </button>
                      
                      <button 
                        type="button" 
                        onClick={() => setCheckoutStep(1)} 
                        className="btn btn-link text-dark w-100 text-decoration-none mt-2 d-flex align-items-center justify-content-center gap-1.5"
                        style={{ fontSize: '0.85rem' }}
                      >
                        <ArrowLeft size={14} />
                        <span>Retour à l'étape précédente</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: SUCCESS STATE */}
            {checkoutStep === 3 && (
              <div className="max-w-600 mx-auto bg-white border rounded-3 p-5 shadow-sm text-center my-4">
                <div className="d-inline-flex bg-success bg-opacity-10 text-success rounded-circle p-4 mb-4">
                  <Check size={48} className="fw-bold" />
                </div>
                
                <h2 className="fw-bold mb-2">Merci pour votre commande !</h2>
                <p className="text-muted">Votre commande a été enregistrée avec succès. Un conseiller vous contactera par téléphone pour confirmer la livraison.</p>
                
                <div className="border rounded-3 p-4 bg-light my-4 text-start">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Résumé du reçu</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Client :</span>
                    <span className="fw-semibold">{checkoutForm.fullName}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Téléphone :</span>
                    <span className="fw-semibold">{checkoutForm.phone}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Adresse de livraison :</span>
                    <span className="fw-semibold text-end" style={{ maxWidth: '280px' }}>{checkoutForm.address}, {checkoutForm.city}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Mode de paiement :</span>
                    <span className="fw-semibold">Espèces à la livraison (CoD)</span>
                  </div>
                  <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                    <span className="fw-bold">Montant total :</span>
                    <span className="fw-bold text-orange fs-5">{cartTotal + (cartTotal >= 600 ? 0 : 35)} DH</span>
                  </div>
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <button onClick={handleResetCheckout} className="btn btn-primary rounded-pill px-4 py-2">
                    Continuer mes achats
                  </button>
                  <button onClick={() => setView('faqs')} className="btn btn-outline-dark rounded-pill px-4 py-2">
                    Des questions sur la livraison ?
                  </button>
                </div>
              </div>
            )}
          </div>
        )}



        {/* 5. ABOUT US VIEW */}
        {currentView === 'about' && (
          <div className="py-3 text-start max-w-900 mx-auto">
            <div className="d-flex align-items-center gap-2 mb-4">
              <button onClick={() => setView('shop')} className="btn btn-outline-dark rounded-circle p-2 d-inline-flex">
                <ArrowLeft size={16} />
              </button>
              <h1 className="h2 fw-bold m-0" style={{ fontFamily: 'var(--pk-font-heading)' }}>
                À Propos de BICYCLE HOUSE
              </h1>
            </div>

            <div className="bg-white border rounded-3 p-4 p-md-5 shadow-sm mb-4">
              <h3 className="fw-bold mb-3 text-orange">Notre Mission</h3>
              <p className="lead text-muted">
                Faciliter l'accès aux pièces de rechange de vélo de haute qualité partout au Maroc. Que vous soyez cycliste urbain, passionné de VTT dans l'Atlas, ou coureur sur route, nous vous fournissons le meilleur matériel livré à votre porte sous 24/48h.
              </p>
              
              <div className="row g-4 my-4">
                <div className="col-6 col-md-3 text-center">
                  <h2 className="fw-extrabold text-orange mb-1">5K+</h2>
                  <div className="small text-muted fw-bold">Commandes Livrées</div>
                </div>
                <div className="col-6 col-md-3 text-center">
                  <h2 className="fw-extrabold text-orange mb-1">98%</h2>
                  <div className="small text-muted fw-bold">Satisfaction Client</div>
                </div>
                <div className="col-6 col-md-3 text-center">
                  <h2 className="fw-extrabold text-orange mb-1">24h</h2>
                  <div className="small text-muted fw-bold">Délai d'Expédition</div>
                </div>
                <div className="col-6 col-md-3 text-center">
                  <h2 className="fw-extrabold text-orange mb-1">7j/7</h2>
                  <div className="small text-muted fw-bold">Support Client</div>
                </div>
              </div>

              <hr />

              <h4 className="fw-bold mt-4 mb-3">Pourquoi nous choisir ?</h4>
              <div className="row g-4 mt-1">
                <div className="col-md-4">
                  <div className="d-flex flex-column gap-2">
                    <div className="text-orange"><CheckCircle size={28} /></div>
                    <h5 className="fw-bold mb-1">100% Original</h5>
                    <p className="small text-muted">Toutes nos pièces de marques Shimano, Zéfal, KMC et Maxxis sont 100% d'origine, en boîte constructeur.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex flex-column gap-2">
                    <div className="text-orange"><MapPin size={28} /></div>
                    <h5 className="fw-bold mb-1">Livraison Nationale</h5>
                    <p className="small text-muted">Nous livrons dans tout le Maroc (villes et provinces) en partenariat avec les meilleurs transporteurs.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex flex-column gap-2">
                    <div className="text-orange"><Phone size={28} /></div>
                    <h5 className="fw-bold mb-1">Service Technique</h5>
                    <p className="small text-muted">Nos mécaniciens experts vérifient et s'assurent de la compatibilité de vos pièces sur simple appel.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. CONTACT US VIEW */}
        {currentView === 'contact' && (
          <div className="py-3 text-start max-w-900 mx-auto">
            <div className="d-flex align-items-center gap-2 mb-4">
              <button onClick={() => setView('shop')} className="btn btn-outline-dark rounded-circle p-2 d-inline-flex">
                <ArrowLeft size={16} />
              </button>
              <h1 className="h2 fw-bold m-0" style={{ fontFamily: 'var(--pk-font-heading)' }}>
                Contactez-Nous
              </h1>
            </div>

            <div className="row g-4">
              <div className="col-md-5">
                <div className="bg-white border rounded-3 p-4 shadow-sm h-100">
                  <h4 className="fw-bold mb-4">Nos Coordonnées</h4>
                  
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex gap-3">
                      <div className="text-orange mt-1"><Phone size={20} /></div>
                      <div>
                        <div className="fw-bold">Téléphone / WhatsApp</div>
                        <a href="tel:+2126123456789" className="text-decoration-none text-dark">+2126123456789</a>
                        <div className="small text-muted">Lundi - Samedi, 9h à 19h</div>
                      </div>
                    </div>

                    <div className="d-flex gap-3">
                      <div className="text-orange mt-1"><Mail size={20} /></div>
                      <div>
                        <div className="fw-bold">E-mail</div>
                        <a href="mailto:contact@gmail.com" className="text-decoration-none text-dark">contact@gmail.com</a>
                        <div className="small text-muted">Réponse sous 24 heures</div>
                      </div>
                    </div>

                    <div className="d-flex gap-3">
                      <div className="text-orange mt-1"><MapPin size={20} /></div>
                      <div>
                        <div className="fw-bold">Adresse du Stock / Boutique</div>
                        <p className="mb-0 text-muted">Boulevard Zerktouni, Casablanca, Maroc</p>
                        <small className="text-muted">(Retrait en magasin possible sur RDV)</small>
                      </div>
                    </div>

                    <div className="d-flex gap-3">
                      <div className="text-orange mt-1"><Clock size={20} /></div>
                      <div>
                        <div className="fw-bold">Horaires</div>
                        <p className="mb-0 text-muted">Boutique en ligne : 24h/7j</p>
                        <p className="mb-0 text-muted">Support client : 9h00 - 19h00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message form */}
              <div className="col-md-7">
                <div className="bg-white border rounded-3 p-4 shadow-sm h-100">
                  <h4 className="fw-bold mb-4">Envoyez-nous un message</h4>
                  
                  {contactSubmitted ? (
                    <div className="text-center py-5">
                      <div className="d-inline-flex bg-success bg-opacity-10 text-success rounded-circle p-3 mb-3">
                        <Check size={32} />
                      </div>
                      <h5 className="fw-bold">Message Envoyé !</h5>
                      <p className="text-muted px-4">Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.</p>
                      <button 
                        onClick={() => { setContactSubmitted(false); }} 
                        className="btn btn-outline-dark btn-sm rounded-pill px-3"
                      >
                        Envoyer un autre message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                      confetti({ particleCount: 50, spread: 60 });
                      showToast('Votre message a été envoyé !');
                    }}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-semibold">Nom Complet *</label>
                          <input type="text" required className="form-control" />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-semibold">E-mail *</label>
                          <input type="email" required className="form-control" />
                        </div>
                        <div className="col-12">
                          <label className="form-label small fw-semibold">Sujet *</label>
                          <input type="text" required className="form-control" />
                        </div>
                        <div className="col-12">
                          <label className="form-label small fw-semibold">Votre Message *</label>
                          <textarea rows="4" required className="form-control" placeholder="Bonjour, je souhaiterais savoir si le dérailleur Shimano Deore M6100 est compatible avec..."></textarea>
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2">
                            <Send size={16} />
                            <span>Envoyer le Message</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. FAQS VIEW */}
        {currentView === 'faqs' && (
          <div className="py-3 text-start max-w-800 mx-auto">
            <div className="d-flex align-items-center gap-2 mb-4">
              <button onClick={() => setView('shop')} className="btn btn-outline-dark rounded-circle p-2 d-inline-flex">
                <ArrowLeft size={16} />
              </button>
              <h1 className="h2 fw-bold m-0" style={{ fontFamily: 'var(--pk-font-heading)' }}>
                Foire Aux Questions (FAQs)
              </h1>
            </div>

            <div className="d-flex flex-column gap-3">
              {[
                {
                  id: 1,
                  q: "Quels sont les délais de livraison au Maroc ?",
                  a: "Nous expédions toutes les commandes passées avant 15h00 le jour même. Les délais de livraison varient de 24 à 48 heures pour les grandes villes (Casablanca, Rabat, Marrakech, Agadir, Fès, Tanger) et jusqu'à 72 heures pour les zones plus éloignées."
                },
                {
                  id: 2,
                  q: "Comment bénéficier de la livraison gratuite ?",
                  a: "La livraison est 100% gratuite pour toute commande supérieure ou égale à 600 DH. Pour toute commande d'un montant inférieur, des frais fixes de 35 DH s'appliquent pour couvrir le coût du transport."
                },
                {
                  id: 3,
                  q: "Quels sont les modes de paiement acceptés ?",
                  a: "Nous acceptons le paiement en espèces lors de la livraison (Cash on Delivery) à votre domicile. Nous acceptons également le paiement sécurisé par carte bancaire marocaine ou internationale directement en ligne lors de la validation de votre commande."
                },
                {
                  id: 4,
                  q: "Puis-je retourner une pièce qui n'est pas compatible ?",
                  a: "Oui. Vous disposez d'un délai de 7 jours après réception de votre commande pour demander un échange ou un remboursement. Le produit doit être retourné inutilisé, dans son emballage d'origine scellé et en parfait état de revente."
                },
                {
                  id: 5,
                  q: "Comment être sûr que la pièce de rechange est compatible avec mon vélo ?",
                  a: "Nous vous invitons à lire attentivement la fiche technique du produit. En cas de doute, vous pouvez contacter notre support technique via WhatsApp au +2126123456789. Indiquez la marque, le modèle et le nombre de vitesses de votre vélo pour une réponse rapide."
                }
              ].map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="border rounded-3 bg-white shadow-sm overflow-hidden">
                    <button 
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="btn w-100 text-start py-3 px-4 fw-bold d-flex justify-content-between align-items-center border-0"
                      style={{ fontSize: '1rem', color: isOpen ? 'var(--pk-orange)' : '#000' }}
                    >
                      <span>{faq.q}</span>
                      <ChevronRight 
                        size={18} 
                        style={{ 
                          transform: isOpen ? 'rotate(90deg)' : 'none', 
                          transition: 'transform 0.2s ease',
                          color: isOpen ? 'var(--pk-orange)' : 'var(--pk-medium-grey)'
                        }} 
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3 pt-1 border-top text-muted small-line-height" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="bg-light border rounded-3 p-4 mt-5 text-center">
              <HelpCircle size={28} className="text-orange mb-2" />
              <h5 className="fw-bold mb-1">Vous n'avez pas trouvé de réponse à votre question ?</h5>
              <p className="text-muted small">Notre service client est à votre disposition pour vous guider.</p>
              <button onClick={() => setView('contact')} className="btn btn-sm btn-outline-dark rounded-pill px-3">
                Nous contacter
              </button>
            </div>
          </div>
        )}
      </main>

      {/* OFF-CANVAS CART DRAWER (NATIVE BOOTSTRAP 5) */}
      <div 
        className={`offcanvas offcanvas-end ${cartOpen ? 'show' : ''}`} 
        tabIndex="-1" 
        style={{ 
          visibility: cartOpen ? 'visible' : 'hidden', 
          zIndex: 1060, 
          transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          maxWidth: '420px',
          width: '100%'
        }}
      >
        <div className="offcanvas-header border-bottom py-3">
          <h5 className="offcanvas-title fw-bold d-flex align-items-center gap-2">
            <ShoppingCart size={20} className="text-orange" />
            <span>Mon Panier ({cartItemsCount})</span>
          </h5>
          <button type="button" className="btn-close" onClick={() => setCartOpen(false)}></button>
        </div>
        
        <div className="offcanvas-body d-flex flex-column p-4 text-start">
          {cart.length === 0 ? (
            <div className="text-center my-auto py-5">
              <ShoppingBag size={48} className="text-muted mb-3" />
              <h5 className="fw-bold">Votre panier est vide</h5>
              <p className="text-muted small px-3">Découvrez nos pièces détachées et accessoires de vélo de qualité pour commencer vos achats.</p>
              <button 
                onClick={() => { setCartOpen(false); setView('shop'); }} 
                className="btn btn-primary btn-sm rounded-pill px-4 mt-2"
              >
                Visiter la boutique
              </button>
            </div>
          ) : (
            <>
              {/* Cart items list */}
              <div className="flex-grow-1 overflow-y-auto pe-1" style={{ maxHeight: 'calc(100vh - 320px)' }}>
                {cart.map((item, idx) => (
                  <div key={`${item.product.id}-${idx}`} className="cart-item">
                    <div className="border rounded p-1" style={{ width: '64px', height: '64px', flexShrink: 0 }}>
                      <img src={item.product.image} alt={item.product.title} className="w-100 h-100 object-fit-contain" />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-title" title={item.product.title}>{item.product.title}</div>
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <div className="text-muted mb-1" style={{ fontSize: '0.72rem', lineHeight: '1.2' }}>
                          {Object.entries(item.selectedVariants).map(([key, val]) => (
                            <span key={key} className="me-2 d-inline-block">
                              <strong>{key}:</strong> {val}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="fw-bold text-orange" style={{ fontSize: '0.85rem' }}>{item.product.price} DH</div>
                      
                      <div className="cart-item-qty">
                        <button 
                          onClick={() => handleUpdateQty(item.product.id, -1, item.selectedVariants)}
                          className="qty-btn"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="small fw-bold px-1">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQty(item.product.id, 1, item.selectedVariants)}
                          className="qty-btn"
                        >
                          <Plus size={10} />
                        </button>
 
                        <button 
                          onClick={() => handleRemoveFromCart(item.product.id, item.selectedVariants)}
                          className="btn btn-link text-danger p-0 ms-auto text-decoration-none"
                          style={{ fontSize: '0.72rem' }}
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal & delivery target info */}
              <div className="border-top pt-4 mt-auto">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Sous-total :</span>
                  <span className="fw-bold">{cartTotal} DH</span>
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted small">Frais de livraison :</span>
                  <span className="fw-semibold">
                    {cartTotal >= 600 ? <span className="text-success">Gratuit</span> : '35 DH'}
                  </span>
                </div>

                {cartTotal < 600 ? (
                  <div className="alert alert-light border p-2 mb-4" style={{ fontSize: '0.75rem' }}>
                    🚴 Ajoutez <strong>{600 - cartTotal} DH</strong> pour la <strong>livraison gratuite</strong>.
                  </div>
                ) : (
                  <div className="alert alert-success border p-2 mb-4 text-center" style={{ fontSize: '0.75rem' }}>
                    🎉 Votre commande est éligible pour la <strong>livraison gratuite</strong> !
                  </div>
                )}

                <div className="d-flex justify-content-between border-top pt-3 mb-4">
                  <span className="fw-bold fs-5">Total estimé :</span>
                  <span className="fw-bold text-orange fs-5">{cartTotal + (cartTotal >= 600 ? 0 : 35)} DH</span>
                </div>

                <div className="d-flex flex-column gap-2">
                  <button 
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutStep(1);
                      setView('checkout');
                    }}
                    className="btn btn-primary w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-1.5"
                  >
                    <span>Valider ma commande</span>
                    <ChevronRight size={16} />
                  </button>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="btn btn-outline-dark w-100 rounded-pill py-2"
                  >
                    Continuer mes achats
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {cartOpen && (
        <div 
          className="offcanvas-backdrop fade show" 
          style={{ zIndex: 1050 }}
          onClick={() => setCartOpen(false)}
        ></div>
      )}

      {/* QUICK VIEW DETAILS MODAL */}
      {selectedProduct && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="modal-header border-bottom px-4 py-3 bg-light">
                <h5 className="modal-title fw-bold text-orange" style={{ fontSize: '1.1rem' }}>Fiche Produit</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedProduct(null)}></button>
              </div>
              <div className="modal-body p-4 text-start">
                <div className="row g-4">
                  {/* Left Column: Image Gallery */}
                  <div className="col-md-5 d-flex flex-column gap-3">
                    <div className="d-flex align-items-center justify-content-center border rounded-3 p-4 bg-white" style={{ minHeight: '280px' }}>
                      <div style={{ width: '100%', height: '240px', position: 'relative' }}>
                        {(() => {
                          const currentImg = (selectedProduct.images && selectedProduct.images.length > 0)
                            ? selectedProduct.images[activeImageIndex]
                            : selectedProduct.image;
                          return (
                            <img 
                              src={currentImg} 
                              alt={selectedProduct.title} 
                              className="w-100 h-100 object-fit-contain"
                              onError={(e) => {
                                e.target.src = '/bicyclehouse/hero.png';
                              }}
                            />
                          );
                        })()}
                      </div>
                    </div>
                    {/* Thumbnails row */}
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                      <div className="d-flex gap-2 justify-content-center flex-wrap">
                        {selectedProduct.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className="btn p-0 border rounded overflow-hidden"
                            style={{ 
                              width: '55px', 
                              height: '55px',
                              border: activeImageIndex === idx ? '2px solid var(--pk-orange)' : '1px solid var(--pk-border-color)',
                              boxShadow: activeImageIndex === idx ? '0 0 0 2px rgba(255, 124, 21, 0.2)' : 'none',
                              transition: 'var(--pk-transition)'
                            }}
                          >
                            <img src={img} alt="" className="w-100 h-100 object-fit-contain p-1" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: details info */}
                  <div className="col-md-7 d-flex flex-column">
                    <span className="product-brand" style={{ letterSpacing: '1px' }}>{selectedProduct.brand}</span>
                    <h3 className="fw-bold mb-2 h4" style={{ fontFamily: 'var(--pk-font-heading)' }}>{selectedProduct.title}</h3>
                    
                    {/* Rating stars */}
                    <div className="d-flex align-items-center gap-1.5 mb-3">
                      <div className="d-flex text-warning">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            fill={star <= Math.round(selectedProduct.rating) ? 'currentColor' : 'none'} 
                          />
                        ))}
                      </div>
                      <span className="small text-muted fw-semibold">
                        {selectedProduct.rating} ({selectedProduct.reviewsCount} avis client)
                      </span>
                    </div>

                    <div className="product-price-section mb-3">
                      <span className="price-current fs-3 fw-bold text-orange">{selectedProduct.price} DH</span>
                      {selectedProduct.oldPrice && (
                        <span className="price-old fs-5 text-muted text-decoration-line-through ms-2">
                          {selectedProduct.oldPrice} DH
                        </span>
                      )}
                      {selectedProduct.discount && (
                        <span className="badge bg-danger rounded-pill ms-2" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                          -{selectedProduct.discount}%
                        </span>
                      )}
                    </div>

                    <p className="text-muted mb-4 small-line-height" style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
                      {selectedProduct.description}
                    </p>

                    {/* Spec list */}
                    <div className="bg-light p-3 rounded-3 mb-4" style={{ fontSize: '0.8rem' }}>
                      <div className="row g-2">
                        <div className="col-6"><strong>Marque :</strong> {selectedProduct.brand}</div>
                        <div className="col-6"><strong>Catégorie :</strong> {selectedProduct.categoryLabel}</div>
                        <div className="col-6">
                          <strong>Stock :</strong>{' '}
                          <span className={selectedProduct.isSoldOut ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                            {selectedProduct.isSoldOut ? 'Épuisé' : 'En Stock'}
                          </span>
                        </div>
                        <div className="col-6"><strong>Livraison :</strong> Express 24/48h</div>
                      </div>
                    </div>

                    {/* Variant Selector */}
                    {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                      <div className="mb-4 text-start">
                        {selectedProduct.variants.map((v) => (
                          <div key={v.name} className="mb-3">
                            <label className="form-label small fw-bold text-uppercase text-muted mb-2">
                              {v.name} : <span className="text-dark fw-bold">{selectedVariants[v.name]}</span>
                            </label>
                            {v.type === 'color' ? (
                              <div className="d-flex gap-2.5 align-items-center">
                                {v.options.map((opt) => {
                                  const val = opt.value || opt;
                                  const isActive = selectedVariants[v.name] === val;
                                  return (
                                    <button
                                      key={val}
                                      type="button"
                                      onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: val }))}
                                      className="rounded-circle border-0 d-flex align-items-center justify-content-center"
                                      style={{
                                        width: '32px',
                                        height: '32px',
                                        backgroundColor: opt.code || '#ccc',
                                        border: isActive ? '3px solid var(--pk-orange)' : '1px solid rgba(0,0,0,0.15)',
                                        outline: isActive ? '2px solid rgba(255, 124, 21, 0.25)' : 'none',
                                        boxShadow: isActive ? 'inset 0 0 0 2px white' : 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)'
                                      }}
                                      title={val}
                                    />
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="d-flex flex-wrap gap-2">
                                {v.options.map((opt) => {
                                  const val = opt.value || opt;
                                  const isActive = selectedVariants[v.name] === val;
                                  return (
                                    <button
                                      key={val}
                                      type="button"
                                      onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: val }))}
                                      className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${
                                        isActive 
                                          ? 'btn-dark' 
                                          : 'btn-outline-secondary'
                                      }`}
                                      style={{
                                        fontSize: '0.78rem',
                                        border: isActive ? '1.5px solid var(--pk-black)' : '1px solid var(--pk-border-color)',
                                        transition: 'all 0.15s ease'
                                      }}
                                    >
                                      {val}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions panel */}
                    <div className="mt-auto d-flex flex-wrap gap-3">
                      <button 
                        onClick={() => {
                          handleAddToCart(selectedProduct, selectedVariants);
                          setSelectedProduct(null);
                          setCartOpen(true);
                        }}
                        disabled={selectedProduct.isSoldOut}
                        className="btn btn-primary flex-grow-1 rounded-pill py-2.5 d-flex align-items-center justify-content-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        <span>{selectedProduct.isSoldOut ? 'Produit Épuisé' : 'Ajouter au Panier'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Similarity / Related Products Recommendation */}
                <div className="mt-5 border-top pt-4">
                  <h5 className="fw-bold mb-3">Produits Similaires</h5>
                  <div className="row g-3">
                    {products
                      .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
                      .slice(0, 3)
                      .map((prod) => (
                        <div key={prod.id} className="col-4">
                          <div 
                            className="border rounded p-2 text-center h-100 cursor-pointer hover-shadow"
                            onClick={() => setSelectedProduct(prod)}
                            style={{ transition: 'all 0.2s' }}
                          >
                            <div className="d-flex align-items-center justify-content-center mb-1" style={{ height: '70px' }}>
                              <img src={prod.image} alt={prod.title} className="img-fluid h-100 object-fit-contain" />
                            </div>
                            <div className="small fw-semibold text-truncate">{prod.title}</div>
                            <div className="small text-orange fw-bold">{prod.price} DH</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="mobile-bottom-nav d-lg-none d-flex justify-content-around py-1.5">
        <button 
          onClick={() => { setView('shop'); }} 
          className={`mobile-nav-item ${currentView === 'shop' ? 'active text-orange' : ''}`}
        >
          <ShoppingBag size={20} />
          <span>Boutique</span>
        </button>
        <button 
          onClick={() => { setView('shop'); setMobileSidebarOpen(true); }} 
          className={`mobile-nav-item ${mobileSidebarOpen ? 'active text-orange' : ''}`}
        >
          <LayoutGrid size={20} />
          <span>Catégories</span>
        </button>
        <button 
          onClick={() => setCartOpen(true)} 
          className="mobile-nav-item position-relative"
        >
          <ShoppingCart size={20} />
          <span>Panier</span>
          {cartItemsCount > 0 && (
            <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.55rem' }}>
              {cartItemsCount}
            </span>
          )}
        </button>
        <button 
          onClick={() => { setView('contact'); }} 
          className={`mobile-nav-item ${currentView === 'contact' ? 'active text-orange' : ''}`}
        >
          <Phone size={20} />
          <span>Contact</span>
        </button>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-top py-5 text-center text-md-start mt-auto" style={{ borderBottom: '1px solid var(--pk-border-color)' }}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="row g-4">
            {/* Branding Column */}
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="fw-extrabold text-orange fs-4" style={{ fontFamily: 'var(--pk-font-heading)' }}>BICYCLE</span>
                <div className="d-flex flex-column" style={{ lineHeight: '1' }}>
                  <span className="fw-bold small">HOUSE</span>
                  <span className="text-muted" style={{ fontSize: '0.6rem' }}>MAROC</span>
                </div>
              </div>
              <p className="text-muted small-line-height mb-3" style={{ fontSize: '0.82rem', maxWidth: '300px' }}>
                Le spécialiste marocain de la pièce détachée, d'entretien et d'outillage de vélo en ligne. Commandez en toute sécurité et payez à la livraison.
              </p>
              <div className="d-flex gap-2">
                <a href="https://facebook.com" target="_blank" className="btn btn-outline-dark btn-sm rounded-circle p-1 d-inline-flex"><User size={14} /></a>
                <a href="https://instagram.com" target="_blank" className="btn btn-outline-dark btn-sm rounded-circle p-1 d-inline-flex"><User size={14} /></a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="col-md-2.5 col-6 text-start">
              <h6 className="fw-bold text-uppercase mb-3 small" style={{ letterSpacing: '0.5px' }}>Boutique</h6>
              <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '0.8rem' }}>
                <li><button onClick={() => { setView('shop'); setActiveCategory('les-frein'); }} className="btn btn-link p-0 text-muted text-decoration-none">Freins</button></li>
                <li><button onClick={() => { setView('shop'); setActiveCategory('les-gidon'); }} className="btn btn-link p-0 text-muted text-decoration-none">Guidons</button></li>
                <li><button onClick={() => { setView('shop'); setActiveCategory('les-selle'); }} className="btn btn-link p-0 text-muted text-decoration-none">Selles</button></li>
                <li><button onClick={() => { setView('shop'); setActiveCategory('les-accesoires'); }} className="btn btn-link p-0 text-muted text-decoration-none">Accessoires</button></li>
                <li><button onClick={() => { setView('shop'); setActiveCategory('all'); }} className="btn btn-link p-0 text-muted text-decoration-none">Toutes les catégories</button></li>
              </ul>
            </div>

            {/* Informations Column */}
            <div className="col-md-2.5 col-6 text-start">
              <h6 className="fw-bold text-uppercase mb-3 small" style={{ letterSpacing: '0.5px' }}>Informations</h6>
              <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '0.8rem' }}>
                <li><button onClick={() => setView('about')} className="btn btn-link p-0 text-muted text-decoration-none">À Propos</button></li>
                <li><button onClick={() => setView('faqs')} className="btn btn-link p-0 text-muted text-decoration-none">FAQs / Livraison</button></li>
                <li><button onClick={() => setView('contact')} className="btn btn-link p-0 text-muted text-decoration-none">Contactez-Nous</button></li>
                <li>
                  <button 
                    onClick={() => setView('admin')} 
                    className="btn btn-link p-0 text-orange fw-bold text-decoration-none mt-2 d-flex align-items-center gap-1"
                  >
                    <span>🔑 Espace Admin</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info Column */}
            <div className="col-md-3 text-start">
              <h6 className="fw-bold text-uppercase mb-3 small" style={{ letterSpacing: '0.5px' }}>Service Client</h6>
              <div className="d-flex flex-column gap-2.5" style={{ fontSize: '0.82rem' }}>
                <div className="d-flex align-items-start gap-2">
                  <MapPin size={16} className="text-orange mt-0.5" />
                  <span className="text-muted">Boulevard Zerktouni, Casablanca, Maroc</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Phone size={16} className="text-orange" />
                  <a href="tel:+2126123456789" className="text-decoration-none text-muted">+2126123456789</a>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Mail size={16} className="text-orange" />
                  <a href="mailto:contact@gmail.com" className="text-decoration-none text-muted">contact@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2" style={{ fontSize: '0.78rem' }}>
            <div className="text-muted">© {new Date().getFullYear()} BICYCLE HOUSE. Tous droits réservés.</div>
            <div className="text-muted d-flex gap-3">
              <span>Conditions Générales</span>
              <span>•</span>
              <span>Politique de Confidentialité</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
