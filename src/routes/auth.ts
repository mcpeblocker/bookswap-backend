import express from "express";
import { upload } from "../middlewares/upload";
import { uploadToS3 } from "../services/s3.service";
import { createFile } from "../services/files.service";
import {
  createBoardingUser,
  getUserByEmail,
  boardUser,
  modifyUser,
} from "../services/users.service";
import schemas from "../schemas";
import { generateToken } from "../services/jwt.service";
import { responser, validator } from "../utils/requests";
import { AuthBoardDto, AuthLoginDto, AuthModifyDto } from "../dto";
import { ErrorCode } from "../enums/ErrorCode.enum";
import { auth } from "../middlewares/auth";
import { AuthRequest } from "../interfaces/AuthRequest.interface";

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
    if (!file) {
      return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
    }
    const user = await boardUser(req.body.userId, userData.email, {
      ...userData,
      avatar: file._id,
    });
    if (!user) {
      return res.status(400).json(responser.error([ErrorCode.SERVER_ERROR]));
    }
    const token = generateToken({
      userId: user._id,
    });
    return res.status(200).json(responser.success({ token }));
  }
);

router.patch(
  "/modify",
  auth,
  upload.single("avatar"),
  validator(schemas.auth.modify),
  async (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
    }
    let userData = req.body as AuthModifyDto;
    if (req.body.preferredGenres) {
      userData.preferredGenres = req.body.preferredGenres.split(",");
    }
    // Validate request file
    let avatar;
    if (req.file) {
      const filename = await uploadToS3(req.file.originalname, req.file.buffer);
      if (!filename) {
        return res
          .status(500)
          .send(responser.error([ErrorCode.FILE_UPLOAD_ERROR]));
      }
      const file = await createFile({
        filename,
      });
      console.log(file);
      if (!file) {
        return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
      }
      avatar = file._id;
    }
    const user = await modifyUser(req.userId, {
      ...userData,
      avatar,
    });
    if (!user) {
      return res.status(400).json(responser.error([ErrorCode.SERVER_ERROR]));
    }
    return res.status(200).json(responser.success({ userId: user._id }));
  }
);

export default router;
