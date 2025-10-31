import React, { useState } from "react";
import { User, Mail, Wallet, Briefcase, Lock, Loader2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";


export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    walletAddress: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔗 Connect Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        setFormData((prev) => ({ ...prev, walletAddress: address }));
        toast.success("Wallet connected");
      } catch (err) {
        console.error("Wallet connection error:", err);
        toast.error("Failed to connect wallet!");
      }
    } else {
      toast.error("Please install MetaMask!");
    }
  };

  // 📤 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.walletAddress) {
      toast.error("Please connect your wallet before registering!");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/register", formData);
      if (res.status === 200) {
        toast.success(res.data.message || "User registered successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          walletAddress: "",
          role: "",
        });
      }
    } catch (err) {
      console.error("Register Error:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Something went wrong during registration!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-slate-100 px-4">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-400 to-indigo-500 text-transparent bg-clip-text">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm mb-2 text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-100 placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-2 text-slate-300">Email Address</label>
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
            <label className="block text-sm mb-2 text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a secure password"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-100 placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          {/* Wallet Address */}
          <div>
            <label className="block text-sm mb-2 text-slate-300">Wallet Address</label>
            <div className="relative flex">
              <Wallet className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                placeholder="Connect your wallet..."
                className="w-full pl-10 pr-28 py-2 bg-slate-900/50 border border-slate-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-100 placeholder:text-slate-500"
                readOnly
              />
              <button
                type="button"
                onClick={connectWallet}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-3 py-2 text-sm font-semibold rounded-r-lg transition"
              >
                Connect
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm mb-2 text-slate-300">Select Role</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-100"
                required
              >
                <option value="">-- Select Role --</option>
                <option value="freelancer">Freelancer</option>
                <option value="client">Client</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-indigo-500 text-slate-900 font-semibold shadow-md hover:brightness-105 transition disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} /> Registering...
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-4">
          Already have an account?{" "}
          <a href="/" className="text-emerald-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}