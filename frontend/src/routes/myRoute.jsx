
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RegisterForm from "../pages/RegisterForm";
import Login from "../pages/Login";
import ClientDashboard from "../pages/ClientDashboard";
import PostJobForm from "../components/PostJobForm";
import MyJobs from "../pages/MyJobs";
import FreelancerDashboard from "../pages/FreelancerDashboard";
import RequestsList from "../pages/RequestList";

const myRoute = createBrowserRouter(
    createRoutesFromElements(
     <>
      <Route path="/register" element={<RegisterForm/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/client" element={<ClientDashboard/>} />
      <Route path="/postjob" element={<PostJobForm/>} />
      <Route path="/myjobs" element={<MyJobs/>} />
      <Route path="/freelancer" element={<FreelancerDashboard/>}/>
      <Route path="/requests" element={<RequestsList/>}/>
     </>
    )
)

export default myRoute;