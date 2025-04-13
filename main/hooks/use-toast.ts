import { toast, ToastOptions } from 'react-toastify';


interface UseToast {
  showSuccess: (message: string, options?: ToastOptions) => void;
  showError: (message: string, options?: ToastOptions) => void;
  showWarning: (message: string, options?: ToastOptions) => void;
  showInfo: (message: string, options?: ToastOptions) => void;
  showToast: (message: string, options?: ToastOptions) => void;
}

enum ToastPosition {
  TOP_RIGHT = 'top-right'
}

const useToast = (): UseToast => {
  const showSuccess = (message: string, options: ToastOptions = {}) => {
    toast.success(message, {
      position: ToastPosition.TOP_RIGHT,
      autoClose: 3000,
      ...options,
    });
  };

  const showError = (message: string, options: ToastOptions = {}) => {
    toast.error(message, {
      position: ToastPosition.TOP_RIGHT,
      autoClose: 3000,
      ...options,
    });
  };

  const showWarning = (message: string, options: ToastOptions = {}) => {
    toast.warn(message, {
      position: ToastPosition.TOP_RIGHT,
      autoClose: 3000,
      ...options,
    });
  };

  const showInfo = (message: string, options: ToastOptions = {}) => {
    toast.info(message, {
      position: ToastPosition.TOP_RIGHT,
      autoClose: 3000,
      ...options,
    });
  };

  const showToast = (message: string, options: ToastOptions = {}) => {
    toast(message, {
      position: ToastPosition.TOP_RIGHT,
      autoClose: 3000,
      ...options,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showToast,
  };
};

export default useToast;