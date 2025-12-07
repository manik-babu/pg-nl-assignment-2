import { Router } from "express";
import authController from "./auth.controller";

// /api/v1/auth
const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

export const authRoute = router;