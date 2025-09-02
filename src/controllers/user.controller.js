import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    // user.accessToken = accessToken
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token."
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Name, email and password are required");
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
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong when registering the user");
  }

  // Auto-login after registration
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          refreshToken,
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

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUserController = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "user logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req?.cookies?.refreshToken || req?.body?.refreshToken;

    console.log(incomingRefreshToken);

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired and used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Acess token refresh successfull"
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid Refresh Token");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body || {};
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
    },
    { new: true, select: "-password -refreshToken" }
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
    .select("-password -refreshToken")
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
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
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
  });

  const createdAdmin = await User.findById(admin._id).select(
    "-password -refreshToken"
  );

  // Auto-login after admin creation
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    admin._id
  );
  const loggedAdmin = await User.findById(admin._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedAdmin,
          accessToken,
          refreshToken,
        },
        "Admin created and logged in successfully"
      )
    );
});

export {
  registerUser,
  loginUserController,
  logoutUserController,
  refreshAccessToken,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  createAdmin,
};
