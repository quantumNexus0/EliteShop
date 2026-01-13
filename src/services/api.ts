const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

export const fetchProducts = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/products?${query}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
};

export const fetchProductById = async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
};

export const loginApi = async (credentials: any) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
    }
    return response.json();
};

export const registerApi = async (userData: any) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
    }
    return response.json();
};

// Orders
export const createOrderApi = async (orderData: any) => {
    const response = await fetch(`${API_URL}/orders/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
};

export const fetchOrderHistory = async () => {
    const response = await fetch(`${API_URL}/orders/history`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch order history');
    return response.json();
};

export const fetchAllOrders = async () => {
    const response = await fetch(`${API_URL}/orders/all`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch all orders');
    return response.json();
};

export const updateOrderStatus = async (orderId: string, status: string) => {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
};

// Wishlist
export const fetchWishlist = async () => {
    const response = await fetch(`${API_URL}/wishlist/`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return response.json();
};

export const addToWishlistApi = async (productId: string) => {
    const response = await fetch(`${API_URL}/wishlist/add/${productId}`, {
        method: 'POST',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to add to wishlist');
    return response.json();
};

export const removeFromWishlistApi = async (productId: string) => {
    const response = await fetch(`${API_URL}/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to remove from wishlist');
    return response.json();
};

// Users
export const fetchUsers = async () => {
    const response = await fetch(`${API_URL}/users/all`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
};

export const fetchUserProfile = async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
};

export const updateUserProfile = async (data: any) => {
    const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
};

// Addresses
export const fetchAddresses = async () => {
    const response = await fetch(`${API_URL}/addresses/`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch addresses');
    return response.json();
};

export const addAddressApi = async (data: any) => {
    const response = await fetch(`${API_URL}/addresses/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to add address');
    return response.json();
};

export const updateAddressApi = async (id: number, data: any) => {
    const response = await fetch(`${API_URL}/addresses/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update address');
    return response.json();
};

export const deleteAddressApi = async (id: number) => {
    const response = await fetch(`${API_URL}/addresses/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete address');
    return response.json();
};

// Product Management (Admin)
export const createProductApi = async (data: any) => {
    const response = await fetch(`${API_URL}/products/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
};

export const updateProductApi = async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
};

export const deleteProductApi = async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
};

// Notifications
export const fetchNotifications = async () => {
    const response = await fetch(`${API_URL}/notifications/`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
};

export const markNotificationRead = async (id: number) => {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return response.json();
};

// Reviews
export const fetchProductReviews = async (productId: string) => {
    const response = await fetch(`${API_URL}/reviews/${productId}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
};

export const createReviewApi = async (data: { product_id: string; rating: number; comment: string }) => {
    const response = await fetch(`${API_URL}/reviews/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to submit review');
    }
    return response.json();
};
