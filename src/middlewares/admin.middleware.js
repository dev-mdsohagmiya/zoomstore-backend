import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      throw new ApiError(403, "Admin access required");
    }

    next();
  } catch (error) {
    throw new ApiError(403, error.message || "Admin access denied");
  }
});

export const verifySuperAdmin = asyncHandler(async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (req.user.role !== "superadmin") {
      throw new ApiError(403, "Super admin access required");
    }

    next();
  } catch (error) {
    throw new ApiError(403, error.message || "Super admin access denied");
  }
});
