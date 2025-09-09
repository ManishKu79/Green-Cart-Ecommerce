import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios'

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Add request interceptor to include token in headers
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});

    // Fetch user status and cart data
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setCartItems({});
                return;
            }

            const { data } = await axios.get('/api/user/is-auth');
            if (data.success && data.user) {
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
            } else {
                setUser(null);
                setCartItems({});
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
            setCartItems({});
            localStorage.removeItem('token');
        }
    };

    // Initialize user state on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setUser(null);
            setCartItems({});
        }
    }, []);

    // Handle login
    const handleLogin = async (email, password) => {
        try {
            const { data } = await axios.post('/api/user/login', { email, password });
            if (data.success && data.user) {
                localStorage.setItem('token', data.user.token);
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            // Clear all user-related state first
            setUser(null);
            setCartItems({});
            localStorage.removeItem('token');
            
            // Then make the logout request
            await axios.get('/api/user/logout');
            
            // Show success message and navigate
            toast.success("Logged out successfully");
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout");
        }
    };

    //fetch seller info
    const fetchSeller = async()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth')
            if(data.success){
                setIsSeller(true)
            }
            else{
                setIsSeller(false)

            }
        } catch (error) {
            setIsSeller(false)
            
        }
    }
    const fetchProducts = async ()=>{
        setProducts(dummyProducts)
    }

    // Handle cart updates
    const updateCartInDB = async (cartData) => {
        try {
            if (!user) return; // Don't update if user is not logged in
            
            const { data } = await axios.post('/api/cart/update', cartData);
            if (data.success) {
                // Update local cart state with the server's response
                setCartItems(data.cartItems || cartData);
            } else {
                toast.error(data.message);
                // Refresh cart data from server if update fails
                fetchUser();
            }
        } catch (error) {
            console.error("Error updating cart:", error);
            toast.error("Failed to update cart");
            // Refresh cart data from server if update fails
            fetchUser();
        }
    };

    const addToCart = (itemId) => {
        if (!user) {
            toast.error("Please login to add items to cart");
            setShowUserLogin(true);
            return;
        }
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        updateCartInDB(cartData);
        toast.success("Added to cart");
    };

    const updateCartItem = (itemId, quantity) => {
        if (!user) return;
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        updateCartInDB(cartData);
        toast.success("Cart Updated");
    };

    const removeFromCart = (itemId) => {
        if (!user) return;
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        setCartItems(cartData);
        updateCartInDB(cartData);
        toast.success("Remove From Cart");
    };

    const getCartCount = () =>{
        let totalCount = 0;
        for(const item in cartItems){
            totalCount+=cartItems[item]
        }
        return totalCount;
    }

    const getCartAmount = () =>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=>product._id === items);
            if(cartItems[items] > 0){
                totalAmount += itemInfo.offerPrice * cartItems[items] 
            }
        }
        return Math.floor(totalAmount*100)/100;
    }

    useEffect(()=>{
        fetchSeller()
    },[])

    useEffect(()=>{
      fetchProducts()
    },[])

    const value = { 
        navigate, 
        user, 
        setUser, 
        setIsSeller, 
        isSeller,
        showUserLogin, 
        setShowUserLogin,
        products, 
        currency,
        addToCart,
        updateCartItem,
        removeFromCart,
        cartItems,
        searchQuery,
        setSearchQuery,
        getCartAmount,
        getCartCount,
        axios,
        setCartItems,
        handleLogin,
        handleLogout
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
