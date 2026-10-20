import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching dishes");
      }
    } catch (error) {
      console.error(error);
      toast.error("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Triggered when user confirms delete in modal
  const handleConfirmDelete = async () => {
    if (!deleteModalItem) return;
    const foodId = deleteModalItem._id;
    const foodName = deleteModalItem.name;

    // Immediately dismiss confirmation popup
    setDeleteModalItem(null);
    setIsDeleting(true);

    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        // Standard blue toast popup identical to your frontend notification
        toast.info(`${foodName ? `"${foodName}"` : "Dish"} removed successfully`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });

        // Optimistic UI removal
        setList((prev) => prev.filter((item) => item._id !== foodId));
      } else {
        toast.error(response.data.message || "Failed to remove dish");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error removing dish from server");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `${url}/images/${image}`;
  };

  const filteredList = list.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(list.map((item) => item.category))];

  return (
    <div className="admin-list-page">
      <div className="admin-list-header">
        <div>
          <h2>Menu Inventory</h2>
          <p className="sub-title">Manage active food items available on the platform</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="list-controls">
          <div className="list-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.2" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && <span onClick={() => setSearchTerm("")} className="clear-search">✕</span>}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter-select"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="list-loading-wrap">
          <p>Loading dishes from kitchen database...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="list-empty-wrap">
          <p>No dishes matched your filter.</p>
        </div>
      ) : (
        <div className="list-table-container">
          <div className="list-table-header">
            <span>Dish</span>
            <span>Name</span>
            <span>Category</span>
            <span>Price</span>
            <span style={{ textAlign: "center" }}>Action</span>
          </div>

          {filteredList.map((item, index) => (
            <div key={index} className="list-table-row">
              <div className="dish-img-wrapper">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80";
                  }}
                />
              </div>

              <div className="dish-name-col">
                <b>{item.name}</b>
                <span className="dish-desc-tooltip">{item.description}</span>
              </div>

              <div className="dish-cat-col">
                <span className="cat-badge">{item.category}</span>
              </div>

              <div className="dish-price-col">
                ${item.price}.00
              </div>

              <div className="dish-action-col">
                <button
                  className="delete-dish-btn"
                  onClick={() => setDeleteModalItem(item)}
                  title="Remove from menu"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Standard Confirmation Popup Modal */}
      {deleteModalItem && (
        <div className="delete-modal-overlay" onClick={() => setDeleteModalItem(null)}>
          <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.4">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3>Remove Food Item?</h3>
            <p>
              Are you sure you want to delete <b>"{deleteModalItem.name}"</b> from the menu? It will no longer be visible to customers.
            </p>
            <div className="delete-modal-actions">
              <button
                className="delete-cancel-btn"
                onClick={() => setDeleteModalItem(null)}
              >
                Keep Dish
              </button>
              <button
                className="delete-confirm-btn"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Dish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;