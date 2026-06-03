import React from 'react';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Header = ({
  searchQuery,
  setSearchQuery,
  cartItemsCount,
  cartTotal,
  onCartClick,
  setView,
  currentView,
  onMobileMenuToggle
}) => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <header className="bg-white border-bottom sticky-top shadow-sm">
      {/* Desktop Top Small Utility Bar */}
      <div className="d-none d-lg-block bg-white border-bottom py-1">
        <div className="container-fluid px-4 d-flex justify-content-end gap-4">
          <button onClick={() => setView('about')} className="btn btn-link p-0 top-nav-link text-decoration-none">À Propos</button>
          <button onClick={() => setView('contact')} className="btn btn-link p-0 top-nav-link text-decoration-none">Contactez-Nous</button>
          <button onClick={() => setView('faqs')} className="btn btn-link p-0 top-nav-link text-decoration-none">FAQs</button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="container-fluid px-3 px-lg-4 py-3">
        {/* Desktop Header Layout */}
        <div className="d-none d-lg-flex align-items-center justify-content-between gap-3">
          {/* Logo */}
          <div 
            className="d-flex align-items-center gap-2 cursor-pointer" 
            style={{ cursor: 'pointer' }}
            onClick={() => setView('shop')}
          >
            <img src={logoImg} alt="Bicycle House Casablanca Logo" style={{ height: '55px', objectFit: 'contain' }} />
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-grow-1 mx-4" style={{ maxWidth: '600px' }}>
            <div className="position-relative">
              <input
                type="text"
                placeholder="Search for products"
                className="form-control rounded-pill py-2.5 ps-4 pe-5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.9rem', border: '1px solid var(--pk-border-color)' }}
              />
              <Search 
                className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" 
                size={18} 
              />
            </div>
          </form>

          {/* Nav Actions */}
          <div className="d-flex align-items-center gap-3">
            {/* Boutique Button */}
            <button 
              onClick={() => setView('shop')}
              className={`btn ${currentView === 'shop' ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-4 py-2`}
              style={{ fontSize: '0.9rem' }}
            >
              Boutique
            </button>


            {/* Cart */}
            <button 
              className="btn btn-link p-0 text-dark d-flex align-items-center gap-2 text-decoration-none" 
              onClick={onCartClick}
            >
              <div className="position-relative">
                <ShoppingCart size={22} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem', backgroundColor: 'var(--pk-orange) !important' }}>
                  {cartItemsCount}
                </span>
              </div>
              <span className="fw-bold" style={{ fontSize: '0.95rem' }}>{cartTotal} DH</span>
            </button>
          </div>
        </div>

        {/* Mobile Header Layout */}
        <div className="d-flex d-lg-none flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between">
            {/* Mobile Menu Trigger */}
            <button className="btn p-0 d-flex align-items-center text-dark border-0" onClick={onMobileMenuToggle}>
              <Menu size={24} />
            </button>

            {/* Logo */}
            <div 
              className="d-flex align-items-center gap-1.5 cursor-pointer" 
              onClick={() => setView('shop')}
            >
              <img src={logoImg} alt="Bicycle House Casablanca Logo" style={{ height: '42px', objectFit: 'contain' }} />
            </div>

            {/* Mobile Cart */}
            <button 
              className="btn p-0 text-dark d-flex align-items-center gap-1.5 text-decoration-none border-0" 
              onClick={onCartClick}
            >
              <div className="position-relative me-1">
                <ShoppingCart size={24} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  {cartItemsCount}
                </span>
              </div>
              <span className="fw-bold" style={{ fontSize: '0.9rem' }}>{cartTotal} DH</span>
            </button>
          </div>

          {/* Mobile Search Bar below */}
          <form onSubmit={handleSearchSubmit} className="w-100">
            <div className="position-relative">
              <input
                type="text"
                placeholder="Search for products"
                className="form-control rounded-pill py-2 ps-4 pe-5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.85rem', border: '1px solid var(--pk-border-color)' }}
              />
              <Search 
                className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" 
                size={16} 
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
