import express from "express";
const router = express.Router();
import {allJobs, createJob, createRequest, getAllRequests, getRequestsByJob, myJobs} from "../controllers/job.controller.js"
import { verifyUser } from "../middleware/verify.js";

router.post("/addjob",verifyUser,createJob);
router.get("/myjobs",verifyUser,myJobs);
router.get("/alljobs",verifyUser,allJobs);
router.get("/allrequests",verifyUser,getAllRequests);
router.get("/requestsbyjob",verifyUser,getRequestsByJob);
router.post("/putrequest/:jobId",verifyUser,createRequest);


export default router;