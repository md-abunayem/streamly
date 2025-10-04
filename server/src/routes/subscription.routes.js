import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    toggleSubscription, 
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js";



const router = Router();    // Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route("/channel/:channelId/subscribers").get(getUserChannelSubscribers);
router.route("/user/:subscriberId/channels").get(getSubscribedChannels);

router.route("/channel/:channelId/toggle").post(toggleSubscription);

export default router;