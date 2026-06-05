import React, { useState, useEffect } from 'react';
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
  Archive,
  Settings,
  Key,
  Folder,
  ChevronRight,
  Search,
  Tag,
  ArrowLeftRight,
  Menu,
  MessageSquare,
  Mail
} from 'lucide-react';

// Import Firebase database config
import { db, isFirebaseConfigured } from '../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

const AdminDashboard = ({ 
  products, 
  setProducts, 
  orders, 
  setOrders, 
  categories, 
  setCategories,
  contacts = [],
  setContacts,
  adminCredentials,
  setAdminCredentials,
  isAdminLoggedIn, 
  setIsAdminLoggedIn 
}) => {
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Security credentials change form
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');

  // Sync newEmail with loaded adminCredentials
  useEffect(() => {
    if (adminCredentials?.email) {
      setNewEmail(adminCredentials.email);
    }
  }, [adminCredentials?.email]);

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'orders', 'products', 'categories', 'security'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Product Form Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null when adding new product
  const [productForm, setProductForm] = useState({
    title: '',
    brand: 'PIKALA DETACHEE',
    category: '',
    categoryLabel: '',
    price: '',
    oldPrice: '',
    discount: '',
    image: '',
    description: '',
    hasVariants: false,
    variantsJson: '[\n  {\n    "name": "Couleur",\n    "type": "color",\n    "options": [\n      {"value": "Noir", "code": "#111111"},\n      {"value": "Rouge", "code": "#DC3545"}\n    ]\n  }\n]'
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [productVariants, setProductVariants] = useState([]);

  // Category modal / editing state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null when adding new category
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  
  // Category Product Mapping view state
  const [selectedCategoryMapping, setSelectedCategoryMapping] = useState(null); // category object when active
  const [mappingSearchQuery, setMappingSearchQuery] = useState('');

  // Search queries for products, orders, and messages
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  // Notification Toast State
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Handle Login Submission
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === adminCredentials.email && password === adminCredentials.password) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('bh_admin_logged', 'true');
      setLoginError('');
      showToast('Connexion réussie !');
    } else {
      setLoginError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('bh_admin_logged');
    showToast('Déconnexion effectuée.');
  };

  // Handle Update Security Settings
  const handleUpdateSecurity = (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    if (!newEmail.trim()) {
      setSecurityError("L'adresse email ne peut pas être vide.");
      return;
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setSecurityError('Les mots de passe ne correspondent pas.');
        return;
      }
    }

    const updatedCreds = {
      email: newEmail,
      password: newPassword || adminCredentials.password
    };

    if (isFirebaseConfigured) {
      setDoc(doc(db, 'settings', 'admin'), updatedCreds)
        .then(() => {
          setSecuritySuccess('Identifiants admin mis à jour avec succès !');
          setNewPassword('');
          setConfirmPassword('');
          showToast('Paramètres de sécurité enregistrés !');
        })
        .catch(err => {
          setSecurityError('Erreur lors de la mise à jour des identifiants dans Firestore.');
          console.error(err);
        });
    } else {
      localStorage.setItem('bh_admin_email', newEmail);
      if (newPassword) {
        localStorage.setItem('bh_admin_password', newPassword);
      }
      setAdminCredentials(updatedCreds);
      setSecuritySuccess('Identifiants admin mis à jour avec succès !');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Paramètres de sécurité enregistrés !');
    }
  };

  // Order status management
  const updateOrderStatus = (orderId, newStatus) => {
    if (isFirebaseConfigured) {
      const orderRef = doc(db, 'orders', orderId.toString());
      setDoc(orderRef, { status: newStatus }, { merge: true })
        .then(() => showToast(`Commande #${orderId.toString().slice(-6)} mise à jour : ${newStatus}`))
        .catch(err => console.error("Error updating order status in Firestore:", err));
    } else {
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        )
      );
      showToast(`Commande #${orderId.toString().slice(-6)} mise à jour : ${newStatus}`);
    }
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit du catalogue ?')) {
      if (isFirebaseConfigured) {
        deleteDoc(doc(db, 'products', productId.toString()))
          .then(() => showToast('Produit supprimé.'))
          .catch(err => console.error("Error deleting product in Firestore:", err));
      } else {
        setProducts(prev => prev.filter(p => p.id !== productId));
        showToast('Produit supprimé.');
      }
    }
  };

  // Toggle product stock status
  const toggleStockStatus = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (isFirebaseConfigured) {
      setDoc(doc(db, 'products', productId.toString()), { isSoldOut: !product.isSoldOut }, { merge: true })
        .then(() => showToast('Statut du stock mis à jour.'))
        .catch(err => console.error("Error toggling stock in Firestore:", err));
    } else {
      setProducts(prev => 
        prev.map(p => 
          p.id === productId 
            ? { ...p, isSoldOut: !p.isSoldOut } 
            : p
        )
      );
      showToast('Statut du stock mis à jour.');
    }
  };

  // Open Product Modal for Edit/Add
  const openModal = (product = null) => {
    // Make sure we have a category selected
    const defaultCat = categories.length > 0 ? categories[0].id : 'les-accesoires';

    if (product) {
      setEditingProduct(product);
      setUploadedImages(product.images || (product.image ? [product.image] : []));
      setProductVariants(product.variants ? JSON.parse(JSON.stringify(product.variants)) : []);
      setProductForm({
        title: product.title,
        brand: product.brand || 'PIKALA DETACHEE',
        category: product.category || defaultCat,
        categoryLabel: product.categoryLabel || '',
        price: product.price,
        oldPrice: product.oldPrice || '',
        discount: product.discount || '',
        image: product.image,
        description: product.description || '',
        hasVariants: !!product.variants,
        variantsJson: ''
      });
    } else {
      setEditingProduct(null);
      setUploadedImages([]);
      setProductVariants([]);
      setProductForm({
        title: '',
        brand: 'PIKALA DETACHEE',
        category: defaultCat,
        categoryLabel: '',
        price: '',
        oldPrice: '',
        discount: '',
        image: '',
        description: '',
        hasVariants: false,
        variantsJson: ''
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

  // Variant Builder Handlers
  const handleAddVariant = () => {
    setProductVariants(prev => [
      ...prev,
      {
        name: '',
        type: 'text',
        options: []
      }
    ]);
  };

  const handleRemoveVariant = (idx) => {
    setProductVariants(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateVariantField = (vIdx, field, value) => {
    setProductVariants(prev => 
      prev.map((v, i) => i === vIdx ? { ...v, [field]: value } : v)
    );
  };

  const handleAddOption = (vIdx) => {
    setProductVariants(prev => 
      prev.map((v, i) => {
        if (i === vIdx) {
          const newOpt = { value: '', code: v.type === 'color' ? '#111111' : undefined };
          return {
            ...v,
            options: [...v.options, newOpt]
          };
        }
        return v;
      })
    );
  };

  const handleRemoveOption = (vIdx, oIdx) => {
    setProductVariants(prev => 
      prev.map((v, i) => {
        if (i === vIdx) {
          return {
            ...v,
            options: v.options.filter((_, oi) => oi !== oIdx)
          };
        }
        return v;
      })
    );
  };

  const handleUpdateOptionField = (vIdx, oIdx, field, value) => {
    setProductVariants(prev => 
      prev.map((v, i) => {
        if (i === vIdx) {
          return {
            ...v,
            options: v.options.map((opt, oi) => 
              oi === oIdx ? { ...opt, [field]: value === '' ? undefined : value } : opt
            )
          };
        }
        return v;
      })
    );
  };

  // Handle Product Form Submit
  const handleProductSubmit = (e) => {
    e.preventDefault();

    // Find category label from selected category ID
    const matchedCategory = categories.find(c => c.id === productForm.category);
    const finalLabel = matchedCategory ? matchedCategory.name : 'Accessoires';

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
      variants: productVariants.length > 0 ? productVariants : null
    };

    if (editingProduct) {
      if (isFirebaseConfigured) {
        setDoc(doc(db, 'products', editingProduct.id.toString()), productData, { merge: true })
          .then(() => showToast('Produit mis à jour avec succès.'))
          .catch(err => console.error("Error editing product in Firestore:", err));
      } else {
        setProducts(prev => 
          prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p)
        );
        showToast('Produit mis à jour avec succès.');
      }
    } else {
      const newId = Date.now();
      const newProduct = {
        id: newId,
        ...productData
      };
      if (isFirebaseConfigured) {
        setDoc(doc(db, 'products', newId.toString()), productData)
          .then(() => showToast('Produit ajouté avec succès.'))
          .catch(err => console.error("Error adding product in Firestore:", err));
      } else {
        setProducts(prev => [...prev, newProduct]);
        showToast('Produit ajouté avec succès.');
      }
    }

    setShowProductModal(false);
  };

  // Helper to generate a URL/ID slug from category name
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

  // Open Category Modal
  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({ name: category.name });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '' });
    }
    setShowCategoryModal(true);
  };

  // Handle Category CRUD Submit
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    if (editingCategory) {
      if (isFirebaseConfigured) {
        setDoc(doc(db, 'categories', editingCategory.id), { name: categoryForm.name }, { merge: true })
          .then(async () => {
            const productsToUpdate = products.filter(p => p.category === editingCategory.id);
            for (const p of productsToUpdate) {
              await setDoc(doc(db, 'products', p.id.toString()), { categoryLabel: categoryForm.name }, { merge: true });
            }
            showToast('Catégorie renommée.');
          })
          .catch(err => console.error("Error renaming category in Firestore:", err));
      } else {
        setCategories(prev => 
          prev.map(c => c.id === editingCategory.id ? { ...c, name: categoryForm.name } : c)
        );
        setProducts(prev => 
          prev.map(p => p.category === editingCategory.id 
            ? { ...p, categoryLabel: categoryForm.name } 
            : p
          )
        );
        showToast('Catégorie renommée.');
      }
    } else {
      const newSlug = slugify(categoryForm.name) || `cat-${Date.now()}`;
      if (categories.some(c => c.id === newSlug)) {
        alert('Une catégorie similaire existe déjà.');
        return;
      }
      const newCategory = {
        id: newSlug,
        name: categoryForm.name
      };

      if (isFirebaseConfigured) {
        setDoc(doc(db, 'categories', newSlug), { name: categoryForm.name })
          .then(() => showToast('Catégorie créée.'))
          .catch(err => console.error("Error creating category in Firestore:", err));
      } else {
        setCategories(prev => [...prev, newCategory]);
        showToast('Catégorie créée.');
      }
    }

    setShowCategoryModal(false);
  };

  // Delete category
  const handleDeleteCategory = (catId) => {
    const category = categories.find(c => c.id === catId);
    if (!category) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ? \nLes produits de cette catégorie ne seront pas supprimés mais seront déplacés.`)) {
      const remainingCats = categories.filter(c => c.id !== catId);
      const defaultCatId = remainingCats.length > 0 ? remainingCats[0].id : 'les-accesoires';
      const defaultCatLabel = remainingCats.length > 0 ? remainingCats[0].name : 'Accessoires';

      if (isFirebaseConfigured) {
        deleteDoc(doc(db, 'categories', catId))
          .then(async () => {
            const productsToUpdate = products.filter(p => p.category === catId);
            for (const p of productsToUpdate) {
              await setDoc(doc(db, 'products', p.id.toString()), { category: defaultCatId, categoryLabel: defaultCatLabel }, { merge: true });
            }
            showToast('Catégorie supprimée.');
          })
          .catch(err => console.error("Error deleting category in Firestore:", err));
      } else {
        setCategories(prev => prev.filter(c => c.id !== catId));
        setProducts(prev => 
          prev.map(p => p.category === catId 
            ? { ...p, category: defaultCatId, categoryLabel: defaultCatLabel } 
            : p
          )
        );
        showToast('Catégorie supprimée.');
      }
      if (selectedCategoryMapping?.id === catId) {
        setSelectedCategoryMapping(null);
      }
    }
  };

  // Assign/Unassign product to Category mapping
  const handleToggleProductCategory = (product, assign) => {
    if (!selectedCategoryMapping) return;

    let targetCatId = '';
    let targetCatLabel = 'Non classé';

    if (assign) {
      targetCatId = selectedCategoryMapping.id;
      targetCatLabel = selectedCategoryMapping.name;
    } else {
      const fallbackCat = categories.find(c => c.id !== selectedCategoryMapping.id);
      if (fallbackCat) {
        targetCatId = fallbackCat.id;
        targetCatLabel = fallbackCat.name;
      }
    }

    if (isFirebaseConfigured) {
      setDoc(doc(db, 'products', product.id.toString()), { category: targetCatId, categoryLabel: targetCatLabel }, { merge: true })
        .catch(err => console.error("Error setting product category in Firestore:", err));
    } else {
      setProducts(prev => 
        prev.map(p => p.id === product.id 
          ? { ...p, category: targetCatId, categoryLabel: targetCatLabel } 
          : p
        )
      );
    }
  };

  // Delete contact message
  const handleDeleteContact = (contactId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      if (isFirebaseConfigured) {
        deleteDoc(doc(db, 'contacts', contactId))
          .then(() => showToast('Message supprimé.'))
          .catch(err => console.error("Error deleting contact in Firestore:", err));
      } else {
        setContacts(prev => prev.filter(c => c.id !== contactId));
        showToast('Message supprimé.');
      }
    }
  };

  // Calculate statistics
  const totalRevenue = orders
    .filter(o => o.status === 'Confirmé')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'En attente').length;

  // Filtered lists for rendering
  const filteredProductsList = products.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.categoryLabel && p.categoryLabel.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const filteredOrdersList = orders.filter(o => 
    o.id.toString().includes(orderSearch) ||
    o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer.phone.includes(orderSearch) ||
    o.customer.city.toLowerCase().includes(orderSearch.toLowerCase())
  );

  // Render LOGIN Screen if not logged in
  if (!isAdminLoggedIn) {
    return (
      <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="card shadow-lg border-0 p-4 w-100" style={{ maxWidth: '420px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
          <div className="text-center mb-4">
            <div className="d-inline-flex p-3.5 rounded-circle text-orange mb-3" style={{ backgroundColor: 'rgba(255, 124, 21, 0.1)' }}>
              <Lock size={36} />
            </div>
            <h3 className="fw-bold m-0" style={{ fontFamily: 'var(--pk-font-heading)', color: '#1A1A1A' }}>Connexion Administration</h3>
            <p className="text-muted small mt-1">Espace sécurisé - BICYCLE HOUSE</p>
          </div>

          {loginError && (
            <div className="alert alert-danger py-2.5 px-3 small rounded-3 d-flex align-items-center gap-2 mb-3">
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
                style={{ padding: '0.65rem 0.85rem' }}
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
                style={{ padding: '0.65rem 0.85rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-pill py-2.5 fw-bold" style={{ backgroundColor: 'var(--pk-orange)', borderColor: 'var(--pk-orange)' }}>
              Se Connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0 py-2 text-start position-relative">
      <style>{`
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-right {
          animation: slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Mobile Top Navigation Header */}
      <div className="d-flex d-md-none justify-content-between align-items-center bg-white border-bottom px-3 py-3 mb-3 sticky-top shadow-sm" style={{ zIndex: 1030, margin: '0 -1rem' }}>
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded-3 text-white" style={{ backgroundColor: 'var(--pk-orange)' }}>
            <Archive size={16} />
          </div>
          <div>
            <h6 className="fw-bold m-0 text-dark" style={{ fontFamily: 'var(--pk-font-heading)', fontSize: '0.92rem' }}>Bicycle House</h6>
            <span className="text-muted" style={{ fontSize: '0.65rem' }}>Espace Administration</span>
          </div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border"
          style={{ width: '38px', height: '38px' }}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div 
          className="position-fixed w-100 h-100 bg-black bg-opacity-50 top-0 start-0 d-md-none" 
          style={{ zIndex: 1040 }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="bg-white h-100 p-4 shadow-lg d-flex flex-column animate-slide-right" 
            style={{ width: '280px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
              <div className="d-flex align-items-center gap-2.5">
                <div className="p-2 rounded-3 text-white" style={{ backgroundColor: 'var(--pk-orange)' }}>
                  <Archive size={18} />
                </div>
                <div>
                  <h5 className="fw-bold m-0 text-dark" style={{ fontFamily: 'var(--pk-font-heading)' }}>Bicycle House</h5>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>Administration</span>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="btn-close"></button>
            </div>

            <div className="d-flex flex-column gap-2">
              <button 
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); setSelectedCategoryMapping(null); }}
                className={`btn d-flex align-items-center gap-2.5 rounded-3 py-2.5 px-3 text-start w-100 border-0 ${activeTab === 'dashboard' ? 'bg-orange text-white fw-bold shadow-sm' : 'btn-light text-dark'}`}
              >
                <Layers size={18} />
                <span>Tableau de Bord</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); setSelectedCategoryMapping(null); }}
                className={`btn d-flex align-items-center gap-2.5 rounded-3 py-2.5 px-3 text-start w-100 border-0 ${activeTab === 'orders' ? 'bg-orange text-white fw-bold shadow-sm' : 'btn-light text-dark'}`}
              >
                <FileText size={18} />
                <span>Commandes Client</span>
                <span className={`badge ms-auto ${activeTab === 'orders' ? 'bg-white text-orange' : 'bg-dark text-white'}`}>{orders.length}</span>
              </button>

              <button 
                onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); setSelectedCategoryMapping(null); }}
                className={`btn d-flex align-items-center gap-2.5 rounded-3 py-2.5 px-3 text-start w-100 border-0 ${activeTab === 'products' ? 'bg-orange text-white fw-bold shadow-sm' : 'btn-light text-dark'}`}
              >
                <ShoppingBag size={18} />
                <span>Catalogue Produits</span>
                <span className={`badge ms-auto ${activeTab === 'products' ? 'bg-white text-orange' : 'bg-dark text-white'}`}>{products.length}</span>
              </button>

              <button 
                onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); setSelectedCategoryMapping(null); }}
                className={`btn d-flex align-items-center gap-2.5 rounded-3 py-2.5 px-3 text-start w-100 border-0 ${activeTab === 'categories' ? 'bg-orange text-white fw-bold shadow-sm' : 'btn-light text-dark'}`}
              >
                <Folder size={18} />
                <span>Gestion Catégories</span>
                <span className={`badge ms-auto ${activeTab === 'categories' ? 'bg-white text-orange' : 'bg-dark text-white'}`}>{categories.length}</span>
              </button>

              <button 
                onClick={() => { setActiveTab('messages'); setMobileMenuOpen(false); setSelectedCategoryMapping(null); }}
                className={`btn d-flex align-items-center gap-2.5 rounded-3 py-2.5 px-3 text-start w-100 border-0 ${activeTab === 'messages' ? 'bg-orange text-white fw-bold shadow-sm' : 'btn-light text-dark'}`}
              >
                <MessageSquare size={18} />
                <span>Messages Client</span>
                <span className={`badge ms-auto ${activeTab === 'messages' ? 'bg-white text-orange' : 'bg-dark text-white'}`}>{contacts.length}</span>
              </button>

              <button 
                onClick={() => { setActiveTab('security'); setMobileMenuOpen(false); setSelectedCategoryMapping(null); }}
                className={`btn d-flex align-items-center gap-2.5 rounded-3 py-2.5 px-3 text-start w-100 border-0 ${activeTab === 'security' ? 'bg-orange text-white fw-bold shadow-sm' : 'btn-light text-dark'}`}
              >
                <Settings size={18} />
                <span>Sécurité & Compte</span>
              </button>

              <hr className="my-3 text-muted" />

              <a href="/bicyclehouse/" className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 rounded-pill py-2 text-decoration-none fw-semibold mb-1.5" style={{ fontSize: '0.85rem' }}>
                <span>Retour Boutique 🛒</span>
              </a>

              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-dark d-flex align-items-center justify-content-center gap-2 rounded-pill py-2" style={{ fontSize: '0.85rem' }}>
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert popup */}
      {toast && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100, marginTop: '20px' }}>
          <div className={`toast show align-items-center text-white bg-dark border-0 shadow-lg`} role="alert" style={{ borderRadius: '50px', padding: '0.4rem 1.2rem' }}>
            <div className="d-flex align-items-center gap-2">
              <CheckCircle size={16} className="text-success" />
              <div className="toast-body fw-bold py-1.5" style={{ fontSize: '0.82rem' }}>
                {toast.message}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="row g-4 mt-1">
        {/* Sidebar Nav (Desktop only) */}
        <div className="col-lg-3 col-md-4 d-none d-md-block">
          <div className="card shadow-sm border p-3 bg-white" style={{ borderRadius: '18px', position: 'sticky', top: '20px' }}>
            <div className="d-flex align-items-center gap-2.5 pb-3 mb-3 border-bottom">
              <div className="p-2 rounded-3 text-white" style={{ backgroundColor: 'var(--pk-orange)' }}>
                <Archive size={20} />
              </div>
              <div>
                <h5 className="fw-bold m-0 text-dark" style={{ fontFamily: 'var(--pk-font-heading)' }}>Bicycle House</h5>
                <span className="badge bg-light text-dark border px-2 py-0.5" style={{ fontSize: '0.7rem' }}>Panel Admin</span>
              </div>
            </div>

            <div className="d-flex flex-column gap-1.5">
              <button 
                onClick={() => { setActiveTab('dashboard'); setSelectedCategoryMapping(null); }}
                className={`btn d-flex align-items-center gap-2.5 rounded-3 py-2.5 px-3 text-start w-100 border-0 ${activeTab === 'dashboard' ? 'bg-orange text-white fw-bold shadow-sm' : 'btn-light text-dark'}`}
              >
                <Layers size={18} />
                <span>Tableau de Bord</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab('orders'); setSelectedCategoryMapping(null); }}
                className={`btn d-flex align-items-center gap-2.5 rounded-3 py-2.5 px-3 text-start w-100 border-0 ${activeTab === 'orders' ? 'bg-orange text-white fw-bold shadow-sm' : 'btn-light text-dark'}`}
              >
                <FileText size={18} />
                <span>Commandes Client</span>
                <span className={`badge ms-auto ${activeTab === 'orders' ? 'bg-white text-orange' : 'bg-dark text-white'}`}>{orders.length}</span>
              </button>

              <button 
                onClick={() => { setActiveTab('products'); setSelectedCategoryMapping(null); }}
                className={`btn d-flex align-items-center gap-2.5 rounded-3 py-2.5 px-3 text-start w-100 border-0 ${activeTab === 'products' ? 'bg-orange text-white fw-bold shadow-sm' : 'btn-light text-dark'}`}
              >
                <ShoppingBag size={18} />
                <span>Catalogue Produits</span>
                <span className={`badge ms-auto ${activeTab === 'products' ? 'bg-white text-orange' : 'bg-dark text-white'}`}>{products.length}</span>
              </button>

              <button 
                onClick={() => { setActiveTab('categories'); setSelectedCategoryMapping(null); }}
                className={`btn d-flex align-items-center gap-2.5 rounded-3 py-2.5 px-3 text-start w-100 border-0 ${activeTab === 'categories' ? 'bg-orange text-white fw-bold shadow-sm' : 'btn-light text-dark'}`}
              >
                <Folder size={18} />
                <span>Gestion Catégories</span>
                <span className={`badge ms-auto ${activeTab === 'categories' ? 'bg-white text-orange' : 'bg-dark text-white'}`}>{categories.length}</span>
              </button>

              <button 
                onClick={() => { setActiveTab('messages'); setSelectedCategoryMapping(null); }}
                className={`btn d-flex align-items-center gap-2.5 rounded-3 py-2.5 px-3 text-start w-100 border-0 ${activeTab === 'messages' ? 'bg-orange text-white fw-bold shadow-sm' : 'btn-light text-dark'}`}
              >
                <MessageSquare size={18} />
                <span>Messages Client</span>
                <span className={`badge ms-auto ${activeTab === 'messages' ? 'bg-white text-orange' : 'bg-dark text-white'}`}>{contacts.length}</span>
              </button>

              <button 
                onClick={() => { setActiveTab('security'); setSelectedCategoryMapping(null); }}
                className={`btn d-flex align-items-center gap-2.5 rounded-3 py-2.5 px-3 text-start w-100 border-0 ${activeTab === 'security' ? 'bg-orange text-white fw-bold shadow-sm' : 'btn-light text-dark'}`}
              >
                <Settings size={18} />
                <span>Sécurité & Compte</span>
              </button>

              <hr className="my-2.5 text-muted" />

              <a href="/bicyclehouse/" className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 rounded-pill py-2 text-decoration-none fw-semibold mb-1.5" style={{ fontSize: '0.85rem' }}>
                <span>Retour Boutique 🛒</span>
              </a>

              <button onClick={handleLogout} className="btn btn-dark d-flex align-items-center justify-content-center gap-2 rounded-pill py-2" style={{ fontSize: '0.85rem' }}>
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-lg-9 col-md-8">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Welcome Header */}
              <div className="card shadow-sm border-0 p-4 bg-white rounded-4 mb-4">
                <h2 className="fw-bold text-dark m-0" style={{ fontFamily: 'var(--pk-font-heading)' }}>Bienvenue, Administrateur</h2>
                <p className="text-muted mb-0 mt-1">Voici les statistiques de performance de votre boutique Bicycle House aujourd'hui.</p>
              </div>

              {/* Stats Counters */}
              <div className="row g-3 mb-4">
                <div className="col-lg col-md-4 col-6">
                  <div className="card shadow-sm border p-3 bg-white rounded-3 h-100">
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

                <div className="col-lg col-md-4 col-6">
                  <div className="card shadow-sm border p-3 bg-white rounded-3 h-100">
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

                <div className="col-lg col-md-4 col-6">
                  <div className="card shadow-sm border p-3 bg-white rounded-3 h-100">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="text-muted small fw-bold text-uppercase">En Attente</span>
                        <h4 className="fw-bold mt-1 text-warning mb-0">{pendingOrdersCount}</h4>
                      </div>
                      <div className="bg-warning bg-opacity-10 text-warning p-2.5 rounded-3">
                        <RefreshCw size={20} className={pendingOrdersCount > 0 ? "spin" : ""} />
                      </div>
                    </div>
                    <div className="small text-muted mt-2">À confirmer par tél.</div>
                  </div>
                </div>

                <div className="col-lg col-md-4 col-6">
                  <div className="card shadow-sm border p-3 bg-white rounded-3 h-100">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="text-muted small fw-bold text-uppercase">Total Produits</span>
                        <h4 className="fw-bold mt-1 mb-0">{products.length}</h4>
                      </div>
                      <div className="bg-info bg-opacity-10 text-info p-2.5 rounded-3">
                        <Layers size={20} />
                      </div>
                    </div>
                    <div className="small text-muted mt-2">({products.filter(p => p.isSoldOut).length} épuisés)</div>
                  </div>
                </div>

                <div className="col-lg col-md-4 col-6">
                  <div className="card shadow-sm border p-3 bg-white rounded-3 h-100" onClick={() => setActiveTab('messages')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="text-muted small fw-bold text-uppercase">Messages</span>
                        <h4 className="fw-bold mt-1 mb-0" style={{ color: 'rgb(147, 51, 234)' }}>{contacts.length}</h4>
                      </div>
                      <div className="p-2.5 rounded-3" style={{ backgroundColor: 'rgba(147, 51, 234, 0.1)', color: 'rgb(147, 51, 234)' }}>
                        <MessageSquare size={20} />
                      </div>
                    </div>
                    <div className="small text-muted mt-2">Reçus via contact</div>
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="card border shadow-sm rounded-4 bg-white overflow-hidden">
                <div className="card-header bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold m-0">Commandes Récentes</h5>
                  <button onClick={() => setActiveTab('orders')} className="btn btn-outline-dark btn-sm rounded-pill px-3">Tout Voir</button>
                </div>
                <div className="table-responsive">
                  <table className="table align-middle mb-0" style={{ fontSize: '0.85rem' }}>
                    <thead className="table-light">
                      <tr className="border-bottom">
                        <th className="py-2.5 px-3">Commande</th>
                        <th>Client & Contact</th>
                        <th>Adresse de Livraison</th>
                        <th>Articles</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 4).map((order) => (
                        <tr key={order.id} className="border-bottom">
                          <td className="py-3 px-3">
                            <div className="fw-bold text-orange">#{order.id.toString().slice(-6)}</div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>{order.date}</div>
                          </td>
                          <td>
                            <div className="fw-bold">{order.customer.fullName}</div>
                            <div className="text-muted" style={{ fontSize: '0.78rem' }}>📞 {order.customer.phone}</div>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px', fontSize: '0.8rem' }} title={order.customer.address}>
                              {order.customer.address}
                            </div>
                            <span className="badge bg-light text-dark border mt-0.5" style={{ fontSize: '0.72rem' }}>
                              {order.customer.city}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.78rem', maxWidth: '220px' }}>
                              {order.items.map((item, idx) => (
                                <div key={idx} className="text-truncate" title={item.product.title}>
                                  • {item.product.title} <strong>(x{item.quantity})</strong>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="text-center fw-bold">{order.total} DH</td>
                          <td className="text-center">
                            <span className={`badge rounded-pill px-2.5 py-1 ${order.status === 'Confirmé' ? 'bg-success' : order.status === 'Annulé' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Messages Overview */}
              <div className="card border shadow-sm rounded-4 bg-white overflow-hidden mt-4 text-start">
                <div className="card-header bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold m-0">Messages de Contact Récents</h5>
                  <button onClick={() => setActiveTab('messages')} className="btn btn-outline-dark btn-sm rounded-pill px-3">Tout Voir</button>
                </div>
                <div className="p-3">
                  {contacts.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      Aucun message reçu pour le moment.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {contacts.slice(0, 3).map((msg) => (
                        <div key={msg.id} className="p-3 rounded-3 border bg-light bg-opacity-25 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                          <div className="d-flex gap-3 align-items-start">
                            <div className="p-2 rounded-circle bg-orange bg-opacity-10 text-orange d-none d-sm-block mt-1">
                              <MessageSquare size={18} />
                            </div>
                            <div>
                              <div className="d-flex align-items-center gap-2 flex-wrap">
                                <h6 className="fw-bold m-0">{msg.name}</h6>
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>&lt;{msg.email}&gt;</span>
                                <span className="badge bg-light text-dark border px-2 py-0.5" style={{ fontSize: '0.7rem' }}>{msg.date}</span>
                              </div>
                              <div className="fw-semibold text-dark mt-1" style={{ fontSize: '0.85rem' }}>
                                Sujet: <span className="text-orange">{msg.subject}</span>
                              </div>
                              <p className="text-muted m-0 mt-1.5 text-truncate" style={{ fontSize: '0.82rem', maxWidth: '600px' }}>
                                {msg.message}
                              </p>
                            </div>
                          </div>
                          <div className="d-flex gap-2 align-self-end align-self-md-center">
                            <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`} className="btn btn-sm btn-outline-orange rounded-pill px-2.5 d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                              <Mail size={12} />
                              <span>Répondre</span>
                            </a>
                            <button onClick={() => handleDeleteContact(msg.id)} className="btn btn-sm btn-outline-danger rounded-circle p-1.5 d-flex align-items-center justify-content-center" title="Supprimer">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLIENT ORDERS */}
          {activeTab === 'orders' && (
            <div className="card border shadow-sm rounded-4 bg-white overflow-hidden">
              <div className="card-header bg-light border-bottom p-3.5 d-flex flex-wrap justify-content-between align-items-center gap-3">
                <h5 className="fw-bold m-0">Gestion des Commandes Client</h5>
                <div className="position-relative" style={{ maxWidth: '300px', width: '100%' }}>
                  <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                    <Search size={16} />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Rechercher une commande..." 
                    className="form-control rounded-pill ps-5" 
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem 0.5rem 2.5rem' }}
                  />
                </div>
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
                      <th className="text-end py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrdersList.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          Aucune commande ne correspond aux critères.
                        </td>
                      </tr>
                    ) : (
                      filteredOrdersList.map((order) => (
                        <tr key={order.id} className="border-bottom">
                          <td className="py-3 px-4">
                            <div className="fw-bold text-orange">#{order.id.toString().slice(-6)}</div>
                            <div className="text-muted d-flex align-items-center gap-1 mt-1" style={{ fontSize: '0.72rem' }}>
                              <Calendar size={12} />
                              <span>{order.date}</span>
                            </div>
                          </td>

                          <td>
                            <div className="fw-bold">{order.customer.fullName}</div>
                            <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                              📞 {order.customer.phone} <br />
                              📍 {order.customer.address}, <strong>{order.customer.city}</strong>
                            </div>
                          </td>

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

                          <td className="text-center fw-bold text-dark fs-6">{order.total} DH</td>

                          <td className="text-center">
                            <span className={`badge rounded-pill px-3 py-1.5 fw-bold ${
                              order.status === 'Confirmé' 
                                ? 'bg-success text-white' 
                                : order.status === 'Annulé' 
                                  ? 'bg-danger text-white' 
                                  : 'bg-warning text-dark'
                            }`}>
                              {order.status}
                            </span>
                          </td>

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

          {/* TAB 3: PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div className="card border shadow-sm rounded-4 bg-white overflow-hidden">
              <div className="card-header bg-light border-bottom p-3.5 d-flex flex-wrap justify-content-between align-items-center gap-3">
                <h5 className="fw-bold m-0">Gestion du Catalogue Produits</h5>
                <div className="d-flex gap-2.5 flex-grow-1 flex-md-grow-0" style={{ maxWidth: '450px', width: '100%' }}>
                  <div className="position-relative w-100">
                    <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                      <Search size={16} />
                    </span>
                    <input 
                      type="text" 
                      placeholder="Rechercher un produit..." 
                      className="form-control rounded-pill ps-5" 
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                  <button onClick={() => openModal()} className="btn btn-primary rounded-pill py-2 px-3.5 d-flex align-items-center gap-1.5 fw-bold shrink-0" style={{ fontSize: '0.82rem' }}>
                    <Plus size={16} />
                    <span>Ajouter</span>
                  </button>
                </div>
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
                    {filteredProductsList.map((p) => (
                      <tr key={p.id} className="border-bottom">
                        <td className="py-2 px-4">
                          <div className="d-flex align-items-center gap-3">
                            <div className="border rounded p-1 bg-white" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                              <img src={p.image} alt={p.title} className="w-100 h-100 object-fit-contain" />
                            </div>
                            <div>
                              <div className="fw-bold text-truncate" style={{ maxWidth: '250px' }} title={p.title}>{p.title}</div>
                              {p.discount && <span className="badge bg-danger rounded-pill mt-0.5">-{p.discount}%</span>}
                              {p.variants && (
                                <span className="badge bg-secondary rounded-pill ms-2" style={{ fontSize: '0.65rem' }}>
                                  Variantes : {p.variants.map(v => v.name).join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td>{p.brand}</td>

                        <td>
                          <span className="badge bg-light text-dark border">{p.categoryLabel}</span>
                        </td>

                        <td className="text-center">
                          <div className="fw-bold">{p.price} DH</div>
                          {p.oldPrice && <div className="text-muted text-decoration-line-through small" style={{ fontSize: '0.78rem' }}>{p.oldPrice} DH</div>}
                        </td>

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

          {/* TAB 4: CATEGORY MANAGEMENT */}
          {activeTab === 'categories' && (
            <div>
              {selectedCategoryMapping ? (
                // Mapping Assignment Panel
                <div className="card border shadow-sm rounded-4 bg-white p-4">
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <button onClick={() => setSelectedCategoryMapping(null)} className="btn btn-outline-dark btn-sm rounded-circle p-1 d-inline-flex">
                        <X size={16} />
                      </button>
                      <h4 className="fw-bold m-0 text-dark">
                        Gérer les produits : <span className="text-orange">{selectedCategoryMapping.name}</span>
                      </h4>
                    </div>
                    <span className="badge bg-dark rounded-pill py-1.5 px-3">
                      {products.filter(p => p.category === selectedCategoryMapping.id).length} produits
                    </span>
                  </div>

                  <p className="text-muted small">Sélectionnez les produits qui appartiennent à cette catégorie. Le changement est immédiat et automatique.</p>
                  
                  {/* Search mapping list */}
                  <div className="position-relative mb-4" style={{ maxWidth: '380px' }}>
                    <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                      <Search size={16} />
                    </span>
                    <input 
                      type="text" 
                      placeholder="Filtrer les produits par nom..." 
                      className="form-control rounded-pill ps-5" 
                      value={mappingSearchQuery}
                      onChange={(e) => setMappingSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* List of products with quick checkbox mapping toggles */}
                  <div className="border rounded-3 overflow-hidden bg-light" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                    <table className="table table-hover align-middle mb-0 bg-white" style={{ fontSize: '0.88rem' }}>
                      <thead className="table-light position-sticky top-0" style={{ zIndex: 10 }}>
                        <tr>
                          <th className="py-2.5 px-4" style={{ width: '60px' }}>Appartient</th>
                          <th>Produit</th>
                          <th>Marque</th>
                          <th>Catégorie actuelle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products
                          .filter(p => p.title.toLowerCase().includes(mappingSearchQuery.toLowerCase()))
                          .map(p => {
                            const isAssigned = p.category === selectedCategoryMapping.id;
                            return (
                              <tr key={p.id} className={isAssigned ? 'table-warning bg-opacity-10' : ''}>
                                <td className="text-center py-2.5 px-4">
                                  <input 
                                    type="checkbox"
                                    className="form-check-input border-secondary"
                                    checked={isAssigned}
                                    onChange={(e) => handleToggleProductCategory(p, e.target.checked)}
                                    style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                                  />
                                </td>
                                <td>
                                  <div className="d-flex align-items-center gap-2.5">
                                    <img src={p.image} alt="" className="border rounded bg-white" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                                    <span className="fw-semibold text-dark text-truncate" style={{ maxWidth: '300px' }}>{p.title}</span>
                                  </div>
                                </td>
                                <td>{p.brand}</td>
                                <td>
                                  {isAssigned ? (
                                    <span className="badge bg-orange text-white">Cette catégorie</span>
                                  ) : (
                                    <span className="badge bg-light text-muted border">{p.categoryLabel || 'Aucune'}</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 pt-3 border-top d-flex justify-content-end">
                    <button onClick={() => setSelectedCategoryMapping(null)} className="btn btn-primary rounded-pill px-4.5 py-2 fw-semibold">
                      Terminer et Retourner
                    </button>
                  </div>
                </div>
              ) : (
                // Categories List and Actions Panel
                <div className="card border shadow-sm rounded-4 bg-white overflow-hidden">
                  <div className="card-header bg-light border-bottom p-3.5 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold m-0">Gestion des Catégories</h5>
                    <button onClick={() => openCategoryModal()} className="btn btn-primary rounded-pill py-2 px-3.5 d-flex align-items-center gap-1.5 fw-bold" style={{ fontSize: '0.82rem' }}>
                      <Plus size={16} />
                      <span>Ajouter une Catégorie</span>
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.88rem' }}>
                      <thead className="table-light">
                        <tr className="border-bottom" style={{ fontWeight: '600' }}>
                          <th className="py-3 px-4">Nom de la Catégorie</th>
                          <th>Slug ID (Utilisé en URL)</th>
                          <th className="text-center">Nombre de Produits</th>
                          <th className="text-end py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat) => {
                          const productCount = products.filter(p => p.category === cat.id).length;
                          return (
                            <tr key={cat.id} className="border-bottom">
                              <td className="py-3 px-4">
                                <div className="d-flex align-items-center gap-2">
                                  <Folder size={18} className="text-orange" />
                                  <span className="fw-bold text-dark fs-6">{cat.name}</span>
                                </div>
                              </td>

                              <td>
                                <code className="bg-light text-muted px-2 py-1 rounded small">{cat.id}</code>
                              </td>

                              <td className="text-center fw-semibold">
                                {productCount}
                              </td>

                              <td className="text-end py-3 px-4">
                                <div className="d-flex justify-content-end gap-2">
                                  <button 
                                    onClick={() => setSelectedCategoryMapping(cat)}
                                    className="btn btn-outline-orange btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1.5 fw-semibold"
                                    title="Gérer les produits dans cette catégorie"
                                  >
                                    <ArrowLeftRight size={14} />
                                    <span>Gérer les produits</span>
                                  </button>
                                  <button 
                                    onClick={() => openCategoryModal(cat)}
                                    className="btn btn-outline-dark btn-sm rounded-circle p-1.5 d-inline-flex"
                                    title="Modifier le nom de la catégorie"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="btn btn-outline-danger btn-sm rounded-circle p-1.5 d-inline-flex"
                                    title="Supprimer la catégorie"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SECURITY SETTINGS */}
          {activeTab === 'security' && (
            <div className="card border shadow-sm rounded-4 bg-white p-4 text-start" style={{ maxWidth: '600px' }}>
              <div className="d-flex align-items-center gap-2.5 border-bottom pb-3 mb-4">
                <Key size={24} className="text-orange" />
                <h4 className="fw-bold m-0 text-dark">Paramètres de Sécurité Admin</h4>
              </div>

              <p className="text-muted small mb-4">
                Configurez l'adresse email et le mot de passe requis pour accéder à cet espace d'administration. Les modifications sont enregistrées localement dans votre navigateur.
              </p>

              {securityError && (
                <div className="alert alert-danger py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-3">
                  <AlertCircle size={16} />
                  <span>{securityError}</span>
                </div>
              )}

              {securitySuccess && (
                <div className="alert alert-success py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-3">
                  <CheckCircle size={16} className="text-success" />
                  <span>{securitySuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdateSecurity}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Adresse E-mail de Connexion</label>
                  <input 
                    type="email" 
                    required 
                    className="form-control rounded-3" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="admin@bicyclehouse.ma"
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Nouveau Mot de Passe (laisser vide pour ne pas changer)</label>
                    <input 
                      type="password" 
                      className="form-control rounded-3" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Confirmer le Mot de passe</label>
                    <input 
                      type="password" 
                      className="form-control rounded-3" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary rounded-pill py-2.5 px-4 fw-bold">
                  Enregistrer les modifications
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div>
              {/* Header */}
              <div className="card shadow-sm border-0 p-4 bg-white rounded-4 mb-4 text-start">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div>
                    <h2 className="fw-bold text-dark m-0" style={{ fontFamily: 'var(--pk-font-heading)' }}>Messages Client</h2>
                    <p className="text-muted mb-0 mt-1">Consultez et répondez aux messages envoyés par les clients depuis la page de contact.</p>
                  </div>
                  <div className="p-2.5 rounded-3 text-white" style={{ backgroundColor: 'var(--pk-orange)' }}>
                    <MessageSquare size={24} />
                  </div>
                </div>
              </div>

              {/* Filters / Search */}
              <div className="card border shadow-sm rounded-4 bg-white p-3 mb-4">
                <div className="row g-2 align-items-center">
                  <div className="col-12 col-md-6 position-relative">
                    <span className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted">
                      <Search size={16} />
                    </span>
                    <input 
                      type="text" 
                      placeholder="Rechercher par nom, email, sujet..." 
                      className="form-control rounded-pill ps-5"
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 text-md-end text-muted small">
                    Total: <strong>{contacts.length} messages</strong>
                  </div>
                </div>
              </div>

              {/* Messages Content */}
              {(() => {
                const filteredContacts = contacts.filter(c => {
                  const term = contactSearch.toLowerCase();
                  return (
                    (c.name || '').toLowerCase().includes(term) ||
                    (c.email || '').toLowerCase().includes(term) ||
                    (c.subject || '').toLowerCase().includes(term) ||
                    (c.message || '').toLowerCase().includes(term)
                  );
                });

                if (filteredContacts.length === 0) {
                  return (
                    <div className="card border shadow-sm rounded-4 bg-white p-5 text-center">
                      <div className="d-inline-flex bg-light text-muted rounded-circle p-3 mb-3 mx-auto">
                        <MessageSquare size={32} />
                      </div>
                      <h5 className="fw-bold text-dark">Aucun message trouvé</h5>
                      <p className="text-muted mb-0">Essayez un autre mot-clé ou attendez de nouveaux messages des clients.</p>
                    </div>
                  );
                }

                return (
                  <div className="row g-3">
                    {filteredContacts.map((msg) => (
                      <div key={msg.id} className="col-12">
                        <div className="card border shadow-sm rounded-4 bg-white p-4 text-start h-100 transition-hover">
                          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 border-bottom pb-3 mb-3">
                            <div>
                              <div className="d-flex align-items-center gap-2 flex-wrap">
                                <div className="avatar-circle-sm bg-orange text-white fw-bold d-flex align-items-center justify-content-center rounded-circle" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                                  {(msg.name || 'C').charAt(0).toUpperCase()}
                                </div>
                                <h5 className="fw-bold m-0 text-dark">{msg.name}</h5>
                                <a href={`mailto:${msg.email}`} className="text-muted text-decoration-none hover-underline small" style={{ fontSize: '0.82rem' }}>
                                  &lt;{msg.email}&gt;
                                </a>
                              </div>
                              <div className="badge bg-light text-dark border mt-2 px-2.5 py-1" style={{ fontSize: '0.75rem' }}>
                                Sujet: <span className="text-orange fw-bold">{msg.subject}</span>
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2.5 ms-md-auto self-end-mobile">
                              <span className="text-muted small d-flex align-items-center gap-1">
                                <Calendar size={14} />
                                <span>{msg.date || new Date(msg.createdAt).toLocaleString()}</span>
                              </span>
                              <div className="d-flex gap-2">
                                <a 
                                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || '')}`} 
                                  className="btn btn-sm btn-orange rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5"
                                  style={{ fontSize: '0.78rem' }}
                                >
                                  <Mail size={14} />
                                  <span>Répondre</span>
                                </a>
                                <button 
                                  onClick={() => handleDeleteContact(msg.id)} 
                                  className="btn btn-sm btn-outline-danger rounded-circle p-1.5 d-flex align-items-center justify-content-center"
                                  title="Supprimer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="bg-light bg-opacity-25 rounded-3 p-3 border border-dashed text-dark" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* ADD/EDIT PRODUCT MODAL */}
      {showProductModal && (
        <div className="modal show d-block animate-fade-in" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="modal-header border-bottom px-4 py-3 bg-light">
                <h5 className="modal-title fw-bold text-orange d-flex align-items-center gap-2">
                  <Archive size={18} />
                  <span>{editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}</span>
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
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
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

                    {/* Description */}
                    <div className="col-12 text-start">
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

                    {/* Dynamic Variant Builder */}
                    <div className="col-12 mt-4 text-start">
                      <div className="card bg-light border p-3 rounded-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="fw-bold m-0 text-dark" style={{ fontSize: '0.9rem' }}>
                            Variantes du produit (Couleurs, Tailles, Options...)
                          </h6>
                          <button 
                            type="button" 
                            onClick={handleAddVariant} 
                            className="btn btn-sm btn-orange rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
                          >
                            <Plus size={14} />
                            <span>Ajouter une variante</span>
                          </button>
                        </div>

                        {productVariants.length === 0 ? (
                          <div className="text-center py-4 text-muted small bg-white rounded-3 border border-dashed">
                            Aucune variante configurée. Ce produit sera vendu en option unique.
                          </div>
                        ) : (
                          <div className="d-flex flex-column gap-3">
                            {productVariants.map((variant, vIdx) => (
                              <div key={vIdx} className="p-3 bg-white border rounded-3 text-start position-relative animate-fade-in">
                                {/* Remove Variant Button */}
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveVariant(vIdx)}
                                  className="btn btn-outline-danger btn-sm rounded-circle p-1 position-absolute top-0 end-0 m-2.5 d-flex align-items-center justify-content-center border"
                                  style={{ width: '24px', height: '24px' }}
                                  title="Supprimer la variante"
                                >
                                  <X size={12} />
                                </button>

                                <div className="row g-2 mb-3 pe-4">
                                  {/* Variant Name */}
                                  <div className="col-md-6 text-start">
                                    <label className="form-label small fw-bold text-muted mb-1">Nom de la variante</label>
                                    <input 
                                      type="text" 
                                      required 
                                      className="form-control form-control-sm rounded-3" 
                                      value={variant.name} 
                                      onChange={(e) => handleUpdateVariantField(vIdx, 'name', e.target.value)}
                                      placeholder="ex: Couleur, Taille, Modèle..."
                                    />
                                  </div>
                                  {/* Variant Type */}
                                  <div className="col-md-6 text-start">
                                    <label className="form-label small fw-bold text-muted mb-1">Type de variante</label>
                                    <select 
                                      className="form-select form-select-sm rounded-3" 
                                      value={variant.type} 
                                      onChange={(e) => handleUpdateVariantField(vIdx, 'type', e.target.value)}
                                    >
                                      <option value="text">Texte / Option simple</option>
                                      <option value="color">Couleur / Code couleur</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Options list */}
                                <div className="ps-2.5 border-start border-3 border-light text-start">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="small fw-bold text-dark">Options de la variante</span>
                                    <button 
                                      type="button" 
                                      onClick={() => handleAddOption(vIdx)} 
                                      className="btn btn-sm btn-outline-dark rounded-pill py-0.5 px-2.5" 
                                      style={{ fontSize: '0.75rem' }}
                                    >
                                      + Ajouter option
                                    </button>
                                  </div>

                                  {variant.options.length === 0 ? (
                                    <div className="text-muted small py-2 text-center" style={{ fontSize: '0.8rem' }}>
                                      Ajoutez au moins une option (ex: Noir, XL...)
                                    </div>
                                  ) : (
                                    <div className="d-flex flex-column gap-2">
                                      {variant.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="d-flex align-items-center gap-2 flex-wrap">
                                          {/* Option Value */}
                                          <div className="flex-grow-1" style={{ minWidth: '120px' }}>
                                            <input 
                                              type="text" 
                                              required 
                                              className="form-control form-control-sm rounded-3" 
                                              value={opt.value} 
                                              onChange={(e) => handleUpdateOptionField(vIdx, oIdx, 'value', e.target.value)}
                                              placeholder="ex: Rouge, Noir, XL..."
                                            />
                                          </div>

                                          {/* If variant type is color, show color picker & code input */}
                                          {variant.type === 'color' && (
                                            <div className="d-flex align-items-center gap-1.5">
                                              <input 
                                                type="color" 
                                                className="form-control form-control-color form-control-sm border rounded" 
                                                style={{ width: '30px', height: '30px', padding: '1px' }}
                                                value={opt.code || '#000000'} 
                                                onChange={(e) => handleUpdateOptionField(vIdx, oIdx, 'code', e.target.value)}
                                              />
                                              <input 
                                                type="text" 
                                                className="form-control form-control-sm rounded-3" 
                                                style={{ width: '80px', fontSize: '0.8rem' }}
                                                value={opt.code || '#000000'} 
                                                onChange={(e) => handleUpdateOptionField(vIdx, oIdx, 'code', e.target.value)}
                                                placeholder="#HEX"
                                              />
                                            </div>
                                          )}

                                          {/* Option Image association from uploadedImages list */}
                                          {uploadedImages.length > 0 && (
                                            <div className="flex-grow-1" style={{ minWidth: '160px' }}>
                                              <select 
                                                className="form-select form-select-sm rounded-3" 
                                                style={{ fontSize: '0.8rem' }}
                                                value={opt.image || ''} 
                                                onChange={(e) => handleUpdateOptionField(vIdx, oIdx, 'image', e.target.value)}
                                              >
                                                <option value="">Image par défaut</option>
                                                {uploadedImages.map((img, imgIdx) => (
                                                  <option key={imgIdx} value={img}>
                                                    Photo {imgIdx + 1}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          )}

                                          {/* Remove Option Button */}
                                          <button 
                                            type="button" 
                                            onClick={() => handleRemoveOption(vIdx, oIdx)}
                                            className="btn btn-outline-danger btn-sm rounded-circle p-1 d-flex align-items-center justify-content-center"
                                            style={{ width: '24px', height: '24px' }}
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

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

      {/* ADD/EDIT CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="modal show d-block animate-fade-in" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '450px' }}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="modal-header border-bottom px-4 py-3 bg-light">
                <h5 className="modal-title fw-bold text-orange d-flex align-items-center gap-2">
                  <Folder size={18} />
                  <span>{editingCategory ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}</span>
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowCategoryModal(false)}></button>
              </div>

              <form onSubmit={handleCategorySubmit} className="text-start">
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Nom de la Catégorie *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control rounded-3" 
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ name: e.target.value })}
                      placeholder="ex: Accessoires Pro"
                      style={{ padding: '0.65rem 0.85rem' }}
                    />
                  </div>
                </div>

                <div className="modal-footer border-top px-4 py-3 bg-light">
                  <button type="button" className="btn btn-outline-dark rounded-pill py-2 px-3.5" onClick={() => setShowCategoryModal(false)}>
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
