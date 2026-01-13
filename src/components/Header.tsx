import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { fetchNotifications, fetchWishlist } from '../services/api';
import { useEffect } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { state } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (user) {
      const loadCounts = async () => {
        try {
          const [n, w] = await Promise.all([
            fetchNotifications(),
            fetchWishlist()
          ]);
          setNotificationCount(n.filter((notif: any) => !notif.is_read).length);
          setWishlistCount(w.length);
        } catch (e) {
          console.error(e);
        }
      };
      loadCounts();
      const interval = setInterval(loadCounts, 60000); // Poll every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = state?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">EliteShop</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${isActive('/') ? 'text-blue-600' : ''
                }`}
            >
              Home
            </Link>

            {/* Men's Dropdown */}
            <div className="relative group">
              <Link
                to="/products?category=Men"
                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${location.pathname === '/products' && location.search.includes('category=Men') ? 'text-blue-600' : ''
                  }`}
              >
                Men
              </Link>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <div className="space-y-2">
                    <Link to="/products?category=Men&subcategory=T-Shirts" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      T-Shirts & Tops
                    </Link>
                    <Link to="/products?category=Men&subcategory=Shirts" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      Shirts
                    </Link>
                    <Link to="/products?category=Men&subcategory=Jeans" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      Jeans
                    </Link>
                    <Link to="/products?category=Men&subcategory=Jackets" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      Jackets
                    </Link>
                    <Link to="/products?category=Men&subcategory=Kurta Pyjama" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      Ethnic Wear
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Women's Dropdown */}
            <div className="relative group">
              <Link
                to="/products?category=Women"
                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${location.pathname === '/products' && location.search.includes('category=Women') ? 'text-blue-600' : ''
                  }`}
              >
                Women
              </Link>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <div className="space-y-2">
                    <Link to="/products?category=Women&subcategory=T-Shirts & Tops" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      T-Shirts & Tops
                    </Link>
                    <Link to="/products?category=Women&subcategory=Blouses & Shirts" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      Blouses & Shirts
                    </Link>
                    <Link to="/products?category=Women&subcategory=Casual Dresses" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      Dresses
                    </Link>
                    <Link to="/products?category=Women&subcategory=Jeans" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      Jeans
                    </Link>
                    <Link to="/products?category=Women&subcategory=Sarees" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      Ethnic Wear
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Kids Dropdown */}
            <div className="relative group">
              <Link
                to="/products?category=Kids"
                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${location.pathname === '/products' && location.search.includes('category=Kids') ? 'text-blue-600' : ''
                  }`}
              >
                Kids
              </Link>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <div className="space-y-2">
                    <Link to="/products?category=Kids&subcategory=T-Shirts & Polo" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      T-Shirts & Tops
                    </Link>
                    <Link to="/products?category=Kids&subcategory=Jeans & Pants" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      Jeans & Pants
                    </Link>
                    <Link to="/products?category=Kids&subcategory=Frocks & Party Dresses" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      Dresses (Girls)
                    </Link>
                    <Link to="/products?category=Kids&subcategory=Boys Ethnic" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      Ethnic Wear
                    </Link>
                    <Link to="/products?category=Kids&subcategory=Pajama Sets" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                      Sleepwear
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/about"
              className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${isActive('/about') ? 'text-blue-600' : ''
                }`}
            >
              About
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Mobile */}
            <button className="md:hidden p-2 text-gray-600 hover:text-blue-600">
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link to="/dashboard" onClick={() => navigate('/dashboard', { state: { tab: 'wishlist' } })} className="p-2 text-gray-600 hover:text-blue-600 relative">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-blue-600 relative">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <Link to="/cart" className="p-2 text-gray-600 hover:text-blue-600 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      My Account
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Wishlist
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </form>

              {/* Mobile Navigation */}
              <div className="space-y-2 px-2">
                <Link
                  to="/"
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products?category=Men"
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Men
                </Link>
                <Link
                  to="/products?category=Women"
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Women
                </Link>
                <Link
                  to="/products?category=Kids"
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kids
                </Link>
                <Link
                  to="/about"
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;