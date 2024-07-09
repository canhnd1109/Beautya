import { toast } from "react-toastify";

export const showSuccessToast = (message) => {
  toast.success(message || "successful");
};

export const showErrorToast = (message) => {
  toast.error(message || "error");
};
