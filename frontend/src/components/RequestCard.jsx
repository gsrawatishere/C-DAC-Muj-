import React from "react";
import { Clock, User, Briefcase, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const RequestCard = ({ request, onApprove }) => {
  const handleApprove = () => {
    if (onApprove) onApprove(request.id);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-emerald-400/30 shadow-lg rounded-2xl p-6 mb-5 backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-emerald-400">
          Freelancer Request
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
            request.status === "PENDING"
              ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30"
              : request.status === "APPROVED"
              ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30"
              : "bg-rose-400/10 text-rose-400 border border-rose-400/30"
          }`}
        >
          {request.status}
        </span>
      </div>

      {/* Message */}
      <p className="text-slate-200 mb-4 italic">
        “{request.message || "No message provided"}”
      </p>

      {/* Details */}
      <div className="space-y-2 text-slate-400 text-sm">
        <div className="flex items-center gap-2">
          <User size={16} className="text-emerald-400" />
          <span>
            <strong>Freelancer:</strong>{" "}
            <span className="text-slate-300">{request.freelancerId}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Briefcase size={16} className="text-emerald-400" />
          <span>
            <strong>Job:</strong>{" "}
            <span className="text-slate-300">{request.jobId}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} className="text-emerald-400" />
          <span>
            {new Date(request.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
      </div>

      {/* Approve Button */}
      {request.status === "PENDING" && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleApprove}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-green-500 text-slate-900 font-semibold px-4 py-2 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            <CheckCircle size={18} />
            Approve
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default RequestCard;