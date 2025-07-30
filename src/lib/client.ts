import axios from "axios";

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use the environment variable for the base URL
  withCredentials: true, // Enable sending cookies with requests
  withXSRFToken: true, // Ensure CSRF token is sent
  headers: {
    "Content-Type": "application/json",
  },
});
