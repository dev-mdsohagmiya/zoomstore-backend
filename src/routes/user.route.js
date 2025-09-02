import { Router } from "express";
import {
  loginUserController,
  logoutUserController,
  refreshAccessToken,
  registerUser,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  createAdmin,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  verifyAdmin,
  verifySuperAdmin,
} from "../middlewares/admin.middleware.js";

const userRouter = Router();

// Public routes
userRouter.route("/auth/register").post(
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.route("/auth/login").post(loginUserController);
userRouter.route("/auth/refresh-token").post(refreshAccessToken);

// Protected routes
userRouter.route("/auth/logout").post(verifyJWT, logoutUserController);
userRouter.route("/users/profile").put(
  verifyJWT,
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  updateUserProfile
);

// Admin routes
userRouter.route("/users").get(verifyJWT, verifyAdmin, getAllUsers);
userRouter.route("/users/:id").delete(verifyJWT, verifyAdmin, deleteUser);

// Super admin routes
userRouter.route("/admin/create").post(
  verifyJWT,
  verifySuperAdmin,
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  createAdmin
);

export default userRouter;
