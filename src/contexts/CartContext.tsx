import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        };
      } else {
        const newItems = [...state.items, {
          product: action.payload,
          quantity: 1,
          selectedSize: action.payload.sizes[0],
          selectedColor: action.payload.colors[0]
        }];
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        };
      }
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      };
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.product.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    case 'SET_CART':
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Load cart from local storage when user changes or on mount
  useEffect(() => {
    const cartKey = user ? `cart_${user.id}` : 'cart_guest';
    const persisted = localStorage.getItem(cartKey);
    if (persisted) {
      const parsed = JSON.parse(persisted);
      // We need to dispatch an action to replace the state, but our reducer only supports modify actions.
      // Let's add a REPLACE_CART action or just hack it by clearing and adding.
      // Ideally, we should update the reducer to support SET_CART.
      // For now, let's just use the state from storage if it exists, 
      // but since we are inside a component, we can't easily re-init the reducer state 
      // without a proper action.
      // Let's add a SET_CART action to the reducer.
      dispatch({ type: 'SET_CART', payload: parsed });
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

  // Save cart to local storage whenever state changes
  useEffect(() => {
    const cartKey = user ? `cart_${user.id}` : 'cart_guest';
    localStorage.setItem(cartKey, JSON.stringify(state));
  }, [state, user]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};