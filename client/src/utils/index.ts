import {toast} from "react-toastify";
import Swal from 'sweetalert2'

export const getAutoColumns = (count: number): number =>{
    if (count <= 6) return 1;
    if (count <= 12) return 2;
    if (count <= 18) return 3;

    return 4;
}


export function splitCategoryColumns<T>(data: T[], colCount: number): T[][] {
    const columns: T[][] = Array.from({ length: colCount }, () => []);

    let colIndex = 0;

    data.forEach((item) => {
        columns[colIndex].push(item);

        colIndex++;
        if (colIndex >= colCount) colIndex = 0;
    });

    return columns;
}




export const slugify = (text?: string): string => {
    if(!text) return '';
    return text
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")          // & → and
        .replace(/[^a-z0-9\s-]/g, "")  // remove special chars
        .replace(/\s+/g, "-");         // spaces → dash
};


export const successToast = (message: string) => {
    toast.success(message);
};

export const errorToast = (message: string) => {
    toast.error(message);
};

export const baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || ""


export const formatPrice = (value: number) => `Tk ${Math.floor(value)}`;


export const buildQueryString = (params?: Record<string, string | number | boolean | null | undefined>): string => {
    if (!params) return "";
    return "?" + new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
    ).toString();
};


// get user id from localStorge
export const getUserId = (): number | null => {
    if (typeof window === "undefined") return null;

    const guestStr = localStorage.getItem("guest_user");

    if (guestStr) {
        try {
            const guest = JSON.parse(guestStr);

            if (Date.now() > guest.expiry) {
                localStorage.removeItem("guest_user");
                return null;
            }

            return Number(guest.value) || null;
        } catch {
            localStorage.removeItem("guest_user");
            return null;
        }
    }

    // get login user id after login
    const login_user = localStorage.getItem("login_user");

    if(login_user) {
        try {
            const user = JSON.parse(login_user);
            return user.id
        }catch {
            return null
        }
    }

    const userId = localStorage.getItem("user_id");

    if (!userId) return null;

    const parsedId = Number(userId);
    return isNaN(parsedId) ? null : parsedId;
};



// set user id in localStorge
export const setUserId = (hours = 2) => {
    const userId = String(Math.floor(Math.random() * 1000000));

    const data = {
        value: userId,
        expiry: Date.now() + hours * 60 * 60 * 1000, // default 2 hours
    };

    localStorage.setItem("guest_user", JSON.stringify(data));

    return Number(userId);
};


// get login user
export const getUser = () =>{
    if (typeof window === "undefined") return null;
    const loginUser = localStorage.getItem("login_user");
    if (!loginUser) return null;

    return  JSON.parse(loginUser);

}


export const statusColor = (status: string) => {
    switch (status) {
        case "completed":
            return "bg-green-100 text-green-700";
        case "pending":
            return "bg-yellow-100 text-yellow-700";
        case "cancelled":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};


export const  DeleteAlert = async ()=> {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to remove this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
        allowOutsideClick: false
    });
    return result.isConfirmed;
}

export const SuccessAlert = async (msg: string)=> {
    const result = await Swal.fire({
        text: msg,
        icon: "success",
        confirmButtonColor: "#198754",
        confirmButtonText: "OK",
        allowOutsideClick: false
    });
    return result.isConfirmed;
}