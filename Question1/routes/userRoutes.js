import express from "express";
import { getTopUsers } from "../controllers/userControllers.js";

const router = express.Router(); 

router.get('/', getTopUsers); 

export default router;
