function text(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function validateReviewInput(body) {
  const rating = Number(body?.rating);
  const orderItemId = Number(body?.orderItemId);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    const error = new Error('Rating must be an integer between 1 and 5.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
  if (!Number.isSafeInteger(orderItemId) || orderItemId < 1) {
    const error = new Error('A valid purchased order item is required.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
  const title = text(body?.title, 255);
  const content = text(body?.content, 5000);
  if (!title && !content) {
    const error = new Error('Review title or content is required.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
  return { rating, orderItemId, title, content };
}
