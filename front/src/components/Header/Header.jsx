import React from "react";
import { NavLink } from "react-router";
import logoGraphidel from "../../assets/img/logo.jpg";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { CiHeart } from "react-icons/ci";
import { MdPersonOutline } from "react-icons/md";
import { MdMailOutline } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { BsBag } from "react-icons/bs";
const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logoGraphidel} alt="Graphidel Logo" />
      </div>

      <nav className="nav-links">
        <NavLink to="/" end><GoHome className="header-icons"/>Home</NavLink>
        <NavLink to="/about"><IoInformationCircleOutline/>About</NavLink>
        <NavLink to="/shop"><BsBag/>Shop</NavLink>
        <NavLink to="/contact"><MdMailOutline/> Contact</NavLink>
      </nav>

      <div className="header-icons a">
        <NavLink to="/account">
         <MdPersonOutline/> My Account
        </NavLink>
        <NavLink to="/favourites">
          <CiHeart /> My Favourites
        </NavLink>
        <NavLink to="/cart">
          <HiOutlineShoppingCart /> My Cart
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
