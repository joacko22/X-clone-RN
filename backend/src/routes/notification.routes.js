import express from "express"
import { protectRoute } from "../middleware/auth.middleware"
import { getNotifications, deleteNotifications } from "../controllers/notification.controller"
const router = express.Router()

router.get("/", protectRoute, getNotifications)
router.delete("/notificationId", protectRoute, deleteNotifications)
export default router