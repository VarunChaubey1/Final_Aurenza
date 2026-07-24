import React, { useState } from 'react';
import { ProductReview } from '../../types';
import { Star, CheckCircle2, ThumbsUp } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface ReviewsSectionProps {
  reviews?: ProductReview[];
  rating: number;
  reviewsCount: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews = [], rating, reviewsCount }) => {
  const { showToast } = useShop();

  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [reviewList, setReviewList] = useState<ProductReview[]>(reviews);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newContent) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    const created: ProductReview = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      title: newTitle || 'Exceptional skincare quality!',
      content: newContent,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true
    };

    setReviewList([created, ...reviewList]);
    setShowForm(false);
    setNewAuthor('');
    setNewContent('');
    setNewTitle('');
    showToast('Thank you! Your verified review has been posted.', 'success');
  };

  return (
    <div className="py-12 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="font-serif text-3xl font-bold text-[#1F1F1F] dark:text-white">
            Customer Reviews & Clinical Feedback
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-[#D6A34A]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="font-bold text-lg text-gray-800 dark:text-gray-200">{typeof rating === 'number' ? Number(rating).toFixed(1) : rating} out of 5</span>
            <span className="text-gray-400 text-xs">({reviewsCount} total ratings)</span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#2F5D50] hover:bg-[#1f4238] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all self-start md:self-auto"
        >
          {showForm ? 'Cancel Review' : 'Write a Verified Review'}
        </button>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 p-6 bg-[#FFF9F4] dark:bg-[#1B2320] rounded-3xl border border-[#E8DFD8] dark:border-[#2C3834] space-y-4 animate-fadeIn">
          <h4 className="font-serif font-bold text-xl text-[#2F5D50] dark:text-white">Share Your Experience</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Your Name</label>
              <input
                type="text"
                value={newAuthor}
                onChange={e => setNewAuthor(e.target.value)}
                placeholder="e.g. Dr. Kavita Sharma"
                required
                className="w-full p-3 text-xs bg-white dark:bg-[#121816] rounded-xl border border-[#E8DFD8] dark:border-[#2C3834]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Rating</label>
              <select
                value={newRating}
                onChange={e => setNewRating(Number(e.target.value))}
                className="w-full p-3 text-xs bg-white dark:bg-[#121816] rounded-xl border border-[#E8DFD8] dark:border-[#2C3834] font-bold"
              >
                <option value={5}>5 Stars - Outstanding</option>
                <option value={4}>4 Stars - Very Good</option>
                <option value={3}>3 Stars - Average</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Review Headline</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Cleared my dark spots in 2 weeks"
              className="w-full p-3 text-xs bg-white dark:bg-[#121816] rounded-xl border border-[#E8DFD8] dark:border-[#2C3834]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Detailed Review</label>
            <textarea
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="How did this product feel on your skin/hair? Any visible improvements?"
              rows={3}
              required
              className="w-full p-3 text-xs bg-white dark:bg-[#121816] rounded-xl border border-[#E8DFD8] dark:border-[#2C3834]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#2F5D50] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviewList.length === 0 ? (
          <p className="text-xs text-gray-400 italic">Be the first to leave a review for this formulation!</p>
        ) : (
          reviewList.map(rev => (
            <div
              key={rev.id}
              className="p-6 bg-white dark:bg-[#1B2320] rounded-3xl border border-[#E8DFD8] dark:border-[#2C3834] shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base text-[#1F1F1F] dark:text-white">
                    {rev.author}
                  </span>
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-[#2F5D50]/10 text-[#2F5D50] dark:text-[#D6A34A] px-2.5 py-0.5 rounded-full font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{rev.date}</span>
              </div>

              <div className="flex text-[#D6A34A]">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <h5 className="font-bold text-sm text-[#1F1F1F] dark:text-white">{rev.title}</h5>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{rev.content}</p>

              {rev.skinType && (
                <p className="text-[10px] text-gray-400 italic">Skin/Hair Type: {rev.skinType}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
