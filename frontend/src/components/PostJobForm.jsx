import React, { useState } from "react";
import { Briefcase, Calendar, DollarSign, FileText, Loader2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function PostJobForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
    Fund: "",
   
  });

  const [loading, setLoading] = useState(false);

  // 🧩 Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 📤 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();


    setLoading(true);
    try {
        console.log(formData);

      const res = await axiosInstance.post("/job/addjob", {
        ...formData,
      });
      if (res.status == 200) {
        toast.success("Job posted successfully!");
        setFormData({
          title: "",
          description: "",
          amount: "",
          deadline: "",
          Fund: "",
          txnHash: "",
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Something went wrong during Login!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-4 text-slate-100">
      <div className="w-full max-w-lg bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-400 to-indigo-500 text-transparent bg-clip-text">
          Post a New Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Job Title */}
          <div>
            <label className="block text-sm mb-2 text-slate-300">Job Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Website Development"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-2 text-slate-300">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the project requirements..."
                rows="4"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                required
              ></textarea>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm mb-2 text-slate-300">Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.5"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm mb-2 text-slate-300">Deadline</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* Currency Dropdown */}
          <div>
            <label className="block text-sm mb-2 text-slate-300">Select Currency</label>
            <select
              name="Fund"
              value={formData.Fund}
              onChange={handleChange}
              className="w-full pl-4 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            >
              <option value="">-- Select Currency --</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="MATIC">Polygon (MATIC)</option>
              <option value="BNB">Binance Coin (BNB)</option>
            </select>
          </div>

          {/* Transaction Hash (optional, shown only if Fund selected) */}
          {/* {formData.Fund && (
            <div>
              <label className="block text-sm mb-2 text-slate-300">
                Transaction Hash (optional)
              </label>
              <input
                type="text"
                name="txnHash"
                value={formData.txnHash}
                onChange={handleChange}
                placeholder="0xabc123..."
                className="w-full pl-4 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          )} */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-indigo-500 text-slate-900 font-semibold shadow-md hover:brightness-105 transition disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} /> Posting...
              </div>
            ) : (
              "Post Job"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}