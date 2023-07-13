import express from "express";
import {
  registerUser,
  authenticate,
  confirm,
  forgotPassword,
  checkToken,
  newPassword,
  profile
} from "../controllers/userController.js";

import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();
// Register - Auth - Confirm-User
router.post("/", registerUser); //Create a new user
router.post("/login", authenticate); //Auth an user
router.get("/confirm/:token", confirm); // : los dos puntos xara routing dinamico
router.post("/forgot-password", forgotPassword);

// FORM1 Cuando son las mismas rutas
// router.get('/forgot-password/:token', checkToken)
// router.post('/forgot-password/:token', newPassword)

// FORM2 Cuando son las mismas rutas MAS LIMPIO
router.route("/forgot-password/:token").get(checkToken).post(newPassword);

router.get("/profile", checkAuth, profile)

export default router;
