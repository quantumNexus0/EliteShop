import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, Edit, Plus, Save, Trash2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import {
  fetchProfile,
  updateProfileApi,
  fetchWishlist,
  fetchAddresses,
  addAddressApi,
  updateAddressApi,
  deleteAddressApi
} from '../services/api';

const UserDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const { getOrdersByUser } = useOrders();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressFormData, setAddressFormData] = useState({
    type: 'home',
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, w, a] = await Promise.all([
        fetchProfile(),
        fetchWishlist(),
        fetchAddresses()
      ]);
      setProfileData({ name: p.name, phone: p.phone || '' });
      setWishlistItems(w);
      setAddresses(a);
    } catch (e) {
      console.error('Failed to load user data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileApi(profileData);
      await refreshUser();
      alert('Profile updated successfully!');
      loadData();
    } catch (e) {
      console.error(e);
      alert('Failed to update profile');
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await updateAddressApi(editingAddress.id, addressFormData);
      } else {
        await addAddressApi(addressFormData);
      }
      setShowAddressModal(false);
      setEditingAddress(null);
      loadData();
    } catch (e) {
      console.error(e);
      alert('Failed to save address');
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setAddressFormData({
      type: address.type,
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || '',
      isDefault: address.isDefault
    });
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddressApi(id);
        loadData();
      } catch (e) {
        console.error(e);
        alert('Failed to delete address');
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600">You need to be logged in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const userOrders = getOrdersByUser(user.id);

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-900 text-white p-6">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold truncate w-32">{user.name}</h2>
                  <p className="text-sm text-gray-400">Member since {new Date(user.createdAt).getFullYear()}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-whiteShadow' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
              {activeTab === 'profile' && (
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Personal Information</h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <button type="submit" className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Order History</h2>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order.id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all">
                          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                              <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {order.status}
                              </span>
                              <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex -space-x-2">
                            {order.items.map((item, i) => (
                              <img key={i} src={item.product.images[0]} alt="" className="w-10 h-10 rounded-lg border-2 border-white object-cover" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist</h2>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Your wishlist is empty.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                          <div className="aspect-square relative overflow-hidden">
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                            <p className="text-blue-600 font-bold mb-4">${item.price}</p>
                            <button className="w-full py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
                              Move to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setAddressFormData({
                          type: 'home',
                          name: '',
                          street: '',
                          city: '',
                          state: '',
                          zipCode: '',
                          country: 'USA',
                          phone: '',
                          isDefault: false
                        });
                        setShowAddressModal(true);
                      }}
                      className="flex items-center space-x-2 text-blue-600 font-bold hover:text-blue-700"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add New</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div key={address.id} className={`p-6 rounded-2xl border-2 transition-all ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase">{address.type}</span>
                          <div className="flex space-x-2">
                            <button onClick={() => handleEditAddress(address)} className="p-2 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteAddress(address.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <h4 className="font-bold text-gray-900">{address.name}</h4>
                        <p className="text-sm text-gray-600 mt-2">{address.street}, {address.city}, {address.state} {address.zipCode}</p>
                        {address.isDefault && <p className="text-xs font-bold text-blue-600 mt-4">DEFAULT ADDRESS</p>}
                      </div>
                    ))}
                  </div>

                  {addresses.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No addresses saved yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h2>
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Privacy & Notifications</h3>
                    <div className="space-y-4">
                      {['Order alerts', 'Marketing emails', 'Sms updates'].map(p => (
                        <label key={p} className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-blue-600" />
                          <span className="text-gray-700">{p}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingAddress ? 'Edit Address' : 'New Address'}</h3>
              <button onClick={() => setShowAddressModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddressSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Label (Home/Work)" value={addressFormData.type} onChange={e => setAddressFormData({ ...addressFormData, type: e.target.value })} className="px-4 py-2 border rounded-xl" />
                <input placeholder="Full Name" value={addressFormData.name} onChange={e => setAddressFormData({ ...addressFormData, name: e.target.value })} className="px-4 py-2 border rounded-xl" />
              </div>
              <input placeholder="Street Address" value={addressFormData.street} onChange={e => setAddressFormData({ ...addressFormData, street: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="City" value={addressFormData.city} onChange={e => setAddressFormData({ ...addressFormData, city: e.target.value })} className="px-4 py-2 border rounded-xl" />
                <input placeholder="State" value={addressFormData.state} onChange={e => setAddressFormData({ ...addressFormData, state: e.target.value })} className="px-4 py-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Zip Code" value={addressFormData.zipCode} onChange={e => setAddressFormData({ ...addressFormData, zipCode: e.target.value })} className="px-4 py-2 border rounded-xl" />
                <input placeholder="Country" value={addressFormData.country} onChange={e => setAddressFormData({ ...addressFormData, country: e.target.value })} className="px-4 py-2 border rounded-xl" />
              </div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={addressFormData.isDefault} onChange={e => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })} />
                <span>Set as default</span>
              </label>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">Save Address</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;