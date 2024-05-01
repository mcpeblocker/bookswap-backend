import express from "express";
import { upload } from "../middlewares/upload";
import { uploadToS3 } from "../services/s3.service";
import { createFile } from "../services/files.service";
import schemas from "../schemas";
import { responser, validator } from "../utils/requests";
import { ErrorCode } from "../enums/ErrorCode.enum";
import { EditBookDto, UploadBookDto } from "../dto";
import { createBook, updateBook } from "../services/books.service";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/upload",
  upload.single("cover"),
  validator(schemas.books.upload),
  async (req, res) => {
    let exceptionsList = [];
    if (req.body.exceptions) {
      exceptionsList = req.body.exceptions.split(",");
    }
    const data = {
      ...req.body,
      exceptions: exceptionsList,
    } as UploadBookDto;
    // Validate request file
    if (!req.file) {
      return res.status(400).send(responser.error([ErrorCode.FILE_MISSING]));
    }
    // Upload file to S3
    const filename = await uploadToS3(req.file.originalname, req.file.buffer);
    if (!filename) {
      return res
        .status(500)
        .send(responser.error([ErrorCode.FILE_UPLOAD_ERROR]));
    }
    // Create file in database
    const file = await createFile({ filename });
    if (!file) {
      return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
    }
    const book = await createBook(
      { ...data, cover: file._id },
      new mongoose.Types.ObjectId("60b4f0c4d9f7f8b7a0d3d1b4") // TODO: Replace with logged user id);
    );
    if (!book) {
      return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
    }
    return res.status(201).send(responser.success({ bookId: book._id }));
  }
);

router.patch(
  "/:id/edit",
  upload.single("cover"),
  validator(schemas.books.edit),
  async (req, res) => {
    const bookId = new mongoose.Types.ObjectId(req.params.id);
    let data = {
      ...req.body,
    } as EditBookDto;
    if (req.body.exceptions) {
      data.exceptions = req.body.exceptions.split(",");
    }
    let cover;
    if (req.file) {
      // Upload file to S3
      const filename = await uploadToS3(req.file.originalname, req.file.buffer);
      if (!filename) {
        return res
          .status(500)
          .send(responser.error([ErrorCode.FILE_UPLOAD_ERROR]));
      }
      // Create file in database
      const file = await createFile({ filename });
      if (!file) {
        return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
      }
      cover = file._id;
    }
    // Update book
    const book = await updateBook(bookId, { ...data, cover });
    if (!book) {
      return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
    }
    return res.status(200).send(responser.success({ bookId: book._id }));
  }
);

export default router;
