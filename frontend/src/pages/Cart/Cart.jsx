import React, { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, addToCart, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  // Ensure user always lands at the top of the page rather than jumping to footer
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalItemsCount = Object.values(cartItems).reduce(
    (acc, val) => (val > 0 ? acc + val : acc),
    0
  );

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const toPay = subtotal === 0 ? 0 : subtotal + deliveryFee;

  return (
    <div className="cart-page-wrapper">
      {totalItemsCount === 0 ? (
        /* Empty Cart State (Image 2) */
        <div className="cart-empty-card">
          <div className="empty-cart-icon-wrap">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e23744"
              strokeWidth="2"
              className="empty-cart-svg"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any dishes to your cart yet.</p>
          <button
            className="browse-menu-btn"
            onClick={() => navigate("/")}
          >
            Browse Menu & Dishes
          </button>
        </div>
      ) : (
        /* Active Cart State (Image 1) */
        <div className="cart-layout-container">
          <div className="cart-items-section">
            <div className="cart-title-row">
              <h2>Order Summary</h2>
              <span className="cart-total-badge">
                {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
              </span>
            </div>

            <div className="cart-table-card">
              <div className="cart-table-header">
                <span className="th-dish">DISH</span>
                <span className="th-price">PRICE</span>
                <span className="th-qty">QUANTITY</span>
                <span className="th-total">TOTAL</span>
              </div>

              <div className="cart-items-list">
                {food_list.map((item) => {
                  const qty = cartItems[item._id] || 0;
                  if (qty > 0) {
                    const isVeg = item.category === "Pure Veg" || item.category === "Salad";
                    const imageSrc =
                      item.image && (item.image.startsWith("http") || item.image.startsWith("/"))
                        ? item.image
                        : `${url}/images/${item.image}`;

                    return (
                      <div key={item._id} className="cart-item-row">
                        <div className="cart-item-dish-col">
                          <img src={imageSrc} alt={item.name} className="cart-dish-thumb" />
                          <div className="cart-dish-meta">
                            <h4 className="cart-dish-name">{item.name}</h4>
                            <span className="cart-dish-type">
                              {isVeg ? "Pure Veg" : "Non Veg"}
                            </span>
                          </div>
                        </div>

                        <div className="cart-item-price-col">${item.price}</div>

                        <div className="cart-item-qty-col">
                          <div className="cart-pill-counter">
                            <button onClick={() => removeFromCart(item._id)}>-</button>
                            <span>{qty}</span>
                            <button onClick={() => addToCart(item._id)}>+</button>
                          </div>
                        </div>

                        <div className="cart-item-total-col">
                          ${item.price * qty}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          {/* Right Bill Details Card */}
          <div className="cart-summary-sidebar">
            <div className="bill-details-card">
              <h3>Bill Details</h3>

              <div className="bill-line-item">
                <span>Item Subtotal</span>
                <span>${subtotal}.00</span>
              </div>

              <div className="bill-line-item">
                <span>Delivery Partner Fee</span>
                <span>${deliveryFee}.00</span>
              </div>

              <hr className="bill-divider" />

              <div className="bill-line-item bill-total-line">
                <span>To Pay</span>
                <span>${toPay}.00</span>
              </div>

              <button
                className="checkout-action-btn"
                onClick={() => navigate("/order")}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;