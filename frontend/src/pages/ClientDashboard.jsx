import React from 'react'
import Navbar from '../components/Navbar'
import { Briefcase, PlusCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";



const ClientDashboard = () => {
  return (
    <div>
        <Navbar/>   
        <Dashboard/>
        
     </div>
  )
}

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Add Job",
      desc: "Post a new freelance job and fund it securely via escrow.",
      icon: <PlusCircle className="text-emerald-500" size={28} />,
      action: () => navigate("/postjob"),
      btn: "Add Job",
    },
    {
      title: "My Jobs",
      desc: "View all jobs you’ve created, along with their status and milestones.",
      icon: <Briefcase className="text-blue-400" size={28} />,
      action: () => navigate("/myjobs"),
      btn: "View Jobs",
    },
    {
      title: "Job Requests",
      desc: "Check all freelancer requests for your jobs and approve one to start work.",
      icon: <Users className="text-purple-400" size={28} />,
      action: () => navigate("/requests"),
      btn: "View Requests",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10 pt-25">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-400 mb-8 text-center">
          Client Dashboard
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {card.icon}
                  <h2 className="text-xl font-semibold">{card.title}</h2>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
              </div>

              <button
                onClick={card.action}
                className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium transition-all"
              >
                {card.btn}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ClientDashboard