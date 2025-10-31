import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import contract from "../index.js";

export const createJob = async (req, res) => {
  try {
    const { title, description, amount, deadline, Fund  } = req.body;
    const clientId = req.user.id;
    console.log(clientId)
    const job = await prisma.job.create({
      data: {
        title,
        description,
        amount: parseFloat(amount),
        deadline: deadline ? new Date(deadline) : null,
        clientId,
        Fund 
      },
    });

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ success: false, message: "Failed to create job" });
  }
};

// get my jobs
export const myJobs = async (req, res) => {
  try {
     const clientId = req.user.id;


    const jobs = await prisma.job.findMany({
      where : {clientId},
    });

    res.status(200).json({jobs})
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};

// get all jobs

export const allJobs = async (req, res) => {
  try {
     
    const jobs = await prisma.job.findMany();

    res.status(200).json({jobs})
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};

//all requests
export const getAllRequests = async (req, res) => {
  try {
    const clientId = req.user.id;

    const requests = await prisma.request.findMany({
      where: {
        job: {
          clientId: clientId,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          select: {
            title: true,  // job name
          },
        },
        freelancer: {
          select: {
            name: true,   // freelancer name
          },
        },
      },
    });

    // Optionally map response to flatten job and freelancer info
    const formattedRequests = requests.map((r) => ({
      id: r.id,
      message: r.message,
      createdAt: r.createdAt,
      status: r.status,
      freelancerId: r.freelancerId,
      freelancerName: r.freelancer?.name || "Unknown",
      jobId: r.jobId,
      jobTitle: r.job?.title || "Untitled",
    }));

    res.status(200).json({ success: true, requests: formattedRequests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ success: false, message: "Failed to fetch requests" });
  }
};

// Get all requests for a specific job
export const getRequestsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const requests = await prisma.request.findMany({
      where: { jobId },
      include: {
        freelancer: {
          select: { id: true, name: true, email: true, walletAddress: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching job requests:", error);
    res.status(500).json({ success: false, message: "Failed to fetch job requests" });
  }
};

//create job request

export const createRequest = async (req, res) => {
  try {
    const { message, jobId } = req.body;
    const freelancerId = req.user.id; // assuming user is authenticated

    // 1. Ensure job exists
    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }

    // 2. Prevent clients from applying to their own jobs
    if (job.clientId === freelancerId) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot request your own job" });
    }

    // 3. Check for duplicate requests
    const existingRequest = await prisma.request.findFirst({
      where: { jobId, freelancerId },
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You already sent a request for this job",
        });
    }

    // 4. Create the request
    const request = await prisma.request.create({
      data: { message, freelancerId, jobId },
    });

    return res.status(200).json({
      success: true,
      message: "Job request created successfully",
      request,
    });
  } catch (error) {
    console.error("Error creating job request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create job request",
    });
  }
};


//const approvejob

export const approveJob = async (req, res) => {
  try {
    const { freelancerId, jobId } = req.body;

    // Validate input
    if (!freelancerId || !jobId) {
      return res.status(400).json({ message: "freelancerId and jobId are required" });
    }

    // Check if job exists
    const existJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already assigned
    if (existJob.freelancerId) {
      return res.status(400).json({ message: "Freelancer already assigned to this job" });
    }

    // Assign freelancer
    await prisma.job.update({
      where: { id: jobId },
      data: { freelancerId, status: "ASSIGNED" }, // optional: update job status too
    });

    return res.status(200).json({
      success: true,
      message: "Job approved and assigned to freelancer successfully",
    });
  } catch (error) {
    console.error("Error in approveJob:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in approveJob",
      error: error.message,
    });
  }
};



// freeze funds

// 1️⃣ Freeze funds (client deposits escrow)
export const freezeFunds =  async (req, res) => {
  try {
    // const { projectId, freelancer, amount } = req.body;
    const {projectId} = req.body;

     const job = await prisma.job.findFirst({
      where: { id: projectId },
      include: {
        freelancer: { select: { walletAddress: true } },
        client: { select: { walletAddress: true } },
      },
    });

     if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (!job.freelancer) {
      return res.status(400).json({ success: false, message: "No freelancer assigned to this job" });
    }

     const freelancer = job.freelancer.walletAddress;
    const amount = job.amount.toString();

    // amount will be in ETH string form, e.g. "0.05"
    const tx = await contract.freezeFunds(projectId, freelancer, {
      value: ethers.parseEther(amount),
      gasLimit: 300000,
    });

    await tx.wait();
    res.status(200).json({
      success: true,
      message: "Funds frozen successfully",
      txHash: tx.hash,
    });
  } catch (err) {
    console.error("❌ FreezeFunds Error:", err);
    res.status(400).json({
      success: false,
      error: err.reason || err.message,
    });
  }
};
