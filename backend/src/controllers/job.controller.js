import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


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
    });
    
    res.status(200).json({ success: true, requests });
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

    return res.status(201).json({
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