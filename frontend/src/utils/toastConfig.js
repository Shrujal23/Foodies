import toast from 'react-hot-toast';

/**
 * Custom toast notification config with premium styling
 */

const toastConfig = {
  success: (message, duration = 4000) => {
    toast.success(message, {
      duration,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '14px',
        padding: '16px 24px',
        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
      },
      icon: '✓',
    });
  },

  error: (message, duration = 3000) => {
    toast.error(message, {
      duration,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '14px',
        padding: '16px 24px',
        boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
      },
      icon: '✕',
    });
  },

  info: (message, duration = 4000) => {
    toast(message, {
      duration,
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '14px',
        padding: '16px 24px',
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
      },
      icon: 'ℹ️',
    });
  },

  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#f97316',
        color: '#fff',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '14px',
        padding: '16px 24px',
        boxShadow: '0 10px 30px rgba(249, 115, 22, 0.3)',
      },
    });
  },

  update: (toastId, options) => {
    toast.update(toastId, {
      position: 'top-right',
      style: {
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '14px',
        padding: '16px 24px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      },
      ...options,
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  promise: (promise, messages, duration = 4000) => {
    return toast.promise(
      promise,
      {
        loading: {
          title: messages.loading || 'Loading...',
          icon: '⏳',
        },
        success: {
          title: messages.success || 'Success!',
          icon: '✓',
        },
        error: {
          title: messages.error || 'Error!',
          icon: '✕',
        },
      },
      {
        duration,
        position: 'top-right',
        style: {
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '14px',
          padding: '16px 24px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        },
      }
    );
  },
};

export default toastConfig;
