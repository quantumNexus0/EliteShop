import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Watch, Camera, Gamepad2, Headphones, Armchair } from 'lucide-react';
import { products } from '../data/products';

const CategoriesPage: React.FC = () => {
  const categories = [
    {
      name: 'Electronics',
      icon: Smartphone,
      description: 'Latest gadgets and electronic devices',
      image: 'https://images.pexels.com/photos/163140/iphone-cell-phone-smartphone-technology-163140.jpeg?auto=compress&cs=tinysrgb&w=800',
      count: products.filter(p => p.category === 'Electronics').length,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Wearables',
      icon: Watch,
      description: 'Smartwatches, fitness trackers, and more',
      image: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=800',
      count: products.filter(p => p.category === 'Wearables').length,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      name: 'Photography',
      icon: Camera,
      description: 'Professional cameras, lenses, and accessories',
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
      count: products.filter(p => p.category === 'Photography').length,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Furniture',
      icon: Armchair,
      description: 'Modern furniture for home and office',
      image: 'https://images.pexels.com/photos/586093/pexels-photo-586093.jpeg?auto=compress&cs=tinysrgb&w=800',
      count: products.filter(p => p.category === 'Furniture').length,
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Gaming',
      icon: Gamepad2,
      description: 'Gaming gear and accessories',
      image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800',
      count: products.filter(p => p.category === 'Gaming').length,
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'Accessories',
      icon: Headphones,
      description: 'Essential accessories for all your devices',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      count: products.filter(p => p.category === 'Accessories').length,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop by Category
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover our wide range of products organized by category. Find exactly what you're looking for.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/products?category=${category.name}`}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105"
                >
                  {/* Background Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    
                    {/* Icon */}
                    <div className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    {/* Product Count */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {category.count} items
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Most shopped categories this month
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/products?category=${category.name}`}
                  className="group text-center p-6 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${category.color} rounded-full mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.count} products
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Browse all our products or use our search feature to find exactly what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Browse All Products
            </Link>
            <Link
              to="/products"
              className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Advanced Search
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;