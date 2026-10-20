import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});

  // Restore dishes from session cache if available so page renders instantly
  const [food_list, setFoodList] = useState(() => {
    try {
      const cached = sessionStorage.getItem("cached_food_list");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
  const [authChecked, setAuthChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Only show the pan spinner if we don't have dishes cached
  const [loadingDishes, setLoadingDishes] = useState(() => {
    try {
      const cached = sessionStorage.getItem("cached_food_list");
      return !cached || JSON.parse(cached).length === 0;
    } catch {
      return true;
    }
  });

  const url = "https://tomato-backend-xfdl.onrender.com";

  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const current = prev[itemId] || 0;
      return { ...prev, [itemId]: current + 1 };
    });

    const foodItem = food_list.find((item) => String(item._id) === String(itemId));
    const itemName = foodItem ? foodItem.name : "Dish";
    toast.success(`${itemName} added to cart!`, { autoClose: 1400 });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token } }
        );
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
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Cart removal error:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => String(product._id) === String(item));
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success && Array.isArray(response.data.data)) {
        setFoodList(response.data.data);
        sessionStorage.setItem("cached_food_list", JSON.stringify(response.data.data));
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
    let isMounted = true;

    async function initData() {
      const savedToken = localStorage.getItem("token");
      const savedName = localStorage.getItem("userName");

      if (savedToken && isMounted) {
        setToken(savedToken);
        if (savedName) setUserName(savedName);
      }

      // Fetch dishes and cart in parallel
      const tasks = [fetchFoodList()];
      if (savedToken) {
        tasks.push(loadCartData(savedToken));
      }

      await Promise.allSettled(tasks);
      if (isMounted) {
        setAuthChecked(true);
        setLoadingDishes(false);
      }
    }

    initData();

    return () => {
      isMounted = false;
    };
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