import { ORDER_STATUSES, STATUS_TRANSITIONS, LEGACY_STATUS_MAP } from "../constants/orderStatus.js";

/**
 * Check if a status transition is valid
 * @param {string} currentStatus - The current order status
 * @param {string} nextStatus - The desired next status
 * @returns {boolean} - True if transition is valid, false otherwise
 */
export const canTransitionStatus = (currentStatus, nextStatus) => {
  // Normalize legacy statuses
  const normalizedCurrent = LEGACY_STATUS_MAP[currentStatus] || currentStatus;
  const normalizedNext = LEGACY_STATUS_MAP[nextStatus] || nextStatus;

  // Validate both statuses are in the allowed list
  if (!ORDER_STATUSES.includes(normalizedCurrent)) {
    return false;
  }
  if (!ORDER_STATUSES.includes(normalizedNext)) {
    return false;
  }

  // Get valid transitions for current status
  const validTransitions = STATUS_TRANSITIONS[normalizedCurrent] || [];

  // Check if next status is in valid transitions
  return validTransitions.includes(normalizedNext);
};

/**
 * Normalize a status string to its canonical form
 * @param {string} status - The status to normalize
 * @returns {string} - The normalized status
 */
export const normalizeStatus = (status) => {
  return LEGACY_STATUS_MAP[status] || status;
};

/**
 * Check if a status is valid
 * @param {string} status - The status to check
 * @returns {boolean} - True if status is valid, false otherwise
 */
export const isValidStatus = (status) => {
  const normalized = LEGACY_STATUS_MAP[status] || status;
  return ORDER_STATUSES.includes(normalized);
};

/**
 * Check if a status is a terminal state (no further transitions allowed)
 * @param {string} status - The status to check
 * @returns {boolean} - True if status is terminal, false otherwise
 */
export const isTerminalStatus = (status) => {
  const normalized = LEGACY_STATUS_MAP[status] || status;
  const validTransitions = STATUS_TRANSITIONS[normalized] || [];
  return validTransitions.length === 0;
};
