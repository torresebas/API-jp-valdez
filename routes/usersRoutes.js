import express from "express";
const router = express.Router();
import {
  registerUser,
  authenticate,
  confirm,
  forgotPassword,
  checkToken,
  newPassword
} from "../controllers/userController.js";

// Register - Auth - Confirm-User
router.post("/", registerUser); //Create a new user
router.post("/login", authenticate); //Auth an user
router.get("/confirm/:token", confirm);
router.post("/forgot-password", forgotPassword);

// FORM1 Cuando son las mismas rutas
// router.get('/forgot-password/:token', checkToken)
// router.post('/forgot-password/:token', newPassword)


// FORM2 Cuando son las mismas rutas MAS LIMPIO
router.route('/forgot-password/:token').get(checkToken).post(newPassword)

export default router;
