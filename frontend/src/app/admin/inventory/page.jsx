'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';

export default function AdminInventory() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'General',
    stockQuantity: '',
    imageUrl: ''
  });

  const categories = ['All', 'Hair Care', 'Beard Grooming', 'Skin Care', 'Styling Tools', 'General'];
  const formCategories = categories.filter(c => c !== 'All');

  // Fetch inventory from backend
  const fetchProducts = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
      const res = await fetch(`${API_URL}/api/products`);

      if (!res.ok) throw new Error('Failed to fetch inventory');
      
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Action
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
      
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert(`Error deleting product: ${err.message}`);
    }
  };

  // Open Modal for Add or Edit
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || 'General',
        stockQuantity: product.stockQuantity || '',
        imageUrl: product.imageUrl || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', description: '', price: '', category: 'General', stockQuantity: '', imageUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Handle Form Submission (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
      
      const method = editingProduct ? 'PUT' : 'POST';
      const endpoint = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      
      const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stockQuantity: Number(formData.stockQuantity)
        })
      });

      if (!res.ok) throw new Error(editingProduct ? 'Failed to update product' : 'Failed to add product');
      
      // Refresh list to ensure accurate sync with DB
      fetchProducts();
      closeModal();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      
      {/* Back Button */}
            <div className="mb-6">
                <Link 
                    href="/admin/dashboard" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-black transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>

      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shop Inventory</h1>
          <p className="text-sm text-gray-600 mt-1">Manage products, pricing, and stock levels.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-black text-white px-5 py-2.5 rounded-md font-bold text-sm hover:bg-gray-800 transition"
        >
          + Add New Product
        </button>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition ${
              filter === cat 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ERROR / LOADING STATES */}
      {loading && <div className="p-8 text-center text-gray-500 font-semibold">Loading inventory...</div>}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-md font-semibold">{error}</div>}

      {/* INVENTORY TABLE */}
      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium">
              No products found in this category.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-800">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider font-bold text-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/80 transition">
                      
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img src={product.imageUrl || 'https://placehold.co/100x100?text=No+Img'} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {product.category}
                      </td>

                      <td className="px-6 py-4 font-bold text-gray-900">
                        Rs. {product.price}
                      </td>

                      <td className="px-6 py-4">
                        {product.stockQuantity > 5 ? (
                          <span className="text-xs font-bold px-2 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
                            {product.stockQuantity} in stock
                          </span>
                        ) : product.stockQuantity > 0 ? (
                          <span className="text-xs font-bold px-2 py-1 rounded-full border bg-orange-50 text-orange-700 border-orange-200">
                            Only {product.stockQuantity} left
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2 py-1 rounded-full border bg-red-50 text-red-700 border-red-200">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => openModal(product)}
                          className="bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1 rounded text-xs font-bold hover:bg-gray-200 transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded text-xs font-bold hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD/EDIT MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Product Name</label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 font-medium bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none" 
                  placeholder="e.g. Matte Clay Pomade"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Description</label>
                <textarea 
                  name="description" required rows="2" value={formData.description} onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 font-medium bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
                  placeholder="Short product description..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Price (Rs.)</label>
                  <input 
                    type="number" name="price" required min="0" value={formData.price} onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 font-medium bg-white focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Stock Quantity</label>
                  <input 
                    type="number" name="stockQuantity" required min="0" value={formData.stockQuantity} onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 font-medium bg-white focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Category</label>
                  <select 
                    name="category" value={formData.category} onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 font-medium bg-white focus:ring-2 focus:ring-black focus:outline-none"
                  >
                    {formCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Image URL</label>
                  <input 
                    type="url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 font-medium bg-white placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button 
                  type="button" onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 transition"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}