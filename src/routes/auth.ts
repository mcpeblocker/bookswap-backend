import express from "express";
import { upload } from "../middlewares/upload";
import { uploadToS3 } from "../services/s3.service";
import { createFile } from "../services/files.service";
import {
  createBoardingUser,
  getUserByEmail,
  boardUser,
} from "../services/users.service";
import {
  validateLogin,
  validateBoardedUser,
} from "../validators/auth.validator";
import { generateToken } from "../services/jwt.service";

const router = express.Router();

router.post("/login", async (req, res) => {
  // Validate request data
  const loginData = {
    email: req.body.email,
    token: req.body.token,
  };
  const validationResult = await validateLogin(loginData);
  if (!validationResult.success) {
    return res
      .status(400)
      .json({ message: validationResult.issues[0].message });
  }
  // Verify google auth credentials
  // TODO: Implement Google auth verification

  // Check if user with email exists
  const user = await getUserByEmail(loginData.email);
  if (!user) {
    // create user
    const newUser = await createBoardingUser(loginData.email);
    return res.status(201).json({
      data: {
        userId: newUser._id,
      },
    });
  }
  if (user.onboarding) {
    return res.status(201).json({
      data: {
        userId: user._id,
      },
    });
  }
  // generate jwt token
  const token = generateToken({
    userId: user._id,
  });
  return res.status(200).json({
    data: {
      userId: user._id,
      token,
    },
  });
});

router.post("/board", upload.single("avatar"), async (req, res) => {
  // Validate request data
  if (!req.file) {
    return res.status(400).send({
      message: "No file uploaded",
    });
  }
  const userData = {
    userId: req.body.userId,
    email: req.body.email,
    nickname: req.body.nickname,
    preferredGenres: req.body.preferredGenres.split(","),
  };
  const validationResult = await validateBoardedUser(userData);
  if (!validationResult.success) {
    return res
      .status(400)
      .json({ message: validationResult.issues[0].message });
  }
  const filename = await uploadToS3(req.file.originalname, req.file.buffer);
  if (!filename) {
    return res.status(500).send({
      message: "Error uploading file",
    });
  }
  const file = await createFile({
    filename,
  });
  const user = await boardUser(req.body.userId, userData.email, {
    ...userData,
    avatar: file._id,
  });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  const token = generateToken({
    userId: user._id,
  });
  return res.status(200).json({
    data: {
      userId: user._id,
      token,
    },
  });
});

export default router;
