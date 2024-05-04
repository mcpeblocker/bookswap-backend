import mongoose from "mongoose";
import { db } from "../core/database";
import logger from "../utils/logger";
import { ExchangeStatus } from "../enums/ExchangeStatus.enum";
import { BookStatus } from "../enums/BookStatus.enum";
import { createNotification } from "./notifications.service";
import { NotificationType } from "../enums/NotificationType.enum";

export async function requestExchange(
  userId: mongoose.Types.ObjectId,
  bookId: mongoose.Types.ObjectId
) {
  try {
    const book = await db.models.Book.findById(bookId);
    if (!book) {
      return null;
    }
    const exchange = new db.models.Exchange({
      requestedBy: userId,
      offeredBook: book._id,
      status: ExchangeStatus.REQUESTED,
    });
    await exchange.save();
    await createNotification(
      book.owner,
      book._id,
      userId,
      exchange._id,
      NotificationType.REQUEST
    );
    return exchange;
  } catch (error) {
    logger.silly("Error requesting exchange", { error });
    return null;
  }
}

export async function acceptExchange(
  exchangeId: mongoose.Types.ObjectId,
  bookId: mongoose.Types.ObjectId
) {
  try {
    const book = await db.models.Book.findById(bookId);
    if (!book) {
      return null;
    }
    const exchange = await db.models.Exchange.findById(exchangeId);
    if (!exchange) {
      return null;
    }
    book.status = BookStatus.RESERVED;
    exchange.status = ExchangeStatus.APPROVED;
    exchange.exchangedBook = bookId;
    exchange.approvedAt = new Date();
    // await book.save();
    // await exchange.save();
    // mark other exchanges as archived
    const exchanges = await db.models.Exchange.find({
      offeredBook: exchange.offeredBook,
      requestedBy: {
        $ne: exchange.requestedBy,
      },
      status: ExchangeStatus.REQUESTED,
    });
    for (let archivedExchange of exchanges) {
      archivedExchange.status = ExchangeStatus.ARCHIVED;
      //   await archivedExchange.save();
      await createNotification(
        archivedExchange.requestedBy,
        archivedExchange.offeredBook,
        book.owner,
        archivedExchange._id,
        NotificationType.ARCHIVE
      );
    }
    await createNotification(
      exchange.requestedBy,
      exchange.offeredBook,
      book.owner,
      exchange._id,
      NotificationType.APPROVE
    );
    return exchange;
  } catch (error) {
    logger.silly("Error accepting exchange", { error });
    return null;
  }
}

export async function completeExchange(
  exchangeId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) {
  try {
    const exchange = await db.models.Exchange.findById(exchangeId).populate(
      "offeredBook"
    );
    if (!exchange) {
      return null;
    }
    if (exchange.status !== ExchangeStatus.APPROVED) {
      return null;
    }
    let notifiedUserId;
    let otherUserId;
    if (exchange.requestedBy === userId) {
      notifiedUserId = (exchange.offeredBook as any).owner;
      otherUserId = exchange.offeredBook;
    } else if ((exchange.offeredBook as any).owner === userId) {
      notifiedUserId = exchange.requestedBy;
      otherUserId = (exchange.offeredBook as any).owner;
    }
    exchange.status = ExchangeStatus.COMPLETED;
    exchange.exchangedAt = new Date();
    await exchange.save();
    await createNotification(
      notifiedUserId,
      exchange.offeredBook,
      otherUserId,
      exchange._id,
      NotificationType.EXCHANGE
    );
    return exchange;
  } catch (error) {
    logger.silly("Error completing exchange", { error });
    return null;
  }
}

export async function getExchangesByUserId(userId: mongoose.Types.ObjectId) {
  try {
    const pipeline = [
      {
        $match: {
          requestedBy: userId,
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "offeredBook",
          foreignField: "_id",
          as: "offeredBook",
        },
      },
      {
        $unwind: {
          path: "$offeredBook",
        },
      },
      {
        $lookup: {
          from: "files",
          localField: "offeredBook.cover",
          foreignField: "_id",
          as: "offeredBook.cover",
        },
      },
      {
        $unwind: {
          path: "$offeredBook.cover",
        },
      },
      {
        $project: {
          _id: 0,
          exchangeId: "$_id",
          status: 1,
          offeredBook: {
            title: "$offeredBook.title",
            author: "$offeredBook.author",
            genre: "$offeredBook.genre",
            cover: "$offeredBook.cover.filename",
            createdAt: "$offeredBook.createdAt",
          },
        },
      },
    ];
    return await db.models.Exchange.aggregate(pipeline);
  } catch (error) {
    logger.silly("Error getting exchanges by user id", { error });
    return null;
  }
}

export async function getExchangesByBookId(bookId: mongoose.Types.ObjectId) {
  try {
    const pipeline = [
      {
        $match: {
          offeredBook: bookId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "requestedBy",
          foreignField: "_id",
          as: "requestedBy",
        },
      },
      {
        $unwind: {
          path: "$requestedBy",
        },
      },
      {
        $lookup: {
          from: "files",
          localField: "requestedBy.avatar",
          foreignField: "_id",
          as: "requestedBy.avatar",
        },
      },
      {
        $unwind: {
          path: "$requestedBy.avatar",
        },
      },
      {
        $project: {
          _id: 0,
          exchangeId: "$_id",
          status: 1,
          createdAt: 1,
          requestedBy: {
            userId: "$requestedBy._id",
            nickname: "$requestedBy.nickname",
            avatar: "$requestedBy.avatar.filename",
          },
        },
      },
    ];
    return await db.models.Exchange.aggregate(pipeline);
  } catch (error) {
    logger.silly("Error getting exchanges by book id", { error });
    return null;
  }
}
