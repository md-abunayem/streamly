import { User, Mail, LockIcon, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";

import {
  registerUser,
  clearError,
  clearSuccess,
} from "../../redux/slices/authSlice";


const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, errorMessage, successMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    fullName: "",
    password: "",
    avatar: null, //reqired
    coverImage: null, //optional
  });

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value })); //ternary operator used
  // };

  //handle success/error message
  useEffect(() => {
    if(successMessage){
      toast.success(successMessage);
      dispatch(clearSuccess());
      navigate("/login")
    }
    if(errorMessage){
      toast.error(errorMessage);
      dispatch(clearError());
    }
  }, [successMessage,errorMessage, navigate, dispatch])
  

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle file inputs
    if (files && files[0]) {
      const file = files[0];

      // Update formData with the file
      setFormData((prev) => ({ ...prev, [name]: file }));

      // Create preview using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === "avatar") {
          setAvatarPreview(reader.result);
        } else if (name === "coverImage") {
          setCoverImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Handle text inputs
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  //handle form submision
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.avatar) {
      toast.error("Please upload your avatar!");
      return;
    }
    
    dispatch(clearError());
    dispatch(registerUser(formData));
  };

  return (
    <div
      className={`flex flex-col justify-center items-center min-h-screen bg-gray-100 my-8`}
    >
      <div
        className={`p-6 sm:w-[65%] md:120 lg:w-152 bg-white rounded-lg shadow-lg `}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 rounded-full bg-purple-900/80 flex justify-center items-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="mt-4 text-3xl font-semibold">Create Account</p>
          <p className="text-gray-500 text-xl">Sign up to get started</p>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* form */}
        <form
          method="post"
          onSubmit={handleRegister}
          encType="multipart/form-data"
        >
          <div className="mb-4">
            <label
              htmlFor="userName"
              className="block text-sm font-semibold mb-2 text-gray-700 pt-2"
            >
              Username*
            </label>
            <div className="flex border border-gray-300 rounded-sm py-1">
              <User className="pl-2 mr-4 h-8 w-8" />
              <input
                type="text"
                className="w-full outline-none"
                placeholder="Enter your username"
                required
                onChange={handleChange}
                name="userName"
                id="userName"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-2 text-gray-700 pt-2"
            >
              Email*
            </label>
            <div className="flex border border-gray-300 rounded-sm py-1">
              <Mail className="pl-2 mr-4 h-8 w-8" />
              <input
                type="email"
                className="w-full outline-none"
                placeholder="Enter your email"
                onChange={handleChange}
                required
                name="email"
                id="email"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold mb-2 text-gray-700 pt-2"
            >
              Full Name*
            </label>
            <div className="flex border border-gray-300 rounded-sm py-1">
              <User className="pl-2 mr-4 h-8 w-8" />
              <input
                type="text"
                className="w-full outline-none"
                placeholder="Enter your full name"
                onChange={handleChange}
                required
                name="fullName"
                id="fullName"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2 text-gray-700 pt-2"
            >
              Password*
            </label>
            <div className="flex border border-gray-300 rounded-sm py-1">
              <LockIcon className="pl-2 mr-4 h-8 w-8" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full outline-none"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                name="password"
                id="password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="pr-2"
              >
                {showPassword ? (
                  <EyeOff className="text-sm" />
                ) : (
                  <Eye className="text-sm" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar*
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer">
                {avatarPreview ? (
                  <div className="w-full h-32 rounded-lg overflow-hidden border-2 border-blue-500">
                    <img
                      src={avatarPreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer">
                {coverImagePreview ? (
                  <div className="w-full h-32 rounded-lg overflow-hidden border-2 border-blue-500">
                    <img
                      src={coverImagePreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  name="coverImage"
                  id="coverImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-8 bg-purple-500 py-2 rounded-xl text-white font-bold text-xl"
          >
            {isLoading ? "Registering" : "Sign Up"}
          </button>
        </form>
        {/* existing account instruction */}
        <p className="w-full text-center mt-8 text-gray-600 text-[1.2rem]">
          Already have an account?{" "}
          <Link to={"/login"}>
            <span className={"text-purple-700 font-bold text-[1.2rem]"}>
              Log In
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
