import { useEffect, useState } from "react";
import { LogIn, User, Lock, EyeOff, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  loginUser,
  clearError,
  clearSuccess,
} from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, errorMessage, successMessage, isAuthenticated } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    identifier: "", //identifier for username/email
    password: "",
  });

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      setFormData({ identifier: "", password: "" });
      navigate("/");
    }

    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage, navigate, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    const isEmail = /\S+@\S+\.\S+/.test(formData.identifier);

    const credential = isEmail
      ? { email: formData.identifier, password: formData.password }
      : { userName: formData.identifier, password: formData.password };

    // dispatch(clearError());
    dispatch(loginUser(credential));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="sm:max-w-[50%] md:w-132 lg:w-152 mx-auto bg-white shadow-lg rounded-lg flex flex-col justify-center items-center pt-10">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-purple-700/80 flex justify-center items-center ">
            <LogIn className="w-12 h-12 text-white" />
          </div>
          <p className="text-4xl text-black font-semibold mt-8">Welcome Back</p>
          <p className="text-2xl text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* error message */}
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* form */}
        <div className="w-full p-10">
          <form
            action=""
            onSubmit={handleLogin}
            className="flex flex-col items-start w-full"
          >
            {/* username or email field */}
            <div className="w-full">
              <label
                htmlFor="identifier"
                className="block text-sm font-semibold mb-2 text-gray-700 pt-2"
              >
                Username or Email*
              </label>
              <div className="flex border[border-width:0.5px] border-gray-300 rounded-sm py-2 focus-within:border-purple-500 focuse-within: ring-1 focus-within:ring-purple-500 transform">
                <User className="text-gray-400 mx-2" />
                <input
                  type="text"
                  name="identifier"
                  id="identifier"
                  className="outline-none w-full"
                  placeholder="Enter username or email"
                  required
                  value={formData.identifier}
                  onChange={handleChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-1">
                You can use either your username or email address
              </p>
            </div>

            {/* password field */}
            <div className="w-full">
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2 text-gray-700 pt-2"
              >
                Password*
              </label>
              <div className="flex border[border-width:0.5px] border-gray-300 rounded-sm py-2 focus-within:border-purple-500 focus-within: ring-1 focus-within:ring-purple-500 transform">
                <Lock className="text-gray-400 mx-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className="outline-none w-full"
                  placeholder="Enter password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-2 hover:bg-gray-100 rounded transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700/70 text-white py-2 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="w-full text-center mt-8 text-gray-600 text-[1.2rem]">
            Don't have an account?{" "}
            <Link to="/register">
              <span className="text-purple-700 font-bold text-[1.2rem]">
                Sign Up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
