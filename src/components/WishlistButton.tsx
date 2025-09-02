import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, className = '' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // Here you would typically call an API to add/remove from wishlist
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className={`p-2 rounded-full transition-all duration-200 ${
        isWishlisted 
          ? 'bg-red-500 text-white' 
          : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
      } ${className}`}
    >
      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
    </button>
  );
};

export default WishlistButton;