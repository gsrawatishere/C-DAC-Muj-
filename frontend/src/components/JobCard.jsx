import React from "react";
import { Briefcase, Calendar, DollarSign, Clock, Coins } from "lucide-react";

// 🕒 Helper: format date
const formatDate = (dateString) => {
  if (!dateString) return "No deadline";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

// 🕐 Helper: relative time (like "3 days ago")
const timeAgo = (timestamp) => {
  if (!timestamp) return "N/A";
  const now = new Date();
  const diff = (now - new Date(timestamp)) / 1000; // in seconds

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
};

const JobCard = ({ job }) => {
  if (!job) return null;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Briefcase className="text-emerald-400" size={22} />
          <h2 className="text-lg font-semibold text-slate-100">{job.title}</h2>
        </div>

        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            job.status === "OPEN"
              ? "bg-emerald-500/20 text-emerald-400"
              : job.status === "IN_PROGRESS"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {job.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
        {job.description || "No description provided."}
      </p>

      {/* Job Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-emerald-400" />
          <span className="text-slate-300">
            {job.amount} {job.Fund || "ETH"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-400" />
          <span className="text-slate-300">{formatDate(job.deadline)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Coins size={16} className="text-purple-400" />
          <span className="text-slate-300">
            Client ID: {job.clientId?.slice(0, 6)}...
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} className="text-yellow-400" />
          <span className="text-slate-300">{timeAgo(job.createdAt)}</span>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end mt-5">
        {/* <button className="bg-gradient-to-r from-emerald-400 to-indigo-500 text-slate-900 font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition-all">
          View Requests
        </button> */}
      </div>
    </div>
  );
};

export default JobCard;