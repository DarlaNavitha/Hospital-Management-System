import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

//  REQUEST INTERCEPTOR
API.interceptors.request.use((req,res) => {
        const token = Cookies.get("logininfo"); //store ONLY token

        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }

        return req;
    },
    (error) => Promise.reject(error)
);

//  RESPONSE INTERCEPTOR
API.interceptors.response.use(
    (res) => res,
    (err) => {
    
        if (err.response?.status === 401) {
            console.warn("Unauthorized - Logging out");
            Cookies.remove("logininfo");
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default API;