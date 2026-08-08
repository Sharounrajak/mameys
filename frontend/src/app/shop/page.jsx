'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Search } from 'lucide-react';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(''); 
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/products');
        if (!res.ok) throw new Error('Failed to load products');
        
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter logic: combining Category selection AND Search Query safely
  const categories = ['All', 'Hair Care', 'Beard Grooming', 'Skin Care', 'Styling Tools', 'General'];
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    
    // Added optional chaining (?.) to prevent crashes if a product is missing a name or description
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = product.name?.toLowerCase().includes(searchLower) || 
                          product.description?.toLowerCase().includes(searchLower);
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* SHOP HEADER */}
      <div className="bg-black text-white py-16 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Studio Shop</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Professional-grade grooming products, curated by our master barbers.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* SEARCH AND FILTER SECTION */}
        <div className="max-w-2xl mx-auto mb-10 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // Added text-gray-900 and font-medium here to make user text distinctly darker
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl leading-5 bg-gray-50 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-black sm:text-sm transition-all shadow-sm"
            />
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition shadow-sm ${
                  activeCategory === category
                    ? 'bg-black text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && <div className="text-center py-20 text-gray-500 font-bold text-lg">Loading inventory...</div>}
        {error && <div className="text-center py-20 text-red-500 font-bold text-lg">Error: {error}</div>}

        {/* PRODUCT GRID */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 font-medium text-lg">No products found.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-4 text-blue-600 hover:underline text-sm font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id} className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img 
                      src={product.imageUrl || 'https://placehold.co/600x400?text=No+Image'} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                      <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                        Low Stock
                      </span>
                    )}
                    {product.stockQuantity === 0 && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">{product.category}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-xl font-extrabold text-gray-900">Rs. {product.price}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        disabled={product.stockQuantity === 0}
                        className={`px-4 py-2 rounded font-bold text-sm transition ${
                          product.stockQuantity === 0 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}