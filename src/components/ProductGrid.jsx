import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ 
  products, 
  onAddToCart, 
  onProductClick, 
  viewMode,
  itemsPerPage,
  currentPage = 1,
  onPageChange
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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);


  return (
    <div>
      <div className={viewMode === 'grid' ? "row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-2 g-md-4" : "d-flex flex-column"}>
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
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                {currentPage === 1 ? (
                  <span className="page-link border-0 text-muted" style={{ fontSize: '0.9rem' }}>Précédent</span>
                ) : (
                  <button 
                    onClick={() => onPageChange(currentPage - 1)} 
                    className="page-link border-0 text-dark bg-white" 
                    style={{ fontSize: '0.9rem' }}
                  >
                    Précédent
                  </button>
                )}
              </li>
              {pages.map((page) => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  {currentPage === page ? (
                    <span 
                      className="page-link border-0 text-white" 
                      style={{ 
                        backgroundColor: 'var(--pk-orange)', 
                        borderColor: 'var(--pk-orange)', 
                        fontSize: '0.9rem', 
                        padding: '0.5rem 1rem' 
                      }}
                    >
                      {page}
                    </span>
                  ) : (
                    <button 
                      onClick={() => onPageChange(page)} 
                      className="page-link border-0 text-dark bg-white" 
                      style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                    >
                      {page}
                    </button>
                  )}
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                {currentPage === totalPages ? (
                  <span className="page-link border-0 text-muted" style={{ fontSize: '0.9rem' }}>Suivant</span>
                ) : (
                  <button 
                    onClick={() => onPageChange(currentPage + 1)} 
                    className="page-link border-0 text-dark bg-white" 
                    style={{ fontSize: '0.9rem' }}
                  >
                    Suivant
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
