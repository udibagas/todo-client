import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // Enable sending cookies with requests
  withXSRFToken: true, // Ensure CSRF token is sent
  headers: {
    "Content-Type": "application/json",
  },
});
