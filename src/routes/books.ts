import express from "express";
import { upload } from "../middlewares/upload";
import { uploadToS3 } from "../services/s3.service";
import { createFile } from "../services/files.service";
import schemas from "../schemas";
import { responser, validator } from "../utils/requests";
import { ErrorCode } from "../enums/ErrorCode.enum";
import { EditBookDto, UploadBookDto } from "../dto";
import {
  createBook,
  getBooksForFeed,
  getMyBookshelf,
  getUsersBookshelf,
  isOwnerOfBook,
  searchBooks,
  updateBook,
} from "../services/books.service";
import mongoose from "mongoose";
import { auth } from "../middlewares/auth";
import { AuthRequest } from "../interfaces/AuthRequest.interface";

const router = express.Router();

router.use(auth);

router.post(
  "/upload",
  upload.single("cover"),
  validator(schemas.books.upload),
  async (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
    }
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
      new mongoose.Types.ObjectId(req.userId)
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
  async (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
    }
    const bookId = new mongoose.Types.ObjectId(req.params.id);
    // Check if user is owner of the book
    const isOwner = await isOwnerOfBook(
      bookId,
      new mongoose.Types.ObjectId(req.userId)
    );
    if (!isOwner) {
      return res.status(403).send(responser.error([ErrorCode.FORBIDDEN]));
    }
    let data = req.body as EditBookDto;
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

router.get("/bookshelf/my", auth, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  const bookshelf = await getMyBookshelf(req.userId);
  if (!bookshelf) {
    return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
  }
  return res.status(200).json(responser.success(bookshelf));
});

router.get("/bookshelf/:userId", auth, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  if (!req.params.userId) {
    return res.status(400).send(responser.error([ErrorCode.INVALID_ID]));
  }
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  const bookshelf = await getUsersBookshelf(userId);
  if (!bookshelf) {
    return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
  }
  return res.status(200).json(responser.success(bookshelf));
});

router.get("/search", auth, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  if (!req.query.text) {
    return res.status(400).send(responser.error([ErrorCode.INVALID_QUERY]));
  }
  const text = req.query.text as string;
  const books = await searchBooks(text);
  if (!books) {
    return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
  }
  return res.status(200).json(responser.success({ books }));
});

router.get("/feed", auth, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  const books = await getBooksForFeed(req.userId);
  if (!books) {
    return res.status(500).json(responser.error([ErrorCode.SERVER_ERROR]));
  }
  return res.status(200).json(responser.success({ books }));
});

export default router;
