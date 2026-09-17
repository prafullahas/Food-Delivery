const ORDER_STATUSES = [
  "Placed",
  "Preparing",
  "Ready for Pickup",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

const STATUS_TRANSITIONS = {
  "Placed": ["Preparing", "Cancelled"],
  "Preparing": ["Ready for Pickup", "Cancelled"],
  "Ready for Pickup": ["Out for Delivery", "Cancelled"],
  "Out for Delivery": ["Delivered", "Cancelled"],
  "Delivered": [],
  "Cancelled": []
};

// Legacy status mapping for backward compatibility
const LEGACY_STATUS_MAP = {
  "Food Processing": "Placed",
  "Out for delivery": "Out for Delivery"
};

export { ORDER_STATUSES, STATUS_TRANSITIONS, LEGACY_STATUS_MAP };
