import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authroute from "./routes/auth.route.js"
import jobroute from "./routes/job.route.js"
import cookieParser from "cookie-parser";
import {ethers} from "ethers"

dotenv.config();
 const app = express();
 app.use(cookieParser());
 
app.use(express.json()); // parses application/json body
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true, 
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions)); 

app.use("/api/v1/auth",authroute);
app.use("/api/v1/job",jobroute);

app.get("/ping",(req,res)=>{
  res.status(200).send("Server is awake");
})

const PORT = process.env.PORT;

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
})

// ether code
const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const privateKey = process.env.PLATFORM_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);
const abi = [
  "function setData(uint256 _data) public",
  "function getData() public view returns (uint256)"
];
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new ethers.Contract(contractAddress, abi, wallet);

export default contract;
