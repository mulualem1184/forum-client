import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./../../assets/images/evangadi-logo-black.png";
import { AuthContext } from "../../Hooks/AuthContext";
import classes from "./Header.module.css";

import { IoMenuSharp } from "react-icons/io5";

function Header() {
  const { isLoggedIn, logout} = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility

  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      // navigate("/");
       logout();
   
    } else {

      navigate("/auth");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  return (
    <section className={classes.fixed}>
      <div className={classes.header_container}>
        <div className={classes.logo_container}>
          <img src={logo} alt="Evangadi logo" />
        </div>
        <div className={classes.header_link}>
          <button className={classes.hamburger} onClick={toggleMenu}>
            <IoMenuSharp />
          </button>
          <nav className={`${classes.nav} ${isMenuOpen ? classes.open : ""}`}>
            <Link to="/" className={classes.link}>
              <span>Home</span>
            </Link>
            <Link to="/Howitworks" className={classes.link}>
              <span>How it works</span>
            </Link>
            <button
              className={classes.header_btn}
              onClick={handleAuthButtonClick}
            >
              {isLoggedIn ? "SIGN OUT" : "SIGN IN"}
            </button>
          </nav>
        </div>
      </div>
    </section>
  );
}

export default Header;
