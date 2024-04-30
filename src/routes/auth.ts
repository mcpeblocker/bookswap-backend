import express from "express";
import { upload } from "../middlewares/upload";
import { uploadToS3 } from "../services/s3.service";
import { createFile } from "../services/files.service";
import {
  createBoardingUser,
  getUserByEmail,
  boardUser,
} from "../services/users.service";
import schemas from "../schemas";
import { generateToken } from "../services/jwt.service";
import { responser, validator } from "../utils/requests";
import { AuthBoardDto, AuthLoginDto } from "../dto";
import { ErrorCode } from "../enums/ErrorCode.enum";

const router = express.Router();

router.post("/login", validator(schemas.auth.login), async (req, res) => {
  const loginData = req.body as AuthLoginDto;
  // Verify google auth credentials
  // TODO: Implement Google auth verification

  // Check if user with email exists
  const user = await getUserByEmail(loginData.email);
  if (!user) {
    // create user
    const newUser = await createBoardingUser(loginData.email);
    if (!newUser) {
      return res.status(500).json(responser.error([ErrorCode.SERVER_ERROR]));
    }
    return res
      .status(201)
      .json(responser.success({ boarding: true, userId: newUser._id }));
  }
  if (user.onboarding) {
    return res
      .status(201)
      .json(responser.success({ boarding: true, userId: user._id }));
  }
  // generate jwt token
  const token = generateToken({
    userId: user._id,
  });
  return res.status(200).json(responser.success({ boarding: false, token }));
});

router.post(
  "/board",
  upload.single("avatar"),
  validator(schemas.auth.board),
  async (req, res) => {
    let userData = {
      ...req.body,
      preferredGenres: req.body.preferredGenres.split(","),
    } as AuthBoardDto;
    // Validate request file
    if (!req.file) {
      return res.status(400).send(responser.error([ErrorCode.FILE_MISSING]));
    }
    const filename = await uploadToS3(req.file.originalname, req.file.buffer);
    if (!filename) {
      return res
        .status(500)
        .send(responser.error([ErrorCode.FILE_UPLOAD_ERROR]));
    }
    const file = await createFile({
      filename,
    });
    const user = await boardUser(req.body.userId, userData.email, {
      ...userData,
      avatar: file._id,
    });
    if (!user) {
      return res.status(400).json(responser.error([ErrorCode.USER_NOT_FOUND]));
    }
    const token = generateToken({
      userId: user._id,
    });
    return res.status(200).json(responser.success({ token }));
  }
);

export default router;
