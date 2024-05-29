import mongoose from "mongoose";
import { db } from "../core/database";
import { BookStatus } from "../enums/BookStatus.enum";
import { IBook } from "../interfaces/Book.interface";
import logger from "../utils/logger";
import { ExchangeStatus } from "../enums/ExchangeStatus.enum";

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

export async function isOwnerOfBook(
  bookId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) {
  try {
    const book = await db.models.Book.findOne({
      _id: bookId,
      owner: userId,
    });
    if (book) {
      return true;
    }
    return false;
  } catch (error) {
    logger.silly("Error getting book", { error });
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

export async function deleteBook(bookId: mongoose.Types.ObjectId) {
  try {
    return await db.models.Book.findByIdAndDelete(bookId);
  } catch (error) {
    logger.silly("Error deleting book", { error });
    return null;
  }
}

export async function getBookById(
  bookId: mongoose.Types.ObjectId
): Promise<IBook | null> {
  try {
    return await db.models.Book.findById(bookId).populate("cover");
  } catch (error) {
    logger.silly("Error getting book", { error });
    return null;
  }
}

export async function searchBooks(
  text: string,
  userId: mongoose.Types.ObjectId
) {
  try {
    const pipeline = [
      {
        $match: {
          $or: [
            { title: { $regex: new RegExp(text, "ig") } },
            { author: { $regex: new RegExp(text, "ig") } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "exceptions",
          foreignField: "_id",
          as: "exceptions",
        },
      },
      {
        $match: {
          $or: [
            {
              visibility: "PUBLIC",
            },
            {
              visibility: "EXCEPTIONAL_PUBLIC",
              "exceptions._id": {
                $ne: userId,
              },
            },
            {
              visibility: "EXCEPTIONAL_PRIVATE",
              "exceptions._id": userId,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "files",
          localField: "cover",
          foreignField: "_id",
          as: "cover",
        },
      },
      {
        $unwind: {
          path: "$cover",
        },
      },
      {
        $lookup: {
          from: "exchanges",
          localField: "_id",
          foreignField: "offeredBook",
          as: "exchanges",
        },
      },
      {
        $project: {
          _id: 0,
          bookId: "$_id",
          title: 1,
          author: 1,
          genre: 1,
          cover: "$cover.filename",
          createdAt: 1,
          status: 1,
          exchangeId: {
            $getField: {
              field: "_id",
              input: {
                $first: {
                  $filter: {
                    input: "$exchanges",
                    as: "exchange",
                    cond: {
                      $eq: ["$$exchange.requestedBy", userId],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ];
    return await db.models.Book.aggregate(pipeline);
  } catch (error) {
    logger.silly("Error searching books", { error });
    return null;
  }
}

export async function getMyBookshelf(userId: mongoose.Types.ObjectId) {
  try {
    const pipeline = [
      {
        $match: {
          owner: userId,
        },
      },
      {
        $lookup: {
          from: "files",
          localField: "cover",
          foreignField: "_id",
          as: "cover",
        },
      },
      {
        $unwind: {
          path: "$cover",
        },
      },
      {
        $facet: {
          available: [
            {
              $match: {
                status: BookStatus.AVAILABLE,
              },
            },
            {
              $project: {
                _id: 0,
                bookId: "$_id",
                title: 1,
                author: 1,
                genre: 1,
                cover: "$cover.filename",
                visibility: 1,
                status: 1,
                createdAt: 1,
                exceptions: 1,
              },
            },
          ],
          reserved: [
            {
              $match: {
                status: BookStatus.RESERVED,
              },
            },
            {
              $lookup: {
                from: "exchanges",
                localField: "_id",
                foreignField: "offeredBook",
                as: "exchange",
              },
            },
            {
              $unwind: {
                path: "$exchange",
              },
            },
            {
              $match: {
                "exchange.status": ExchangeStatus.APPROVED,
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "exchange.requestedBy",
                foreignField: "_id",
                as: "exchange.requestedBy",
              },
            },
            {
              $unwind: {
                path: "$exchange.requestedBy",
              },
            },
            {
              $lookup: {
                from: "files",
                localField: "exchange.requestedBy.avatar",
                foreignField: "_id",
                as: "exchange.requestedBy.avatar",
              },
            },
            {
              $unwind: {
                path: "$exchange.requestedBy.avatar",
              },
            },
            {
              $lookup: {
                from: "books",
                localField: "exchange.exchangedBook",
                foreignField: "_id",
                as: "exchange.exchangedBook",
              },
            },
            {
              $unwind: {
                path: "$exchange.exchangedBook",
              },
            },
            {
              $lookup: {
                from: "files",
                localField: "exchange.exchangedBook.cover",
                foreignField: "_id",
                as: "exchange.exchangedBook.cover",
              },
            },
            {
              $unwind: {
                path: "$exchange.exchangedBook.cover",
              },
            },
            {
              $project: {
                _id: 0,
                bookId: "$_id",
                title: 1,
                author: 1,
                genre: 1,
                cover: "$cover.filename",
                visibility: 1,
                status: 1,
                createdAt: 1,
                exceptions: 1,
                exchange: {
                  exchangeId: "$exchange._id",
                  approvedAt: "$exchange.approvedAt",
                  requestedBy: {
                    nickname: "$exchange.requestedBy.nickname",
                    avatar: "$exchange.requestedBy.avatar.filename",
                  },
                  exchangedBook: {
                    title: "$exchange.exchangedBook.title",
                    author: "$exchange.exchangedBook.author",
                    cover: "$exchange.exchangedBook.cover.filename",
                  },
                },
              },
            },
          ],
          offered: [
            {
              $match: {
                status: "EXCHANGED",
              },
            },
            {
              $lookup: {
                from: "exchanges",
                localField: "_id",
                foreignField: "offeredBook",
                as: "exchange",
              },
            },
            {
              $unwind: {
                path: "$exchange",
              },
            },
            {
              $match: {
                "exchange.status": "COMPLETED",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "exchange.requestedBy",
                foreignField: "_id",
                as: "exchange.requestedBy",
              },
            },
            {
              $unwind: {
                path: "$exchange.requestedBy",
              },
            },
            {
              $lookup: {
                from: "files",
                localField: "exchange.requestedBy.avatar",
                foreignField: "_id",
                as: "exchange.requestedBy.avatar",
              },
            },
            {
              $unwind: {
                path: "$exchange.requestedBy.avatar",
              },
            },
            {
              $lookup: {
                from: "books",
                localField: "exchange.exchangedBook",
                foreignField: "_id",
                as: "exchange.exchangedBook",
              },
            },
            {
              $unwind: {
                path: "$exchange.exchangedBook",
              },
            },
            {
              $lookup: {
                from: "files",
                localField: "exchange.exchangedBook.cover",
                foreignField: "_id",
                as: "exchange.exchangedBook.cover",
              },
            },
            {
              $unwind: {
                path: "$exchange.exchangedBook.cover",
              },
            },
            {
              $project: {
                _id: 0,
                bookId: "$_id",
                title: 1,
                author: 1,
                genre: 1,
                cover: "$cover.filename",
                visibility: 1,
                status: 1,
                createdAt: 1,
                exceptions: 1,
                exchange: {
                  exchangeId: "$exchange._id",
                  approvedAt: "$exchange.approvedAt",
                  exchangedAt: "$exchange.exchangedAt",
                  requestedBy: {
                    nickname: "$exchange.requestedBy.nickname",
                    avatar: "$exchange.requestedBy.avatar.filename",
                  },
                  exchangedBook: {
                    title: "$exchange.exchangedBook.title",
                    author: "$exchange.exchangedBook.author",
                    cover: "$exchange.exchangedBook.cover.filename",
                  },
                },
              },
            },
          ],
          exchanged: [
            {
              $match: {
                status: "EXCHANGED",
              },
            },
            {
              $lookup: {
                from: "exchanges",
                localField: "_id",
                foreignField: "exchangedBook",
                as: "exchange",
              },
            },
            {
              $unwind: {
                path: "$exchange",
              },
            },
            {
              $match: {
                "exchange.status": "COMPLETED",
              },
            },
            {
              $lookup: {
                from: "books",
                localField: "exchange.offeredBook",
                foreignField: "_id",
                as: "exchange.offeredBook",
              },
            },
            {
              $unwind: {
                path: "$exchange.offeredBook",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "exchange.offeredBook.owner",
                foreignField: "_id",
                as: "exchange.offeredBook.owner",
              },
            },
            {
              $unwind: {
                path: "$exchange.offeredBook.owner",
              },
            },
            {
              $lookup: {
                from: "files",
                localField: "exchange.offeredBook.owner.avatar",
                foreignField: "_id",
                as: "exchange.offeredBook.owner.avatar",
              },
            },
            {
              $unwind: {
                path: "$exchange.offeredBook.owner.avatar",
              },
            },
            {
              $lookup: {
                from: "files",
                localField: "exchange.offeredBook.cover",
                foreignField: "_id",
                as: "exchange.offeredBook.cover",
              },
            },
            {
              $unwind: {
                path: "$exchange.offeredBook.cover",
              },
            },
            {
              $project: {
                _id: 0,
                bookId: "$_id",
                title: 1,
                author: 1,
                genre: 1,
                cover: "$cover.filename",
                visibility: 1,
                status: 1,
                createdAt: 1,
                exceptions: 1,
                exchange: {
                  exchangeId: "$exchange._id",
                  approvedAt: "$exchange.approvedAt",
                  exchangedAt: "$exchange.exchangedAt",
                  offeredBy: {
                    nickname: "$exchange.offeredBook.owner.nickname",
                    avatar: "$exchange.offeredBook.owner.avatar.filename",
                  },
                  offeredBook: {
                    title: "$exchange.offeredBook.title",
                    author: "$exchange.offeredBook.author",
                    cover: "$exchange.offeredBook.cover.filename",
                  },
                },
              },
            },
          ],
        },
      },
    ];
    const result = await db.models.Book.aggregate(pipeline);
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (error) {
    logger.silly("Error getting bookshelf", { error });
    return null;
  }
}

export async function getUsersBookshelf(userId: mongoose.Types.ObjectId) {
  try {
    const pipeline = [
      {
        $match: {
          owner: userId,
          status: BookStatus.AVAILABLE,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "exceptions",
          foreignField: "_id",
          as: "exceptions",
        },
      },
      {
        $match: {
          $or: [
            {
              visibility: "PUBLIC",
            },
            {
              visibility: "EXCEPTIONAL_PUBLIC",
              "exceptions._id": {
                $ne: userId,
              },
            },
            {
              visibility: "EXCEPTIONAL_PRIVATE",
              "exceptions._id": userId,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "files",
          localField: "cover",
          foreignField: "_id",
          as: "cover",
        },
      },
      {
        $unwind: {
          path: "$cover",
        },
      },
      {
        $project: {
          _id: 0,
          bookId: "$_id",
          title: 1,
          author: 1,
          genre: 1,
          cover: "$cover.filename",
          createdAt: 1,
        },
      },
    ];
    return { books: await db.models.Book.aggregate(pipeline) };
  } catch (error) {
    logger.silly("Error getting bookshelf", { error });
    return null;
  }
}

export async function getBooksForFeed(
  userId: mongoose.Types.ObjectId,
  size: number = 50
) {
  try {
    const pipeline = [
      {
        $match: {
          owner: {
            $ne: userId,
          },
          status: "AVAILABLE",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "exceptions",
          foreignField: "_id",
          as: "exceptions",
        },
      },
      {
        $match: {
          $or: [
            {
              visibility: "PUBLIC",
            },
            {
              visibility: "EXCEPTIONAL_PUBLIC",
              "exceptions._id": {
                $ne: userId,
              },
            },
            {
              visibility: "EXCEPTIONAL_PRIVATE",
              "exceptions._id": userId,
            },
          ],
        },
      },
      {
        $sample: {
          size,
        },
      },
      {
        $lookup: {
          from: "files",
          localField: "cover",
          foreignField: "_id",
          as: "cover",
        },
      },
      {
        $unwind: {
          path: "$cover",
        },
      },
      {
        $lookup: {
          from: "exchanges",
          localField: "_id",
          foreignField: "offeredBook",
          as: "exchanges",
        },
      },
      {
        $project: {
          _id: 0,
          bookId: "$_id",
          title: 1,
          author: 1,
          genre: 1,
          cover: "$cover.filename",
          createdAt: 1,
          status: 1,
          exchangeId: {
            $getField: {
              field: "_id",
              input: {
                $first: {
                  $filter: {
                    input: "$exchanges",
                    as: "exchange",
                    cond: {
                      $eq: ["$$exchange.requestedBy", userId],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ];
    return await db.models.Book.aggregate(pipeline);
  } catch (error) {
    logger.silly("Error getting books for feed", { error });
    return null;
  }
}
