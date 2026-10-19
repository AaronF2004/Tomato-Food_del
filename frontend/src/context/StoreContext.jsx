import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Shared search state
  const url = "http://localhost:4000";

  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const current = prev[itemId] || 0;
      return { ...prev, [itemId]: current + 1 };
    });

    const foodItem = food_list.find((item) => item._id === itemId);
    const itemName = foodItem ? foodItem.name : "Item";
    toast.success(`${itemName} added to cart!`, { autoClose: 1500 });

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
        console.error("Cart sync error:", error);
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
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
      toast.error("Could not load menu items. Ensure backend is running.");
    }
  };

  const loadCartData = async (userToken) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token: userToken } });
      if (response.data.success && response.data.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Cart retrieval error:", error);
    }
  };

  useEffect(() => {
    async function init() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    init();
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
    searchQuery,
    setSearchQuery
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;