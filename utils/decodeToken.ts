import {jwtDecode} from "jwt-decode";

interface DecodedToken {
    exp: number;
    iat?: number;

}

export const isTokenExpired = (token: string) => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if(!decoded.exp) return true;

        const currenTime = Date.now() / 1000;
        return decoded.exp < currenTime;
    } catch (error) {
        return true;
    }
}