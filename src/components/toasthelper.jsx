import { toast } from 'react-toastify';

export const showToast = (message, type) => {
  toast[type](message, {
    position: toast.POSITION.TOP_CENTER,
  });
};
