import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchWishlist, addToWishlistApi, removeFromWishlistApi } from '../services/api';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, className = '' }) => {
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      if (user) {
        try {
          const wishlist = await fetchWishlist();
          setIsWishlisted(wishlist.some((item: any) => item.id === productId));
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkWishlist();
  }, [user, productId]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }

    setLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlistApi(productId);
        setIsWishlisted(false);
      } else {
        await addToWishlistApi(productId);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 ${isWishlisted
          ? 'bg-red-500 text-white'
          : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
        } ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
    </button>
  );
};

export default WishlistButton;