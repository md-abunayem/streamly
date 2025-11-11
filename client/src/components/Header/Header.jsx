import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Moon, Sun, Search, User, Bell, X } from "lucide-react";

import { ThemeContext } from "../../context/ThemeContext";
import SearchBar from "./SearchBar";
import { logoutUser, clearAuth } from "../../redux/slices/authSlice";

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  // const { theme, toggleTheme } = useContext(ThemeContext);
  // console.log(theme);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    // prevent default if called from a link
    if (e && e.preventDefault) e.preventDefault();
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      dispatch(clearAuth());
    } finally {
      // redirect to login page after logout
      navigate("/login");
    }
  };

  return (
    <header className=" border border-b-[0.5px] border-white/30">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 sm:h-12 md:h-20 flex items-center justify-between bg-gray-900  shadow-purple-500/10 dark:text-white text-black border-b-[0.5px] border-white/30`}
      >
        <div className={`px-4 sm:px-6 flex items-center sm:w-32 md:w-[30%]`}>
          <button onClick={toggleSidebar} className={`sm:mr-4 md:mx-12`}>
            {isSidebarOpen ? (
              <X className={`h-7 w-7`} />
            ) : (
              <Menu className={`h-7 w-7`} />
            )}
          </button>

          <div className={`h-9 w-20 rounded-xs object-contain`}>
            <img src="src/assets/images/logo.png" alt="Logo" />
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar />

        <div
          className={`flex justify-between items-center h-20 px-20 sm:gap-4 md:gap-6 md:pr-12`}
        >
          {!isAuthenticated ? (
            <NavLink
              to="/login"
              className="text-lg font-semibold text-blue-500"
            >
              Login
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className="text-lg font-semibold text-blue-500 bg-transparent"
            >
              Logout
            </button>
          )}

          {/* <button
            className={`bg-gray-700/60 p-2 rounded-full`}
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <Moon className={`h-7 w-7`} />
            ) : (
              <Sun className={`h-7 w-7`} />
            )}
          </button> */}
          <div className={`bg-gray-700/60 p-2 rounded-full`}>
            <Bell className={`h-7 w-7`} />
          </div>
          <div className={`p-2 rounded-full bg-purple-900/80`}>
            <User className={`h-7 w-7`} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
