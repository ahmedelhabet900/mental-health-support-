import { Router } from "express";

import * as moodservice from "./Mood.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { submitMoodSchema, historySchema } from "./Mood.Schema.js";

const moodRouter = Router();

moodRouter.use(authMiddleware);

moodRouter.post("/", validate(submitMoodSchema), moodservice.submitMood);
moodRouter.get("/today", moodservice.getTodayMood);
moodRouter.get("/history", validate(historySchema), moodservice.getMoodHistory);

export default moodRouter;
