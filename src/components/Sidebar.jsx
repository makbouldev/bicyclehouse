import React from 'react';
import { CATEGORIES } from '../data/products';
import { ChevronRight } from 'lucide-react';

const Sidebar = ({ activeCategory, setActiveCategory, onClose }) => {
  const handleCategorySelect = (id) => {
    setActiveCategory(id);
    if (onClose) onClose(); // Close drawer if in mobile mode
  };

  return (
    <div className="bg-white p-3 border rounded-3 shadow-sm h-100">
      <h5 className="mb-3 pb-2 border-bottom fw-bold" style={{ letterSpacing: '-0.5px' }}>
        Catégories
      </h5>
      <div className="d-flex flex-column gap-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className={`btn btn-link p-0 text-start text-decoration-none category-item ${activeCategory === cat.id ? 'active' : ''}`}
            style={{ border: 'none' }}
          >
            <span className="d-flex align-items-center gap-1">
              {activeCategory === cat.id && <ChevronRight size={14} className="text-orange" />}
              {cat.name}
            </span>
            <span className="category-count">{cat.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
