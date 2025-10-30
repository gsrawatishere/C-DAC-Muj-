import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
    
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const response = await axiosInstance.post("/auth/login",formData);
       if(response.status == 200){
        toast.success(response.data.message);
        console.log(response.data.user.role)
        if(response.data.user.role === "freelancer"){
          navigate("/freelancer");
        }else{
           navigate("/client");
        }
       }
    } catch (err) {
      console.error("Login Error:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Something went wrong during Login!";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-700 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-emerald-400 mb-6 text-center">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm mb-2 text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@domain.com"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-100 placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2 text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-100 placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all text-white font-semibold py-2.5 rounded-lg shadow-md"
          >
            Login
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-emerald-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;