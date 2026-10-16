import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <h2 className="logo">Tomato. <span>Admin Panel</span></h2>
      <div className="profile">Admin</div>
    </div>
  );
};

export default Navbar;