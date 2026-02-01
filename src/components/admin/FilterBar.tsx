import { Search, Filter, Plus, Grid, List, X, ChevronDown, Download, Settings, RefreshCw } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'name' | 'rating';
  setSortBy: (sort: 'newest' | 'price-low' | 'price-high' | 'name' | 'rating') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onAddNew: () => void;
  filteredCount: number;
  totalCount: number;
  onClearFilters?: () => void;
  onAddSampleData?: () => void;
}

const FilterBar = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onAddNew,
  filteredCount,
  totalCount,
  onClearFilters,
  onAddSampleData
}: FilterBarProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 shadow-2xl mb-8">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
        <div className="flex-1">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search listings by name, city, owner, amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-gray-900 border-2 border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 text-white placeholder-gray-500 hover:border-gray-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Add New Button */}
          <button
            onClick={onAddNew}
            className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-3"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            Add New PG
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 bg-gray-900 border-2 border-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-700"
          >
            <option value="all" className="bg-gray-900">All Types</option>
            <option value="boys" className="bg-gray-900">Boys PG</option>
            <option value="girls" className="bg-gray-900">Girls PG</option>
            <option value="co-ed" className="bg-gray-900">Co-ed PG</option>
            <option value="family" className="bg-gray-900">Family PG</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-900 border-2 border-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-700"
          >
            <option value="all" className="bg-gray-900">All Status</option>
            <option value="published" className="bg-gray-900">Published</option>
            <option value="draft" className="bg-gray-900">Draft</option>
            <option value="featured" className="bg-gray-900">Featured</option>
            <option value="verified" className="bg-gray-900">Verified</option>
          </select>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2.5 bg-gray-900 border-2 border-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-700"
        >
          <option value="newest" className="bg-gray-900">Newest First</option>
          <option value="price-low" className="bg-gray-900">Price: Low to High</option>
          <option value="price-high" className="bg-gray-900">Price: High to Low</option>
          <option value="name" className="bg-gray-900">Name A-Z</option>
          <option value="rating" className="bg-gray-900">Rating: High to Low</option>
        </select>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300 border border-gray-700'}`}
            title="Grid View"
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300 border border-gray-700'}`}
            title="List View"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-sm text-gray-400">
          Showing <span className="font-bold text-white">{filteredCount}</span> of{' '}
          <span className="font-bold text-white">{totalCount}</span> listings
          {searchQuery && (
            <span className="ml-2 px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs border border-blue-800">
              "{searchQuery}"
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-all text-sm font-medium border border-gray-800 hover:border-gray-700"
            >
              Clear Filters
            </button>
          )}
          
          {onAddSampleData && (
            <button
              onClick={onAddSampleData}
              className="px-4 py-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 rounded-lg hover:from-purple-900/50 hover:to-pink-900/50 transition-all text-sm font-medium border border-purple-800/30 hover:border-purple-600/50"
            >
              Add Sample Data
            </button>
          )}
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400">Published</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-400">Featured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-400">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;