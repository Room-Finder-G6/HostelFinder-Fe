import {jwtDecode} from "jwt-decode";
import { toast } from "react-toastify";


export interface CustomJwtPayLoad {
    userId : string; 
}

export const decodeToken = (token: string): CustomJwtPayLoad | null => {
    try{
        const decoded = jwtDecode<CustomJwtPayLoad>(token);
        return decoded;
    }
    catch(error) {
        toast("Token invalid");
        return null;
    }
}