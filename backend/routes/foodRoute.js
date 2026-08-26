import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const foodRouter = express.Router();

// Image Storage Engine

const storage= multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload= multer({storage:storage})

foodRouter.post("/add",upload.single("image"),authMiddleware,requireRole("admin"),addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",authMiddleware,requireRole("admin"),removeFood);

export default foodRouter;
