'use client';

import { useState, useEffect } from 'react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Hair Care',
    stockQuantity: '',
    imageUrl: '',
    isFeatured: false
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Form Submit (Create or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = editingProduct 
      ? `http://localhost:5000/api/products/${editingProduct._id}`
      : 'http://localhost:5000/api/products';
    
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
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

      if (!res.ok) throw new Error('Operation failed');

      alert(editingProduct ? 'Product Updated!' : 'Product Created!');
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      isFeatured: product.isFeatured || false
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Hair Care',
      stockQuantity: '',
      imageUrl: '',
      isFeatured: false
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Product & Inventory Manager</h1>
          <p className="text-sm text-gray-600 mt-1">Manage studio products, pricing, and stock levels.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-black text-white px-5 py-2.5 rounded-md font-bold text-sm hover:bg-gray-800 transition"
        >
          + Add New Product
        </button>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500 font-semibold">Loading inventory...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/80">
                  <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                  <td className="px-6 py-4">{p.category}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">Rs. {p.price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      p.stockQuantity > 5 
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : p.stockQuantity > 0 
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        : 'bg-red-100 text-red-800 border-red-300'
                    }`}>
                      {p.stockQuantity > 0 ? `${p.stockQuantity} in Stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs font-bold hover:bg-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded text-xs font-bold hover:bg-red-100"
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border p-2 rounded text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border p-2 rounded text-sm font-semibold"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border p-2 rounded text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full border p-2 rounded text-sm font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border p-2 rounded text-sm font-semibold bg-white"
                >
                  <option value="Hair Care">Hair Care</option>
                  <option value="Beard Grooming">Beard Grooming</option>
                  <option value="Skin Care">Skin Care</option>
                  <option value="Styling Tools">Styling Tools</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded font-bold text-xs hover:bg-gray-800"
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