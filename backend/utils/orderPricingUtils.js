/**
 * Calculate order total amount from food items
 * @param {Array} items - Array of food items with price and quantity
 * @param {number} deliveryFee - Delivery fee (default: 2)
 * @returns {number} - Total order amount
 */
export const calculateOrderAmount = (items, deliveryFee = 2) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return 0;
  }

  let total = 0;
  
  for (const item of items) {
    // Validate item structure
    if (!item.price || typeof item.price !== 'number' || item.price < 0) {
      continue;
    }
    const quantity = item.quantity || 0;
    if (!Number.isInteger(quantity) || quantity < 0) {
      continue;
    }
    
    total += item.price * quantity;
  }
  
  return total + deliveryFee;
};

/**
 * Validate order items structure
 * @param {Array} items - Array of items to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export const validateOrderItems = (items) => {
  const errors = [];
  
  if (!items || !Array.isArray(items)) {
    return { valid: false, errors: ["Items must be an array"] };
  }
  
  if (items.length === 0) {
    return { valid: false, errors: ["Items array cannot be empty"] };
  }
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    if (!item._id || typeof item._id !== 'string') {
      errors.push(`Item ${i}: missing or invalid _id`);
    }
    
    if (!item.quantity || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      errors.push(`Item ${i}: quantity must be a positive integer`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
