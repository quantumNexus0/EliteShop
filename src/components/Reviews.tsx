import React, { useState, useEffect } from 'react';
import { Star, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchProductReviews, createReviewApi } from '../services/api';

interface Review {
    id: number;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ReviewsProps {
    productId: string;
}

const Reviews: React.FC<ReviewsProps> = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [error, setError] = useState('');

    const loadReviews = async () => {
        try {
            const data = await fetchProductReviews(productId);
            setReviews(data);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        setError('');

        try {
            await createReviewApi({
                product_id: productId,
                rating: newReview.rating,
                comment: newReview.comment
            });
            setNewReview({ rating: 5, comment: '' });
            loadReviews(); // Reload reviews
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const StarRating = ({ rating, size = "sm" }: { rating: number, size?: "sm" | "md" | "lg" }) => {
        const getSize = () => {
            switch (size) {
                case "md": return "w-5 h-5";
                case "lg": return "w-6 h-6";
                default: return "w-4 h-4";
            }
        };

        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${getSize()} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>

            {/* Write a Review */}
            {user ? (
                <div className="bg-gray-50 p-6 rounded-2xl">
                    <h4 className="font-bold text-lg mb-4">Write a Review</h4>
                    {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                            <textarea
                                required
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                placeholder="Share your thoughts..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {submitting ? 'Submitting...' : 'Post Review'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-blue-50 p-4 rounded-xl text-blue-700">
                    Please login to write a review.
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                        {review.user_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{review.user_name}</p>
                                        <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>
                            <p className="text-gray-600 pl-13 ml-13">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;
