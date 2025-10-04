import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//access token and refresh token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken(); //from model method
    const refreshToken = await user.generateRefreshToken(); //from model method

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //save refresh token in db against user

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Could not generate access and refresh token, please try again"
    );
  }
};

//register
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validatation - not empty
  // check user already exists: username , email
  // check for images, check for avater
  // upload them to cloudinary
  // create user object and save to db
  // remove password and refresh token from response
  // check for user creation (created or not)
  // return response
  const { userName, email, fullName, password } = req.body;

  // if(fullName === ""){
  //     throw new ApiError(400, "Full name is required")
  // }

  if (
    //returns true or false
    [userName, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ $or: [{ userName }, { email }] });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  console.log(avatarLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Could not upload avatar, please try again");
  }

  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    fullName,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -__v"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "User is not created while registering the user, please try again"
    );
  }

  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

//login
const loginUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validatation - not empty(email, username)
  // check user exists: username , email
  // check for password match
  // generate access token and refresh token
  // save refresh token in db against user
  // return response with access token and refresh token in http only cookie -> send cookie

  const { userName, email, password } = req.body;

  if (!userName && !email) {
    throw new ApiError(400, "Username and email are required");
  }

  //Alternative way: using or condition(only one is required)
  // if(!(userName || email)){
  //   throw new ApiError(400, "Username or email are required")
  // }

  const user = await User.findOne({ $or: [{ userName: userName }, { email }] });

  if (!user) {
    throw new ApiError(404, "User not found with this username or email");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  //find the user again with access and refresh token
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -__v"
  );

  const options = {
    // cookie options
    httpOnly: true, // not accessible via JS/frontend
    secure: true, // only sent over https
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged in successfully"
      )
    );
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, //remove refresh token from db
      },
    },
    {
      new: true, //return the updated document
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
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

//generate new access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken; //incoming refresh token from cookie or body which is sent from frontend or postman o

    if (!incomingRefreshToken) {
      throw new ApiError(400, "Unauthorized request - missing refresh token");
    }

    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "New access token generated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Unauthorized request - failed to refresh access token"
    );
  }
});

//update/change password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  //take old password and new password from front end
  //validate them ->> not empty
  //determine user using req.user(auth middleware)
  //validate old password with user password
  //is valid user
  //change/update password
  //save to the database

  const { oldPassword, newPassword } = req.body;
  // const {oldPassword, newPassword, confirmPassword} = req.body;
  // if(newPassword !== confirmPassword){
  //   throw new ApiError(
  //     400,
  //     "New Password and Confirm Password do not match"
  //   )
  // }

  if (!oldPassword || !newPassword) {
    throw new ApiError(404, "password and new password are invalid/empty");
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password Changed successfully"));
});

//determine/get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      req.user, //( from auth middleware)
      "Current user fetched successfully"
    )
  );
});

//update account details
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName && !email) {
    throw new ApiError(
      400,
      "At least one field (fullName or email) is required"
    );
  }

  if (email) {
    const existingUser = await User.findOne({ email });
    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      throw new ApiError(409, "Email is already in use");
    }
  }

  const updateFields = {};
  if (fullName) {
    updateFields.fullName = fullName;
  }
  if (email) {
    updateFields.email = email;
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: updateFields,
    },
    {
      new: true, //return new updated document
    }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

//for file updation like image, audio, video->> use different controller(for production level app)
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath); //cloudinary returns an oject with url of the file, then we assing it to  the avatar

  console.log(avatar);
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar on cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath); //cloudinary returns an oject with url of the file, then we assing it to  the cover image

  console.log(coverImage);
  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading coover image on cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User cover image updated successfully"));
});

//get user channel profile
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  console.log(userName);

  if (!userName) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        //determine the channel(user)
        userName: userName?.toLowerCase(),
      },
    },
    {
      $lookup: {
        //find subscribers(return array of obj)
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        //find
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo", //following(subscribe by myself)
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] }, //req.user comes from auth middleware
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        userName: 1,
        email: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

//WatchHistory Controller
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos", // join with videos collection
        localField: "watchHistory", // user.watchHistory contains videoIds
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users", // join videos.owner with users collection
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    userName: 1,
                    avatar: 1,
                  },
                },
                {
                  $addFields: {
                    owner: {
                      $first: "$owner", // simplify owner array to single object
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history data fetch successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
