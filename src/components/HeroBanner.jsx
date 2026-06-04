import React from 'react';
import bannerImg from '../assets/boutique_banner.png';
import { CATEGORIES } from '../data/products';
import { Folder } from 'lucide-react';

const HeroBanner = ({ activeCategory, setActiveCategory, categories = CATEGORIES }) => {
  return (
    <div 
      className="boutique-banner text-start border-0 shadow-sm"
      style={{ 
        backgroundImage: `url(${bannerImg})`,
        minHeight: '260px'
      }}
    >
      <div className="boutique-banner-content d-flex flex-column justify-content-center h-100">
        <h1 className="display-4 fw-bold text-white mb-2" style={{ fontFamily: 'var(--pk-font-heading)', fontSize: '2.5rem' }}>
          Boutique
        </h1>
        
        {/* Desktop category horizontal links */}
        <div className="d-none d-lg-flex flex-wrap align-items-center gap-4 mt-3">
          {categories.map((cat) => {
            if (cat.id === 'all') return null; // Don't show "Toutes les catégories" in the banner list
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`btn btn-link p-0 text-start text-decoration-none banner-category-link ${activeCategory === cat.id ? 'active' : ''}`}
                style={{ border: 'none', background: 'none' }}
              >
                <div className="text-white fw-bold mb-0.5" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                  {cat.name.toUpperCase()}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                  {cat.count} Products
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile category folder details */}
        <div className="d-flex d-lg-none align-items-center gap-2 mt-2 bg-white bg-opacity-20 backdrop-blur rounded-3 p-2.5" style={{ width: 'fit-content', border: '1px solid rgba(255,255,255,0.15)' }}>
          <Folder size={18} className="text-white" />
          <span className="text-white fw-bold" style={{ fontSize: '0.85rem' }}>
            {categories.find(c => c.id === activeCategory)?.name || 'Catégories'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
