import { Router } from "express";
import authController from "./auth.controller";

// /api/v1/auth
const router = Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

export const authRoute = router;