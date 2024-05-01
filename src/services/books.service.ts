import mongoose from "mongoose";
import { db } from "../core/database";
import { BookStatus } from "../enums/BookStatus.enum";
import { IBook } from "../interfaces/Book.interface";
import logger from "../utils/logger";

export async function createBook(
  data: Pick<
    IBook,
    "title" | "author" | "genre" | "visibility" | "exceptions" | "cover"
  >,
  ownerId: mongoose.Types.ObjectId
) {
  try {
    const newBook = new db.models.Book({
      ...data,
      owner: ownerId,
      status: BookStatus.AVAILABLE,
    });
    return await newBook.save();
  } catch (error) {
    logger.silly("Error creating book", { error });
    return null;
  }
}

export async function updateBook(
  bookId: mongoose.Types.ObjectId,
  data: Partial<
    Pick<
      IBook,
      "title" | "author" | "genre" | "visibility" | "exceptions" | "cover"
    >
  >
) {
  try {
    return await db.models.Book.findByIdAndUpdate(
      bookId,
      {
        $set: data,
      },
      {
        new: true,
      }
    );
  } catch (error) {
    logger.silly("Error updating book", { error });
    return null;
  }
}
