import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    deleteVideo, 
    getAllVideos, 
    getVideoById, 
    publishAVideo, 
    togglePublishStatus, 
    updateVideo 
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllVideos);
router.get("/:videoId", getVideoById);

// Protected routes
router.post(
    "/upload",
    verifyJWT,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishAVideo
);

router.patch(
    "/:videoId",
    verifyJWT,
    upload.single("thumbnail"),
    updateVideo
);

router.delete("/:videoId", verifyJWT, deleteVideo);

router.patch("/toggle/publish/:videoId", verifyJWT, togglePublishStatus);

export default router;
