import {jwtDecode} from "jwt-decode";

export interface DecodedToken {
    UserId : string;
}

export const getUserIdFromToken = (): string | null => {
    // Kiểm tra nếu đang chạy trên server
    if (typeof window === "undefined") {
        console.error("localStorage is not available on the server");
        return null;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token not found in localStorage");
        return null;
    }

    try {
        const decodedToken: DecodedToken = jwtDecode(token);
        return decodedToken.UserId || null;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};
