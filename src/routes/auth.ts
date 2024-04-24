import express from "express";
import { upload } from "../middlewares/upload";
import { uploadToS3 } from "../services/s3.service";
import { Readable } from "stream";
import { createFile } from "../services/files.service";
import { createUser } from "../services/users.service";
import { validateUser } from "../validators/user.validator";
import { validateLogin } from "../validators/login.validator";

const router = express.Router();

router.post("/", upload.single("avatar"), async (req, res) => {
  // Validate request data
  if (!req.file) {
    return res.status(400).send({
      message: "No file uploaded",
    });
  }
  const userData = {
    nickname: req.body.nickname,
    email: req.body.email,
    preferredGenres: req.body.preferredGenres.split(","),
  };
  const validationResult = await validateUser(userData);
  if (!validationResult.success) {
    return res
      .status(400)
      .json({ message: validationResult.issues[0].message });
  }
  // Upload file to S3
  const filename = await uploadToS3(req.file.originalname, req.file.buffer);
  if (!filename) {
    return res.status(500).send({
      message: "Error uploading file",
    });
  }
  // Create file and user
  const file = await createFile({
    filename,
  });
  const user = await createUser({
    ...validationResult.data,
    avatar: file._id,
  });
  return res.status(201).json({
    data: user.toJSON(),
  });
});

router.post("/login", async (req, res) => {
  // Validate request body
  const loginData = {
    email: req.body.email,
    idToken: req.body.idToken,
  };
  const validationResult = await validateLogin(loginData);
  if (!validationResult.success) {
    return res
      .status(400)
      .json({ message: validationResult.issues[0].message });
  }
  // Check idToken
  

  // Check if user with email exists
});

export default router;
