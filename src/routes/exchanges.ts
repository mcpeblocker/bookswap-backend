import express from "express";
import { auth } from "../middlewares/auth";
import { responser, validator } from "../utils/requests";
import schemas from "../schemas";
import { AuthRequest } from "../interfaces/AuthRequest.interface";
import { ErrorCode } from "../enums/ErrorCode.enum";
import { getBookById } from "../services/books.service";
import mongoose from "mongoose";
import { BookStatus } from "../enums/BookStatus.enum";
import {
  acceptExchange,
  completeExchange,
  getExchangesByBookId,
  getExchangesByUserId,
  requestExchange,
} from "../services/exchanges.service";
import { IFile } from "../interfaces/File.interface";

const router = express.Router();

router.post(
  "/request",
  auth,
  validator(schemas.exchanges.request),
  async (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
    }
    if (!req.body?.bookId) {
      return res.status(400).send(responser.error([ErrorCode.INVALID_ID]));
    }
    const bookId = req.body.bookId as mongoose.Types.ObjectId;
    const book = await getBookById(bookId);
    // prevents user from requesting a non-existent book
    if (!book) {
      return res.status(404).send(responser.error([ErrorCode.SERVER_ERROR]));
    }
    // prevents user from requesting their own book
    if (book.owner.toString() === req.userId.toString()) {
      return res.status(403).send(responser.error([ErrorCode.FORBIDDEN]));
    }
    // prevents user from requesting a book that is already in an exchange
    if (book.status !== BookStatus.AVAILABLE) {
      return res.status(403).send(responser.error([ErrorCode.FORBIDDEN]));
    }
    const exchange = await requestExchange(req.userId, bookId);
    if (!exchange) {
      return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
    }
    return res
      .status(201)
      .send(responser.success({ exchangeId: exchange._id }));
  }
);

router.post(
  "/accept",
  auth,
  validator(schemas.exchanges.accept),
  async (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
    }
    const exchangeId = req.body.exchangeId as mongoose.Types.ObjectId;
    const bookId = req.body.bookId as mongoose.Types.ObjectId;
    const exchange = await acceptExchange(exchangeId, bookId, req.userId);
    if (!exchange) {
      return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
    }
    return res
      .status(200)
      .send(responser.success({ exchangeId: exchange._id }));
  }
);

router.post(
  "/swap",
  auth,
  validator(schemas.exchanges.swap),
  async (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
    }
    const exchangeId = req.body.exchangeId as mongoose.Types.ObjectId;
    const exchange = await completeExchange(exchangeId, req.userId);
    if (!exchange) {
      return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
    }
    return res.status(200).send(
      responser.success({
        exchangeId: exchange._id,
      })
    );
  }
);

router.get("/my", auth, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  const exchanges = await getExchangesByUserId(req.userId);
  if (!exchanges) {
    return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
  }
  return res.status(200).send(responser.success({ exchanges }));
});

router.get("/:bookId", auth, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).send(responser.error([ErrorCode.UNAUTHORIZED]));
  }
  if (!req.params.bookId) {
    return res.status(400).send(responser.error([ErrorCode.INVALID_ID]));
  }
  const bookId = new mongoose.Types.ObjectId(req.params.bookId);
  const book = await getBookById(bookId);
  if (!book) {
    return res.status(400).send(responser.error([ErrorCode.INVALID_ID]));
  }
  if (book.owner.toString() !== req.userId.toString()) {
    return res.status(403).send(responser.error([ErrorCode.FORBIDDEN]));
  }
  const exchanges = await getExchangesByBookId(book._id);
  if (!exchanges) {
    return res.status(500).send(responser.error([ErrorCode.SERVER_ERROR]));
  }
  return res.status(200).send(
    responser.success({
      book: {
        title: book.title,
        author: book.author,
        genre: book.genre,
        cover: (book.cover as IFile).filename,
        createdAt: book.createdAt,
        status: book.status,
      },
      exchanges,
    })
  );
});

export default router;
