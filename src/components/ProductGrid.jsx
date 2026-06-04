import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ 
  products, 
  onAddToCart, 
  onProductClick, 
  viewMode,
  itemsPerPage
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-5 border rounded-3 bg-white shadow-sm mt-2">
        <h4 className="fw-bold text-muted mb-2">Aucun produit trouvé</h4>
        <p className="text-muted">Essayez de modifier votre recherche ou de sélectionner une autre catégorie.</p>
      </div>
    );
  }

  // Paginate list
  const paginatedProducts = products.slice(0, itemsPerPage);


  return (
    <div>
      <div className={viewMode === 'grid' ? "row row-cols-2 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 g-2 g-md-4" : "d-flex flex-column"}>
        {paginatedProducts.map((product) => (
          <div key={product.id} className={viewMode === 'grid' ? "col" : ""}>
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
              viewMode={viewMode}
            />
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      {products.length > itemsPerPage && (
        <div className="d-flex justify-content-center mt-5 mb-4">
          <nav aria-label="Product navigation">
            <ul className="pagination rounded-pill overflow-hidden border">
              <li className="page-item disabled">
                <span className="page-link border-0 text-muted" style={{ fontSize: '0.9rem' }}>Précédent</span>
              </li>
              <li className="page-item active">
                <span className="page-link border-0" style={{ backgroundColor: 'var(--pk-orange)', borderColor: 'var(--pk-orange)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>1</span>
              </li>
              <li className="page-item">
                <button className="page-link border-0 text-dark" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>2</button>
              </li>
              <li className="page-item">
                <button className="page-link border-0 text-dark" style={{ fontSize: '0.9rem' }}>Suivant</button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
