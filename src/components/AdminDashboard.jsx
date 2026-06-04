import React, { useState } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Lock, 
  User, 
  LogOut, 
  RefreshCw, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Layers,
  Archive
} from 'lucide-react';

const AdminDashboard = ({ 
  products, 
  setProducts, 
  orders, 
  setOrders, 
  isAdminLoggedIn, 
  setIsAdminLoggedIn 
}) => {
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'

  // Product Form Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null when adding new product
  const [productForm, setProductForm] = useState({
    title: '',
    brand: 'PIKALA DETACHEE',
    category: 'les-accesoires',
    categoryLabel: 'Accessoires de vélo',
    price: '',
    oldPrice: '',
    discount: '',
    image: '',
    description: '',
    hasVariants: false,
    variantsJson: '[\n  {\n    "name": "Couleur",\n    "type": "color",\n    "options": [\n      {"value": "Noir", "code": "#111111"},\n      {"value": "Rouge", "code": "#DC3545"}\n    ]\n  }\n]'
  });

  const [uploadedImages, setUploadedImages] = useState([]);

  // Handle Login Submission
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@bicyclehouse.ma' && password === 'admin123') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('bh_admin_logged', 'true');
      setLoginError('');
    } else {
      setLoginError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('bh_admin_logged');
  };

  // Order status management
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit du catalogue ?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  // Toggle product stock status
  const toggleStockStatus = (productId) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, isSoldOut: !p.isSoldOut } 
          : p
      )
    );
  };

  // Open Product Modal for Edit/Add
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setUploadedImages(product.images || (product.image ? [product.image] : []));
      setProductForm({
        title: product.title,
        brand: product.brand || 'PIKALA DETACHEE',
        category: product.category,
        categoryLabel: product.categoryLabel || '',
        price: product.price,
        oldPrice: product.oldPrice || '',
        discount: product.discount || '',
        image: product.image,
        description: product.description || '',
        hasVariants: !!product.variants,
        variantsJson: product.variants 
          ? JSON.stringify(product.variants, null, 2) 
          : '[\n  {\n    "name": "Couleur",\n    "type": "color",\n    "options": [\n      {"value": "Noir", "code": "#111111"},\n      {"value": "Rouge", "code": "#DC3545"}\n    ]\n  }\n]'
      });
    } else {
      setEditingProduct(null);
      setUploadedImages([]);
      setProductForm({
        title: '',
        brand: 'PIKALA DETACHEE',
        category: 'les-accesoires',
        categoryLabel: 'Accessoires de vélo',
        price: '',
        oldPrice: '',
        discount: '',
        image: '',
        description: '',
        hasVariants: false,
        variantsJson: '[\n  {\n    "name": "Couleur",\n    "type": "color",\n    "options": [\n      {"value": "Noir", "code": "#111111"},\n      {"value": "Rouge", "code": "#DC3545"}\n    ]\n  }\n]'
      });
    }
    setShowProductModal(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const filePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(base64Images => {
      setUploadedImages(prev => [...prev, ...base64Images]);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle Product Form Submit
  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    // Parse variants JSON if checked
    let variants = null;
    if (productForm.hasVariants) {
      try {
        variants = JSON.parse(productForm.variantsJson);
      } catch (err) {
        alert('Erreur dans le format JSON des variantes. Veuillez vérifier la syntaxe.');
        return;
      }
    }

    // Standardize category label based on category ID
    let finalLabel = productForm.categoryLabel;
    if (!finalLabel) {
      if (productForm.category === 'les-pneu') finalLabel = 'Pneus & Chambres à air';
      else if (productForm.category === 'les-gidon') finalLabel = 'Guidons & Cintres';
      else if (productForm.category === 'les-selle') finalLabel = 'Selles & Tiges';
      else if (productForm.category === 'les-potonce') finalLabel = 'Potences & Casseroles';
      else if (productForm.category === 'les-frein') finalLabel = 'Freinage & Plaquettes';
      else finalLabel = 'Accessoires de vélo';
    }

    const priceNum = parseFloat(productForm.price);
    const oldPriceNum = productForm.oldPrice ? parseFloat(productForm.oldPrice) : null;
    const discountNum = productForm.discount ? parseInt(productForm.discount) : null;

    const productData = {
      title: productForm.title,
      brand: productForm.brand,
      category: productForm.category,
      categoryLabel: finalLabel,
      price: priceNum,
      oldPrice: oldPriceNum,
      discount: discountNum,
      image: uploadedImages.length > 0 ? uploadedImages[0] : (productForm.image || '/bicyclehouse/hero.png'),
      images: uploadedImages.length > 0 ? uploadedImages : [productForm.image || '/bicyclehouse/hero.png'],
      description: productForm.description,
      isSoldOut: editingProduct ? editingProduct.isSoldOut : false,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 0,
      variants: variants
    };

    if (editingProduct) {
      // Edit existing product
      setProducts(prev => 
        prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p)
      );
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        ...productData
      };
      setProducts(prev => [...prev, newProduct]);
    }

    setShowProductModal(false);
  };

  // Calculate statistics
  const totalRevenue = orders
    .filter(o => o.status === 'Confirmé')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'En attente').length;

  // Render LOGIN Screen if not logged in
  if (!isAdminLoggedIn) {
    return (
      <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="card shadow border-0 p-4 w-100" style={{ maxWidth: '400px', borderRadius: '16px' }}>
          <div className="text-center mb-4">
            <div className="d-inline-flex bg-orange bg-opacity-10 p-3 rounded-circle text-orange mb-3">
              <Lock size={32} />
            </div>
            <h3 className="fw-bold m-0" style={{ fontFamily: 'var(--pk-font-heading)' }}>Connexion Admin</h3>
            <p className="text-muted small mt-1">Accès réservé aux administrateurs de BICYCLE HOUSE</p>
          </div>

          {loginError && (
            <div className="alert alert-danger py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-3">
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="text-start">
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Adresse E-mail</label>
              <input 
                type="email" 
                required 
                placeholder="admin@bicyclehouse.ma"
                className="form-control rounded-3" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Mot de passe</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="form-control rounded-3" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-pill py-2.5 fw-bold">
              Se Connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render DASHBOARD Panel
  return (
    <div className="container-fluid px-0 py-2 text-start">
      {/* Admin Panel Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0 text-orange" style={{ fontFamily: 'var(--pk-font-heading)' }}>Espace Administration</h2>
          <p className="text-muted small mb-0">Gérez le catalogue produits, les stocks et suivez les commandes clients.</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline-dark rounded-pill py-2 px-3 d-flex align-items-center gap-1.5" style={{ fontSize: '0.88rem' }}>
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* Statistics Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card shadow-sm border-0 p-3 bg-white rounded-3 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Chiffre d'Affaires</span>
                <h4 className="fw-bold mt-1 text-success mb-0">{totalRevenue} DH</h4>
              </div>
              <div className="bg-success bg-opacity-10 text-success p-2.5 rounded-3">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="small text-muted mt-2">(Commandes confirmées)</div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card shadow-sm border-0 p-3 bg-white rounded-3 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Commandes</span>
                <h4 className="fw-bold mt-1 mb-0">{orders.length}</h4>
              </div>
              <div className="bg-primary bg-opacity-10 text-primary p-2.5 rounded-3">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="small text-muted mt-2">({pendingOrdersCount} en attente)</div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card shadow-sm border-0 p-3 bg-white rounded-3 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-bold text-uppercase">En Attente</span>
                <h4 className="fw-bold mt-1 text-warning mb-0">{pendingOrdersCount}</h4>
              </div>
              <div className="bg-warning bg-opacity-10 text-warning p-2.5 rounded-3">
                <RefreshCw size={20} className={pendingOrdersCount > 0 ? "spin" : ""} />
              </div>
            </div>
            <div className="small text-muted mt-2">A confirmer par téléphone</div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card shadow-sm border-0 p-3 bg-white rounded-3 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Total Produits</span>
                <h4 className="fw-bold mt-1 mb-0">{products.length}</h4>
              </div>
              <div className="bg-info bg-opacity-10 text-info p-2.5 rounded-3">
                <Layers size={20} />
              </div>
            </div>
            <div className="small text-muted mt-2">({products.filter(p => p.isSoldOut).length} en rupture)</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card border shadow-sm p-2 bg-white rounded-3 mb-4">
        <ul className="nav nav-pills d-flex gap-2 border-0">
          <li className="nav-item">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`nav-link rounded-pill py-2 px-4 fw-bold border-0 ${activeTab === 'orders' ? 'bg-orange text-white active' : 'text-dark bg-transparent'}`}
            >
              <div className="d-flex align-items-center gap-2">
                <FileText size={16} />
                <span>Commandes Client ({orders.length})</span>
              </div>
            </button>
          </li>
          <li className="nav-item">
            <button 
              onClick={() => setActiveTab('products')}
              className={`nav-link rounded-pill py-2 px-4 fw-bold border-0 ${activeTab === 'products' ? 'bg-orange text-white active' : 'text-dark bg-transparent'}`}
            >
              <div className="d-flex align-items-center gap-2">
                <Archive size={16} />
                <span>Catalogue Produits ({products.length})</span>
              </div>
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content 1: ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="card border shadow-sm rounded-3 bg-white overflow-hidden">
          <div className="card-header bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold m-0">Gestion des Commandes</h5>
            <span className="badge bg-dark rounded-pill py-1.5 px-3">Local database active</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.88rem' }}>
              <thead className="table-light">
                <tr className="border-bottom" style={{ fontWeight: '600' }}>
                  <th className="py-3 px-4">Commande</th>
                  <th>Client & Contact</th>
                  <th>Articles Commandés</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Statut</th>
                  <th className="text-end py-3 px-4">Actions de Confirmation</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      Aucune commande reçue pour le moment. Les commandes passées par les clients apparaîtront ici.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-bottom">
                      {/* Order info */}
                      <td className="py-3 px-4">
                        <div className="fw-bold text-orange">#{order.id.toString().slice(-6)}</div>
                        <div className="text-muted d-flex align-items-center gap-1 mt-1" style={{ fontSize: '0.72rem' }}>
                          <Calendar size={12} />
                          <span>{order.date}</span>
                        </div>
                      </td>

                      {/* Customer details */}
                      <td>
                        <div className="fw-bold">{order.customer.fullName}</div>
                        <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                          📞 {order.customer.phone} <br />
                          📍 {order.customer.address}, <strong>{order.customer.city}</strong>
                        </div>
                      </td>

                      {/* Items details */}
                      <td>
                        <div className="d-flex flex-column gap-1.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="bg-light p-1.5 px-2.5 rounded border d-flex align-items-center gap-2" style={{ fontSize: '0.78rem', maxWidth: '320px' }}>
                              <div className="border rounded bg-white p-0.5" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                                <img 
                                  src={item.product.image} 
                                  alt="" 
                                  className="w-100 h-100 object-fit-contain" 
                                  onError={(e) => { e.target.src = '/bicyclehouse/hero.png'; }}
                                />
                              </div>
                              <div className="flex-grow-1 min-w-0">
                                <div className="fw-bold text-truncate" title={item.product.title}>{item.product.title}</div>
                                <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
                                  <span>Quantité: {item.quantity}</span>
                                  <span>{item.product.price} DH</span>
                                </div>
                                {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                                  <div className="text-orange fw-semibold" style={{ fontSize: '0.7rem' }}>
                                    {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total price */}
                      <td className="text-center fw-bold text-dark fs-6">{order.total} DH</td>

                      {/* Status */}
                      <td className="text-center">
                        <span className={`badge rounded-pill px-3 py-1.5 fw-bold ${
                          order.status === 'Confirmé' 
                            ? 'bg-success text-white' 
                            : order.status === 'Annulé' 
                              ? 'bg-danger text-white' 
                              : 'bg-warning text-dark'
                        }`}>
                          {order.status === 'Confirmé' ? 'Confirmé' : order.status === 'Annulé' ? 'Annulé' : 'En attente'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="text-end py-3 px-4">
                        <div className="d-flex justify-content-end gap-1.5">
                          {order.status !== 'Confirmé' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'Confirmé')}
                              className="btn btn-success btn-sm rounded-pill px-2.5 py-1 d-flex align-items-center gap-1"
                              title="Confirmer la commande"
                            >
                              <Check size={14} />
                              <span>Confirmer</span>
                            </button>
                          )}
                          {order.status !== 'Annulé' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'Annulé')}
                              className="btn btn-danger btn-sm rounded-pill px-2.5 py-1 d-flex align-items-center gap-1"
                              title="Annuler la commande"
                            >
                              <X size={14} />
                              <span>Annuler</span>
                            </button>
                          )}
                          {order.status !== 'En attente' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'En attente')}
                              className="btn btn-outline-secondary btn-sm rounded-pill px-2.5 py-1 d-flex align-items-center gap-1"
                              title="Remettre en attente"
                            >
                              <RefreshCw size={12} />
                              <span>En attente</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: PRODUCTS CATALOG */}
      {activeTab === 'products' && (
        <div className="card border shadow-sm rounded-3 bg-white overflow-hidden">
          <div className="card-header bg-light border-bottom p-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <h5 className="fw-bold m-0">Gestion du Catalogue Produits</h5>
            <button onClick={() => openModal()} className="btn btn-primary rounded-pill py-2 px-3 d-flex align-items-center gap-1.5 fw-bold" style={{ fontSize: '0.85rem' }}>
              <Plus size={16} />
              <span>Ajouter un Produit</span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.88rem' }}>
              <thead className="table-light">
                <tr className="border-bottom" style={{ fontWeight: '600' }}>
                  <th className="py-3 px-4">Produit</th>
                  <th>Marque</th>
                  <th>Catégorie</th>
                  <th className="text-center">Prix Actuel</th>
                  <th className="text-center">Stock</th>
                  <th className="text-end py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-bottom">
                    {/* Image & Title */}
                    <td className="py-2 px-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="border rounded p-1 bg-white" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                          <img src={p.image} alt={p.title} className="w-100 h-100 object-fit-contain" />
                        </div>
                        <div>
                          <div className="fw-bold text-truncate" style={{ maxWidth: '280px' }} title={p.title}>{p.title}</div>
                          {p.discount && <span className="badge bg-danger rounded-pill mt-0.5">-{p.discount}%</span>}
                          {p.variants && (
                            <span className="badge bg-secondary rounded-pill ms-2" style={{ fontSize: '0.65rem' }}>
                              Variantes : {p.variants.map(v => v.name).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td>{p.brand}</td>

                    {/* Category */}
                    <td>
                      <span className="badge bg-light text-dark border">{p.categoryLabel}</span>
                    </td>

                    {/* Price */}
                    <td className="text-center">
                      <div className="fw-bold">{p.price} DH</div>
                      {p.oldPrice && <div className="text-muted text-decoration-line-through small" style={{ fontSize: '0.78rem' }}>{p.oldPrice} DH</div>}
                    </td>

                    {/* Stock status toggle */}
                    <td className="text-center">
                      <button 
                        onClick={() => toggleStockStatus(p.id)}
                        className={`btn btn-sm rounded-pill fw-bold border-0 px-3 py-1 ${
                          p.isSoldOut 
                            ? 'bg-danger bg-opacity-10 text-danger' 
                            : 'bg-success bg-opacity-10 text-success'
                        }`}
                        title="Cliquez pour changer le stock"
                      >
                        {p.isSoldOut ? 'Épuisé' : 'En Stock'}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="text-end py-2 px-4">
                      <div className="d-flex justify-content-end gap-1.5">
                        <button 
                          onClick={() => openModal(p)}
                          className="btn btn-outline-dark btn-sm rounded-circle p-1.5 d-inline-flex"
                          title="Modifier le produit"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="btn btn-outline-danger btn-sm rounded-circle p-1.5 d-inline-flex"
                          title="Supprimer le produit"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD/EDIT PRODUCT MODAL */}
      {showProductModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="modal-header border-bottom px-4 py-3 bg-light">
                <h5 className="modal-title fw-bold text-orange">
                  {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowProductModal(false)}></button>
              </div>

              <form onSubmit={handleProductSubmit} className="text-start">
                <div className="modal-body p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                  <div className="row g-3">
                    {/* Title */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Nom du Produit *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control rounded-3" 
                        value={productForm.title}
                        onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="ex: Guidon VTT Wake Rise..."
                      />
                    </div>

                    {/* Brand & Category */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Marque *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control rounded-3" 
                        value={productForm.brand}
                        onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Catégorie *</label>
                      <select 
                        className="form-select rounded-3"
                        value={productForm.category}
                        onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value, categoryLabel: '' }))}
                      >
                        <option value="les-pneu">les pneu</option>
                        <option value="les-gidon">les gidon</option>
                        <option value="les-selle">les selle</option>
                        <option value="les-potonce">les potonce</option>
                        <option value="les-frein">les frein</option>
                        <option value="les-accesoires">les accesoires</option>
                      </select>
                    </div>

                    {/* Category Label override */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Sous-Catégorie / Label (Optionnel)</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3" 
                        value={productForm.categoryLabel}
                        onChange={(e) => setProductForm(prev => ({ ...prev, categoryLabel: e.target.value }))}
                        placeholder="ex: Transmission, Dérailleurs"
                      />
                    </div>

                    {/* Price, Old Price, Discount */}
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Prix de vente (DH) *</label>
                      <input 
                        type="number" 
                        required 
                        min="0"
                        step="0.01"
                        className="form-control rounded-3" 
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Ancien Prix (DH) (Optionnel)</label>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        className="form-control rounded-3" 
                        value={productForm.oldPrice}
                        onChange={(e) => setProductForm(prev => ({ ...prev, oldPrice: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Remise (%) (Optionnel)</label>
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        className="form-control rounded-3" 
                        value={productForm.discount}
                        onChange={(e) => setProductForm(prev => ({ ...prev, discount: e.target.value }))}
                        placeholder="ex: 15"
                      />
                    </div>

                    {/* Local File Upload Area */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Photos du Produit (Local) *</label>
                      <div 
                        className="border border-dashed rounded-3 p-4 text-center cursor-pointer"
                        style={{ 
                          borderColor: 'var(--pk-orange)', 
                          backgroundColor: 'rgba(255, 124, 21, 0.03)',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                        onClick={() => document.getElementById('productImageUpload').click()}
                      >
                        <input 
                          type="file" 
                          id="productImageUpload" 
                          multiple 
                          accept="image/*" 
                          className="d-none" 
                          onChange={handleFileChange}
                        />
                        <div className="d-flex flex-column align-items-center gap-2">
                          <Plus size={24} className="text-orange" />
                          <span className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>Sélectionner des images depuis votre ordinateur</span>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Formats acceptés: PNG, JPG, JPEG (Vous pouvez en sélectionner plusieurs)</span>
                        </div>
                      </div>

                      {/* Image previews */}
                      {uploadedImages.length > 0 && (
                        <div className="d-flex flex-wrap gap-2.5 mt-3 p-2 bg-light rounded-3 border">
                          {uploadedImages.map((img, idx) => (
                            <div 
                              key={idx} 
                              className="position-relative border rounded-3 overflow-hidden bg-white shadow-sm" 
                              style={{ width: '80px', height: '80px', transition: 'all 0.2s' }}
                            >
                              <img src={img} alt="" className="w-100 h-100 object-fit-contain p-1" />
                              {idx === 0 && (
                                <span className="position-absolute top-0 start-0 badge bg-orange text-white" style={{ fontSize: '0.55rem', borderRadius: '0 0 8px 0' }}>
                                  Principale
                                </span>
                              )}
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(idx);
                                }}
                                className="btn btn-danger btn-sm p-1 rounded-circle position-absolute top-0 end-0 m-1 shadow-sm d-flex align-items-center justify-content-center"
                                style={{ width: '20px', height: '20px', fontSize: '0.65rem' }}
                                title="Supprimer cette image"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Image path fallback (text-input) */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Ou URL de l'image (Chemin textuel alternatif)</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3" 
                        value={productForm.image}
                        onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="ex: /bicyclehouse/products/shimano_pads.png"
                      />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Description *</label>
                      <textarea 
                        required 
                        rows="3"
                        className="form-control rounded-3" 
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description du produit..."
                      />
                    </div>

                    {/* Has variants checkbox */}
                    <div className="col-12 mt-2">
                      <div className="form-check form-switch">
                        <input 
                          type="checkbox" 
                          id="variantsSwitch"
                          className="form-check-input"
                          checked={productForm.hasVariants}
                          onChange={(e) => setProductForm(prev => ({ ...prev, hasVariants: e.target.checked }))}
                        />
                        <label htmlFor="variantsSwitch" className="form-check-label small fw-bold text-dark">
                          Activer des variantes (Couleurs, Tailles...)
                        </label>
                      </div>
                    </div>

                    {/* Variants JSON Editor */}
                    {productForm.hasVariants && (
                      <div className="col-12">
                        <label className="form-label small fw-bold text-muted">Config des variantes (JSON format) *</label>
                        <textarea 
                          required 
                          rows="6"
                          className="form-control font-monospace rounded-3" 
                          style={{ fontSize: '0.8rem' }}
                          value={productForm.variantsJson}
                          onChange={(e) => setProductForm(prev => ({ ...prev, variantsJson: e.target.value }))}
                        />
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Saisissez un tableau JSON d'objets variantes. Chaque variante doit avoir un `name`, un `type` ('color' ou 'text'), et un tableau `options`.
                        </small>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer border-top px-4 py-3 bg-light">
                  <button type="button" className="btn btn-outline-dark rounded-pill py-2 px-4" onClick={() => setShowProductModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill py-2 px-4 fw-bold">
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
