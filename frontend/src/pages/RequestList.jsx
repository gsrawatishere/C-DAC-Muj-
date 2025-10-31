import React, { useEffect, useState } from "react";
import RequestCard from "../components/RequestCard";
import axiosInstance from "../api/axiosInstance";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const RequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/job/allrequests");
      if (res.data?.success) {
        setRequests(res.data.requests || []);
      } else {
        setError(res.data?.message || "Failed to load requests");
      }
    } catch (err) {
      console.error("❌ Error fetching requests:", err);
      setError("Something went wrong while fetching requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId,freelancerId) =>{
    try {

    const freeze = await axiosInstance.post('job/freeze',{
        projectId : jobId
    })

     if(freeze.status !== 200){
      return toast.error("Failed to freeze fund");
     }


       const response = await axiosInstance.post('job/approvejob',{
          jobId,
          freelancerId
       })
       if(response.status == 200){
        toast.success(response.data.message);
       }
    } catch (error) {
       console.error("Login Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong on handleapprove!";
      toast.error(errorMsg);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#020617" }}
      >
        <Loader2 className="animate-spin text-emerald-400" size={36} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex justify-center items-center h-screen text-red-400 text-lg font-medium"
        style={{ backgroundColor: "#020617" }}
      >
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div
        className="flex justify-center items-center h-screen text-gray-400 text-lg"
        style={{ backgroundColor: "#020617" }}
      >
        No job requests found.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ backgroundColor: "#020617" }}
    >
      <h2 className="text-2xl font-bold text-center text-emerald-400 mb-8">
        Job Requests
      </h2>
      <div className="max-w-2xl mx-auto space-y-5">
        {requests.map((req) => (
          <RequestCard key={req.id} request={req} onApprove={handleApprove} />
        ))}
      </div>
    </div>
  );
};

export default RequestsList;