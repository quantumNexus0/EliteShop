import React, { useState, useEffect } from 'react';
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Search,
  Plus,
  X,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle
} from 'lucide-react';
import {
  fetchAllOrders,
  updateOrderStatusApi,
  fetchAllUsers,
  fetchProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi
} from '../services/api';
import { Order, User as UserType, Product } from '../types';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<any>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    subcategory: '',
    brand: '',
    stockQuantity: 0,
    images: [''],
    tags: [],
    inStock: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, usersData, productsData] = await Promise.all([
        fetchAllOrders(),
        fetchAllUsers(),
        fetchProducts()
      ]);

      setOrders(ordersData.map((o: any) => ({
        ...o,
        total: parseFloat(o.total_amount),
        createdAt: new Date(o.created_at),
        items: o.items.map((item: any) => ({
          product: { ...item, price: parseFloat(item.price_at_purchase) },
          quantity: item.quantity
        })),
        shippingAddress: { street: o.shipping_address, city: '', state: '', zipCode: '', country: '' }
      })));
      setUsers(usersData.users);
      setTotalUsers(usersData.total);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatusApi(orderId, newStatus);
    loadData();
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProductApi(editingProduct.id, productFormData);
      } else {
        await createProductApi(productFormData);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      loadData();
    } catch (e) {
      console.error(e);
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProductApi(id);
      loadData();
    }
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      ...product,
      images: product.images.length > 0 ? product.images : [''],
      originalPrice: product.originalPrice || product.price
    });
    setShowProductModal(true);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      category: '',
      subcategory: '',
      brand: '',
      stockQuantity: 0,
      images: [''],
      tags: [],
      inStock: true
    });
    setShowProductModal(true);
  };

  if (loading) return <div className="pt-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500 bg-blue-50 p-2 rounded-xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <ShoppingCart className="w-10 h-10 text-green-500 bg-green-50 p-2 rounded-xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="w-10 h-10 text-purple-500 bg-purple-50 p-2 rounded-xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">${orders.reduce((s, o) => s + o.total, 0).toFixed(2)}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-500 bg-orange-50 p-2 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {['overview', 'orders', 'products', 'users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === tab ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-gray-500">Order ID</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-500">Customer</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-500">Total</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-500">Status</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold">{order.userName}</p>
                        <p className="text-xs text-gray-500">{order.userEmail}</p>
                      </td>
                      <td className="px-6 py-4 font-bold">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value as any)}
                          className="text-xs font-bold uppercase py-1 px-2 rounded-lg bg-blue-50 text-blue-700 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setSelectedOrder(order)} className="text-gray-400 hover:text-blue-600"><Eye className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-xl font-bold">Manage Products</h2>
                <button onClick={openAddProduct} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700">
                  <Plus className="w-5 h-5" />
                  <span>Add Product</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500">Product</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500">Category</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500">Price</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500">Stock</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-bold truncate w-40">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 uppercase font-bold">{p.category}</td>
                        <td className="px-6 py-4 font-bold">${p.price}</td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${p.stockQuantity < 10 ? 'text-red-600' : 'text-gray-600'}`}>{p.stockQuantity}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button onClick={() => openEditProduct(p)} className="text-gray-400 hover:text-blue-600"><Edit className="w-5 h-5" /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-gray-500">User</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-500">Email</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-500">Role</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-500">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 font-bold">{u.name}</td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 uppercase font-bold text-xs">{u.role}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="p-8 text-center text-gray-500">
              Welcome to the EliteShop Admin Panel. Use the tabs above to manage your business.
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-900 text-white">
              <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowProductModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Product Name</label>
                  <input required value={productFormData.name} onChange={e => setProductFormData({ ...productFormData, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Price</label>
                  <input type="number" required value={productFormData.price} onChange={e => setProductFormData({ ...productFormData, price: parseFloat(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Description</label>
                <textarea required value={productFormData.description} onChange={e => setProductFormData({ ...productFormData, description: e.target.value })} className="w-full px-4 py-2 border rounded-xl h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Category</label>
                  <input required value={productFormData.category} onChange={e => setProductFormData({ ...productFormData, category: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Stock Quantity</label>
                  <input type="number" required value={productFormData.stockQuantity} onChange={e => setProductFormData({ ...productFormData, stockQuantity: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Image URL</label>
                <input required value={productFormData.images[0]} onChange={e => setProductFormData({ ...productFormData, images: [e.target.value] })} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 py-3 border rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal (Simplified) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)}><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 font-bold uppercase text-xs">Customer</p>
                <p className="font-bold">{selectedOrder.userName} ({selectedOrder.userEmail})</p>
              </div>
              <div>
                <p className="text-gray-400 font-bold uppercase text-xs">Status</p>
                <p className="font-bold text-blue-600 uppercase">{selectedOrder.status}</p>
              </div>
              <div>
                <p className="text-gray-400 font-bold uppercase text-xs">Items</p>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-black text-blue-600">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;