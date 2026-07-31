'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feature States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high'
  const [inStockOnly, setInStockOnly] = useState(false);

  const { addToCart, cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = inStockOnly ? product.stockQuantity > 0 : true;
      return matchesSearch && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // default order
    });

  return (
    <div className="w-full bg-white text-black min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* --- HEADER & CART BAR --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              Mamey's Hair Essentials.
            </h1>
            <p className="text-gray-600 text-base max-w-xl leading-relaxed">
              Premium pomades, oils, and hair care products used daily in our studio.
            </p>
          </div>

          {/* Floating/Header Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-md hover:bg-gray-800 transition self-start md:self-auto"
          >
            <span>Cart</span>
            <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </button>
        </div>

        {/* --- FEATURES BAR (Search, Filters, Sort) --- */}
        <section className="mb-10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-gray-50 p-4 rounded-md border border-gray-200">
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products (e.g. Pomade, Beard Oil)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 text-sm focus:outline-none focus:border-black bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-black"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls Group */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {/* In-Stock Filter */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-black focus:ring-black h-4 w-4"
              />
              <span className="text-gray-700 font-medium">In Stock Only</span>
            </label>

            {/* Price Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-3 bg-white focus:outline-none focus:border-black font-medium text-gray-700"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </section>

        {/* --- PRODUCT GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-gray-100 rounded-md animate-pulse"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 border rounded-md bg-gray-50">
            <h3 className="text-lg font-bold mb-1">No products match your criteria</h3>
            <p className="text-sm text-gray-500 mb-4">Try clearing your search query or stock filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="text-xs bg-black text-white px-4 py-2 rounded-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stockQuantity === 0;

              return (
                <div
                  key={product._id}
                  className="group border border-gray-200 rounded-md bg-white p-6 flex flex-col justify-between hover:border-black transition-all duration-300"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative w-full h-[240px] bg-gray-100 rounded-sm overflow-hidden mb-6">
                      <Image
                        src={product.imageUrl || '/hero-interior.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span
                        className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-sm uppercase tracking-wider ${
                          isOutOfStock
                            ? 'bg-red-100 text-red-700'
                            : 'bg-white text-black shadow-sm'
                        }`}
                      >
                        {isOutOfStock ? 'Sold Out' : `${product.stockQuantity} in stock`}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight mb-2 text-black">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block uppercase font-bold">
                        Price
                      </span>
                      <span className="text-xl font-bold text-black tracking-tight">
                        Rs. {product.price}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={isOutOfStock}
                      className="bg-black text-white px-5 py-2.5 text-sm font-medium rounded-md hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                    >
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        )}

      </main>
    </div>
  );
}