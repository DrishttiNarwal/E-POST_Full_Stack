import {toast} from 'react-toastify';

export const toastSuccess = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 5000,
    });
}

export const toastError = (message: string) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
    });
}