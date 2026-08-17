import { createReview, findEligibleOrderItem, findReviewByOrderItemForUser, getProductReviewSummary, listApprovedReviewsForProduct, listEligibleOrderItemsForProduct } from '../db/repositories/reviews.js';
import { validateReviewInput } from './validation.js';

function mapReview(review) {
  const first = review.first_name || '';
  const last = review.last_name || '';
  return { id: Number(review.id), productId: Number(review.product_id), rating: Number(review.rating), title: review.title, content: review.content, authorName: `${first} ${last}`.trim() || 'کاربر فروشگاه', createdAt: review.created_at };
}

export async function getProductReviews(productId, options = {}) {
  const [summary, reviews] = await Promise.all([getProductReviewSummary(productId), listApprovedReviewsForProduct(productId, options)]);
  return { ...summary, reviews: reviews.map(mapReview) };
}

export async function getEligibleReviewItems(userId, productId) {
  return listEligibleOrderItemsForProduct(userId, productId);
}

export async function submitProductReview(userId, productId, body) {
  const input = validateReviewInput(body);
  const eligibleItem = await findEligibleOrderItem(userId, productId, input.orderItemId);
  if (!eligibleItem) { const error = new Error('Only customers who purchased and received this product can review it.'); error.code = 'REVIEW_PURCHASE_REQUIRED'; throw error; }
  const existing = await findReviewByOrderItemForUser(input.orderItemId, userId);
  if (existing) { const error = new Error('You have already reviewed this purchased item.'); error.code = 'REVIEW_ALREADY_EXISTS'; throw error; }
  const id = await createReview({ userId, productId, orderItemId: input.orderItemId, rating: input.rating, title: input.title, content: input.content });
  return { id, status: 'PENDING' };
}
