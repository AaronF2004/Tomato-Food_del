import React, { useState } from "react";
import "./Add.css";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.warn("Please upload an image for the dish.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });
        setImage(false);
        toast.info("Dish added to menu successfully!", { autoClose: 2000 });
      } else {
        toast.error(response.data.message || "Failed to add dish");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-page">
      <div className="admin-add-header">
        <h2>Add New Food Item</h2>
        <p className="sub-title">Publish a new dish to the live customer menu</p>
      </div>

      <div className="add-split-container">
        {/* Main Form */}
        <form className="add-dish-form" onSubmit={onSubmitHandler}>
          {/* Upload Area */}
          <div className="form-group">
            <label className="form-label">Dish Image</label>
            <div className="upload-dropzone">
              <input
                type="file"
                id="dish-image-input"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <label htmlFor="dish-image-input" className="upload-label-box">
                {image ? (
                  <div className="uploaded-preview-wrap">
                    <img src={URL.createObjectURL(image)} alt="Preview" />
                    <span className="change-img-overlay">Change Image</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="upload-svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <p className="upload-main-text">Click or drag image here</p>
                    <span className="upload-sub-text">PNG, JPG, or WEBP up to 5MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Dish Name */}
          <div className="form-group">
            <label className="form-label">Dish Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Butter Chicken"
              value={data.name}
              onChange={onChangeHandler}
              required
              className="form-input"
            />
          </div>

          {/* Dish Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe the flavors, fresh ingredients, spices, or preparation..."
              value={data.description}
              onChange={onChangeHandler}
              required
              className="form-textarea"
            ></textarea>
          </div>

          {/* Category & Price Row */}
          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={data.category}
                onChange={onChangeHandler}
                className="form-select"
              >
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Deserts">Deserts</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option>
                <option value="Non Veg">Non Veg</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price ($ USD)</label>
              <input
                type="number"
                name="price"
                placeholder="20"
                min="1"
                value={data.price}
                onChange={onChangeHandler}
                required
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="add-submit-btn" disabled={loading}>
            {loading ? "Adding Dish..." : "Publish Dish to Menu"}
          </button>
        </form>

        {/* Live Card Preview */}
        <div className="live-preview-panel">
          <span className="preview-tag">Customer Card Preview</span>
          <div className="customer-preview-card">
            <div className="preview-img-box">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Preview" />
              ) : (
                <div className="placeholder-box">Image Preview</div>
              )}
              <span className="preview-badge">{data.category}</span>
            </div>
            <div className="preview-info-box">
              <h4>{data.name || "Dish Name"}</h4>
              <p>{data.description || "Freshly crafted delicious dish with signature spices and toppings."}</p>
              <div className="preview-price-row">
                <b>${data.price ? data.price : "00"}.00</b>
                <span className="preview-add-pill">+ Add</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;