import { toast as sonnerToast, type ExternalToast } from 'sonner';

// Map to track active toast IDs (optional, for future use)
const activeToastIds = new Set<string>();

/**
 * Generate a deterministic ID from toast content
 */
function generateToastId(message: string, options?: ExternalToast): string {
  // Use custom ID if provided (convert to string)
  if (options?.id) return String(options.id);
  
  // Generate a simple hash from message and description
  const description = options?.description || '';
  const key = `${message}:${description}`;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `toast-${Math.abs(hash)}`;
}

/**
 * Wrapper around sonner toast that prevents duplicate toasts
 * If a toast with the same ID is already visible, it will be updated instead of creating a new one
 */
export const toast = {
  success: (message: string, options?: ExternalToast) => {
    const id = generateToastId(message, options);
    activeToastIds.add(id);
    return sonnerToast.success(message, { ...options, id });
  },
  error: (message: string, options?: ExternalToast) => {
    const id = generateToastId(message, options);
    activeToastIds.add(id);
    return sonnerToast.error(message, { ...options, id });
  },
  info: (message: string, options?: ExternalToast) => {
    const id = generateToastId(message, options);
    activeToastIds.add(id);
    return sonnerToast.info(message, { ...options, id });
  },
  warning: (message: string, options?: ExternalToast) => {
    const id = generateToastId(message, options);
    activeToastIds.add(id);
    return sonnerToast.warning(message, { ...options, id });
  },
  loading: (message: string, options?: ExternalToast) => {
    const id = generateToastId(message, options);
    activeToastIds.add(id);
    return sonnerToast.loading(message, { ...options, id });
  },
  // For promise and custom, we just pass through with ID generation
  promise: sonnerToast.promise,
  custom: sonnerToast.custom,
  dismiss: sonnerToast.dismiss,
};

// Re-export the original Toaster component
export { Toaster } from 'sonner';