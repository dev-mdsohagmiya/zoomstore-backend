import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    return { accessToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating access token."
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, address } = req.body || {};

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Name, email and password are required");
  }

  // Prevent super admin role assignment through registration
  if (role === "superadmin") {
    throw new ApiError(
      403,
      "Super admin role cannot be assigned through registration. Super admin can only be created from environment variables."
    );
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  let photo = "";
  if (req?.files?.photo && req.files.photo.length > 0) {
    const photoLocalPath = req.files.photo[0].path;
    const uploadedPhoto = await uploadOnCloudinary(photoLocalPath);
    if (uploadedPhoto) {
      photo = uploadedPhoto.url;
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    photo,
    role: role || "user",
    address: address || {},
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong when registering the user");
  }

  // Auto-login after registration
  const { accessToken } = await generateAccessToken(user._id);
  const loggedUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
        },
        "User registered and logged in successfully"
      )
    );
});

const loginUserController = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken } = await generateAccessToken(user._id);
  const loggedUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  // Customize login message based on user role
  let loginMessage = "User logged in successfully";
  if (user.role === "admin") {
    loginMessage = "Admin logged in successfully";
  } else if (user.role === "superadmin") {
    loginMessage = "Super Admin logged in successfully";
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          role: user.role,
        },
        loginMessage
      )
    );
});

const logoutUserController = asyncHandler(async (req, res, next) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "user logged out"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, address } = req.body || {};
  const userId = req.user._id;

  if (!name || !email) {
    throw new ApiError(400, "Name and email are required");
  }

  let photo = req.user.photo;
  if (req?.files?.photo && req.files.photo.length > 0) {
    const photoLocalPath = req.files.photo[0].path;
    const uploadedPhoto = await uploadOnCloudinary(photoLocalPath);
    if (uploadedPhoto) {
      photo = uploadedPhoto.url;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      name,
      email,
      photo,
      ...(address && { address }),
    },
    { new: true, select: "-password" }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find({})
    .select("-password")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalUsers = await User.countDocuments();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          page,
          limit,
          total: totalUsers,
          pages: Math.ceil(totalUsers / limit),
        },
      },
      "Users retrieved successfully"
    )
  );
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;

  // Super admin can delete anyone, admin can delete users but not other admins
  if (currentUser.role === "admin") {
    const targetUser = await User.findById(id);
    if (targetUser && targetUser.role === "admin") {
      throw new ApiError(403, "Admin cannot delete other admins");
    }
  }

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role, address } = req.body || {};

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  // Prevent super admin role assignment through admin creation
  if (role === "superadmin") {
    throw new ApiError(
      403,
      "Super admin role cannot be assigned through admin creation. Super admin can only be created from environment variables."
    );
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  let photo = "";
  if (req?.files?.photo && req.files.photo.length > 0) {
    const photoLocalPath = req.files.photo[0].path;
    const uploadedPhoto = await uploadOnCloudinary(photoLocalPath);
    if (uploadedPhoto) {
      photo = uploadedPhoto.url;
    }
  }

  const admin = await User.create({
    name,
    email,
    password,
    photo,
    role: "admin",
    address: address || {},
  });

  const createdAdmin = await User.findById(admin._id).select("-password");

  // Auto-login after admin creation
  const { accessToken } = await generateAccessToken(admin._id);
  const loggedAdmin = await User.findById(admin._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedAdmin,
          accessToken,
        },
        "Admin created and logged in successfully"
      )
    );
});

const createSuperAdminFromEnv = asyncHandler(async (req, res) => {
  const { email, password } = {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
  };

  if (!email || !password) {
    throw new ApiError(
      400,
      "Super admin credentials not found in environment variables. Please set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in your .env file."
    );
  }

  // Additional validation to ensure this is the only way to create super admin
  if (
    req.body &&
    (req.body.role === "superadmin" || req.body.email || req.body.password)
  ) {
    throw new ApiError(
      403,
      "Super admin can only be created from environment variables. Do not provide role, email, or password in request body."
    );
  }

  // Check if super admin already exists
  const existingSuperAdmin = await User.findOne({ email });

  if (existingSuperAdmin) {
    if (existingSuperAdmin.role !== "superadmin") {
      existingSuperAdmin.role = "superadmin";
      await existingSuperAdmin.save();
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, existingSuperAdmin, "Super admin already exists")
      );
  }

  // Create super admin user
  const superAdmin = await User.create({
    name: "Super Admin",
    email,
    password,
    role: "superadmin",
  });

  const createdSuperAdmin = await User.findById(superAdmin._id).select(
    "-password"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdSuperAdmin,
        "Super admin created successfully"
      )
    );
});

export {
  registerUser,
  loginUserController,
  logoutUserController,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  createAdmin,
  createSuperAdminFromEnv,
};
