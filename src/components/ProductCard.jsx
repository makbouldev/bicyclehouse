import React, { useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onProductClick, 
  viewMode = 'grid'
}) => {
  const [imgError, setImgError] = useState(false);

  const {
    title,
    brand,
    categoryLabel,
    price,
    oldPrice,
    discount,
    isSoldOut,
    description
  } = product;

  // Render a beautiful, professional SVG fallback depending on product details
  const renderSVGFallback = () => {
    let strokeColor = 'var(--pk-orange)';
    let fillColor = 'var(--pk-orange-light)';
    let pathDetails = null;

    if (title.toLowerCase().includes('frein') || title.toLowerCase().includes('huile')) {
      // Brake oil bottle representation
      strokeColor = '#DC3545';
      fillColor = 'rgba(220, 53, 69, 0.1)';
      pathDetails = (
        <>
          <rect x="35" y="45" width="30" height="45" rx="5" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <rect x="43" y="25" width="14" height="20" stroke={strokeColor} strokeWidth="3" fill="none" />
          <line x1="40" y1="45" x2="60" y2="45" stroke={strokeColor} strokeWidth="3" />
          <line x1="43" y1="35" x2="57" y2="35" stroke={strokeColor} strokeWidth="2" />
          {/* Drops */}
          <path d="M50,60 C47,65 53,65 50,60 Z" fill={strokeColor} />
        </>
      );
    } else if (title.toLowerCase().includes('lube') || title.toLowerCase().includes('lubrifiant')) {
      // Lubrifiant bottle representation
      strokeColor = '#0D6EFD';
      fillColor = 'rgba(13, 110, 253, 0.1)';
      pathDetails = (
        <>
          <path d="M30,85 L35,50 L45,30 L55,30 L65,50 L70,85 Z" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <rect x="47" y="15" width="6" height="15" stroke={strokeColor} strokeWidth="2" fill="none" />
          <circle cx="50" cy="55" r="10" stroke={strokeColor} strokeWidth="2" fill="none" />
          <path d="M46,55 Q50,50 54,55" stroke={strokeColor} strokeWidth="2" fill="none" />
        </>
      );
    } else if (title.toLowerCase().includes('co2') || title.toLowerCase().includes('cartouche')) {
      // CO2 Cartridge representation
      strokeColor = '#6C757D';
      fillColor = 'rgba(108, 117, 125, 0.1)';
      pathDetails = (
        <>
          <rect x="38" y="35" width="24" height="55" rx="12" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <rect x="46" y="20" width="8" height="15" stroke={strokeColor} strokeWidth="2" fill="none" />
          <line x1="38" y1="65" x2="62" y2="65" stroke={strokeColor} strokeWidth="2" />
        </>
      );
    } else if (title.toLowerCase().includes('plaquette') || title.toLowerCase().includes('frein')) {
      // Brake pads
      strokeColor = '#198754';
      fillColor = 'rgba(25, 135, 84, 0.1)';
      pathDetails = (
        <>
          <rect x="25" y="35" width="50" height="35" rx="4" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <circle cx="50" cy="52" r="6" stroke={strokeColor} strokeWidth="3" fill="none" />
          <path d="M15,52 L25,52 M75,52 L85,52" stroke={strokeColor} strokeWidth="3" />
        </>
      );
    } else if (title.toLowerCase().includes('casque') || title.toLowerCase().includes('helmet')) {
      // Helmet
      strokeColor = '#FFC107';
      fillColor = 'rgba(255, 193, 7, 0.1)';
      pathDetails = (
        <>
          <path d="M20,60 C20,30 80,30 80,60 C80,65 20,65 20,60 Z" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <path d="M30,60 L25,75 L35,72 Z" fill={strokeColor} />
          <path d="M70,60 L75,75 L65,72 Z" fill={strokeColor} />
          <line x1="35" y1="42" x2="45" y2="60" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="50" y1="36" x2="50" y2="60" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="65" y1="42" x2="55" y2="60" stroke={strokeColor} strokeWidth="2.5" />
        </>
      );
    } else if (title.toLowerCase().includes('dérailleur') || title.toLowerCase().includes('chaine') || title.toLowerCase().includes('chaîne')) {
      // Gear / Chain link
      strokeColor = '#0F5132';
      fillColor = 'rgba(15, 81, 50, 0.1)';
      pathDetails = (
        <>
          <circle cx="35" cy="50" r="14" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <circle cx="65" cy="50" r="14" stroke={strokeColor} strokeWidth="3" fill={fillColor} />
          <line x1="35" y1="36" x2="65" y2="36" stroke={strokeColor} strokeWidth="3" />
          <line x1="35" y1="64" x2="65" y2="64" stroke={strokeColor} strokeWidth="3" />
          <circle cx="35" cy="50" r="4" fill={strokeColor} />
          <circle cx="65" cy="50" r="4" fill={strokeColor} />
        </>
      );
    } else {
      // Default Tool/Bike spare part (Cog representation)
      strokeColor = 'var(--pk-orange)';
      fillColor = 'rgba(255, 124, 21, 0.1)';
      pathDetails = (
        <>
          <circle cx="50" cy="50" r="20" stroke={strokeColor} strokeWidth="4" fill={fillColor} />
          <circle cx="50" cy="50" r="8" stroke={strokeColor} strokeWidth="3" fill="none" />
          {/* Teeth */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="50"
              y1="50"
              x2={50 + 26 * Math.cos((angle * Math.PI) / 180)}
              y2={50 + 26 * Math.sin((angle * Math.PI) / 180)}
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
          ))}
        </>
      );
    }

    return (
      <svg viewBox="0 0 100 100" className="w-100 h-100" style={{ padding: '2rem' }}>
        {pathDetails}
      </svg>
    );
  };

  const handleCardClick = (e) => {
    // Avoid triggering card click when action buttons are clicked
    if (e.target.closest('.hover-actions') || e.target.closest('.action-btn')) {
      return;
    }
    onProductClick(product);
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="product-card list-mode border rounded-3 p-3 mb-3 d-flex flex-row align-items-center gap-3 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Discount Tag */}
        {discount && <span className="badge-discount">-{discount}%</span>}
        {isSoldOut && <span className="badge-soldout">Épuisé</span>}

        <div style={{ width: '130px', height: '130px', flexShrink: 0, position: 'relative' }}>
          {!imgError ? (
            <img 
              src={product.image} 
              alt={title} 
              className="w-100 h-100 object-fit-contain p-2"
              onError={() => setImgError(true)}
            />
          ) : (
            renderSVGFallback()
          )}
        </div>

        <div className="flex-grow-1 d-flex flex-column text-start">
          <div className="product-brand">{brand}</div>
          <h4 className="product-title h6 mb-1 text-truncate" style={{ height: 'auto', display: 'block' }}>{title}</h4>
          <div className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>{categoryLabel}</div>
          <p className="product-desc mb-3 d-none d-md-block" style={{ height: 'auto' }}>{description}</p>
          
          <div className="d-flex align-items-center justify-content-between mt-auto">
            <div className="product-price-section">
              <span className="price-current">{price} DH</span>
              {oldPrice && <span className="price-old">{oldPrice} DH</span>}
            </div>

            <div className="d-flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onProductClick(product); }}
                className="action-btn"
                title="Aperçu rapide"
              >
                <Eye size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                className="action-btn"
                disabled={isSoldOut}
                style={{ opacity: isSoldOut ? 0.5 : 1 }}
                title={isSoldOut ? "Épuisé" : "Ajouter au panier"}
              >
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Mode
  return (
    <div 
      className="product-card text-start cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Badges */}
      {discount && <span className="badge-discount">-{discount}%</span>}
      {isSoldOut && <span className="badge-soldout">Épuisé</span>}

      {/* Image container */}
      <div className="image-container">
        {!imgError ? (
          <img 
            src={product.image} 
            alt={title} 
            onError={() => setImgError(true)}
          />
        ) : (
          renderSVGFallback()
        )}
      </div>

      {/* Floating Hover Actions */}
      <div className="hover-actions">
        <button 
          onClick={(e) => { e.stopPropagation(); onProductClick(product); }}
          className="action-btn"
          title="Aperçu rapide"
        >
          <Eye size={16} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="action-btn"
          disabled={isSoldOut}
          style={{ opacity: isSoldOut ? 0.5 : 1 }}
          title={isSoldOut ? "Épuisé" : "Ajouter au panier"}
        >
          <ShoppingCart size={16} />
        </button>
      </div>

      {/* Body Details */}
      <div className="product-card-body">
        <div className="product-brand">{brand}</div>
        <h4 className="product-title" title={title}>
          {title}
        </h4>
        <div className="text-muted mb-2" style={{ fontSize: '0.72rem', height: '1.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {categoryLabel}
        </div>
        
        <div className="product-price-section mt-auto">
          <span className="price-current">{price} DH</span>
          {oldPrice && <span className="price-old">{oldPrice} DH</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
