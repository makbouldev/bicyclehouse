import React from 'react';
import { LayoutGrid, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const Toolbar = ({
  filteredCount,
  itemsPerPage,
  setItemsPerPage,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onSidebarToggle,
  currentPage = 1
}) => {
  const start = filteredCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(filteredCount, currentPage * itemsPerPage);

  return (
    <div className="bg-white border rounded-3 p-3 mb-4 shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
      {/* Left: Result Counter & Mobile Filter Trigger */}
      <div className="d-flex align-items-center justify-content-between justify-content-md-start gap-3">
        <button 
          onClick={onSidebarToggle} 
          className="btn btn-outline-dark d-flex d-lg-none align-items-center gap-2 rounded-pill px-3 py-1.5"
          style={{ fontSize: '0.85rem' }}
        >
          <SlidersHorizontal size={16} />
          <span>Filtres</span>
        </button>
        
        <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Affichage de {start}–{end} sur {filteredCount} résultats
        </span>
      </div>

      {/* Right: Show, ViewMode, Sort */}
      <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-md-end gap-4">

        {/* View Mode Switches */}
        <div className="d-flex align-items-center gap-2 border-end pe-4">
          <button 
            onClick={() => setViewMode('grid')}
            className={`btn btn-link p-1.5 border rounded ${viewMode === 'grid' ? 'bg-light text-orange' : 'text-muted'}`}
            style={{ borderColor: viewMode === 'grid' ? 'var(--pk-orange)' : 'var(--pk-border-color)' }}
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`btn btn-link p-1.5 border rounded ${viewMode === 'list' ? 'bg-light text-orange' : 'text-muted'}`}
            style={{ borderColor: viewMode === 'list' ? 'var(--pk-orange)' : 'var(--pk-border-color)' }}
          >
            <List size={16} />
          </button>
        </div>

        {/* Sort Select */}
        <div className="d-flex align-items-center gap-3">
          <ArrowUpDown size={16} className="text-muted" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select rounded-pill px-3 py-1.5"
            style={{ fontSize: '0.85rem', width: 'auto', border: '1px solid var(--pk-border-color)' }}
          >
            <option value="popularity">Tri par popularité</option>
            <option value="price-asc">Prix : croissant</option>
            <option value="price-desc">Prix : décroissant</option>
            <option value="name-asc">Nom : A à Z</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
