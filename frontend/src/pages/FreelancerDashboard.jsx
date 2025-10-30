import React, { useEffect, useState } from "react";
import JobCardF from "../components/JobCardF";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../components/Navbar"


export default function FreelancerDashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get("/job/alljobs");
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div>
        <Navbar/>
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10 pt-22">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-400 mb-8 text-center">
          All Jobs
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          {jobs.length > 0 ? (
            jobs.map((job) => <JobCardF key={job.id} job={job} />)
          ) : (
            <p className="text-slate-400 text-center col-span-full">
              No jobs posted yet.
            </p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}