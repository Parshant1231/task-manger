// utils/decodeToken.ts
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  id: string;
  role: string;
  exp: number;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);

  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}
