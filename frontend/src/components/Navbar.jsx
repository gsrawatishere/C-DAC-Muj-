import React, { useState } from "react";
import { Wallet, LogIn, Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.get("/auth/logout");
      if (response.status === 200) {
        toast.success(response.data.msg || "Logged out successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("❌ Logout failed:", error);
      const errorMsg = error.response?.data?.msg || "Failed to logout";
      toast.error(errorMsg);
    }
  };

  return (
    <nav className="w-full bg-slate-900/70 backdrop-blur-xl border-b border-slate-800 text-slate-100 fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Wallet className="text-emerald-400" size={22} />
          <h1 className="text-xl font-semibold tracking-wide text-emerald-400">
            BlockTrust
          </h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/" className="hover:text-emerald-400 transition-colors">
            Home
          </a>
          <a href="/about" className="hover:text-emerald-400 transition-colors">
            About
          </a>
          <a
            href="/contact"
            className="hover:text-emerald-400 transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Logout Button (Desktop) */}
        <div className="hidden md:flex">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all"
          >
            <LogIn size={16} />
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-emerald-400 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900/95 border-t border-slate-800 px-6 py-4 space-y-4">
          <a
            href="/"
            className="block text-slate-300 hover:text-emerald-400 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="/about"
            className="block text-slate-300 hover:text-emerald-400 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>
          <a
            href="/contact"
            className="block text-slate-300 hover:text-emerald-400 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>

          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all"
          >
            <LogIn size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;