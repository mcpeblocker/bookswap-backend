import express from "express";
import { upload } from "../middlewares/upload";
import { uploadToS3 } from "../services/s3.service";
import { createFile } from "../services/files.service";
import {
  createBoardingUser,
  getUserByEmail,
  boardUser,
  modifyUser,
  getUserById,
} from "../services/users.service";
import schemas from "../schemas";
import { generateToken } from "../services/jwt.service";
import { responser, validator } from "../utils/requests";
import { AuthBoardDto, AuthLoginDto, AuthModifyDto } from "../dto";
import { ErrorCode } from "../enums/ErrorCode.enum";
import { auth } from "../middlewares/auth";
import { AuthRequest } from "../interfaces/AuthRequest.interface";
import { verifyGoogleToken } from "../services/google-auth.service";

const router = express.Router();

router.post("/login", validator(schemas.auth.login), async (req, res) => {
  const loginData = req.body as AuthLoginDto;
  // Verify google auth credentials
  const result = await verifyGoogleToken(loginData.token);
  if (!result) {
    return res.status(400).json(responser.error([ErrorCode.INVALID_TOKEN]));
  }
  // Check if user with email exists
  const user = await getUserByEmail(result.email);
  if (!user) {
    // create user
    const newUser = await createBoardingUser(result.email);
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
  return res.status(200).json(
    responser.success({
      boarding: false,
      token,
      user: {
        userId: user._id,
        nickname: user.nickname,
        avatar: user.avatar,
      },
    })
  );
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
    let filename;
    if (req.file) {
      filename = await uploadToS3(req.file.originalname, req.file.buffer);
      if (!filename) {
        return res
          .status(500)
          .send(responser.error([ErrorCode.FILE_UPLOAD_ERROR]));
      }
    } else {
      if (!req.body.avatar) {
        return res.status(400).send(responser.error([ErrorCode.FILE_MISSING]));
      }
      filename = req.body.avatar;
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
    return res.status(200).json(
      responser.success({
        token,
        user: {
          userId: user._id,
          nickname: userData.nickname,
          avatar: filename,
        },
      })
    );
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

router.get("/me", auth, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  const user = await getUserById(req.userId);
  if (!user) {
    return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
  }
  return res.status(200).send(responser.success(user));
});

export default router;
