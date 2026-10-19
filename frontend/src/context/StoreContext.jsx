import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  
  // Synchronous token & userName initialization from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
  const [authChecked, setAuthChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingDishes, setLoadingDishes] = useState(true);

  const url = "https://tomato-backend-xfdl.onrender.com";

  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const current = prev[itemId] || 0;
      return { ...prev, [itemId]: current + 1 };
    });

    const foodItem = food_list.find((item) => item._id === itemId);
    const itemName = foodItem ? foodItem.name : "Dish";
    toast.success(`${itemName} added to cart!`, { autoClose: 1400 });

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Cart sync error:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });

    toast.info("Cart updated", { autoClose: 1200 });

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Cart removal error:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    setLoadingDishes(true);
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
    } finally {
      setLoadingDishes(false);
    }
  };

  const loadCartData = async (userToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token: userToken } }
      );
      if (response.data.success && response.data.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Cart data loading error:", error);
    }
  };

  useEffect(() => {
    async function initData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      const savedName = localStorage.getItem("userName");
      if (savedToken) {
        setToken(savedToken);
        if (savedName) setUserName(savedName);
        await loadCartData(savedToken);
      }
      setAuthChecked(true);
    }
    initData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    userName,
    setUserName,
    authChecked,
    searchQuery,
    setSearchQuery,
    loadingDishes,
    loadCartData
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;