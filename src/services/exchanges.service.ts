import mongoose from "mongoose";
import { db } from "../core/database";
import logger from "../utils/logger";
import { ExchangeStatus } from "../enums/ExchangeStatus.enum";
import { BookStatus } from "../enums/BookStatus.enum";
import { createNotification } from "./notifications.service";
import { NotificationType } from "../enums/NotificationType.enum";
import { getSocket } from "../events";

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
  bookId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) {
  try {
    const exchangedBook = await db.models.Book.findById(bookId);
    if (!exchangedBook) {
      return null;
    }
    if (exchangedBook.status !== BookStatus.AVAILABLE) {
      return null;
    }
    const exchange = await db.models.Exchange.findById(exchangeId);
    if (!exchange) {
      return null;
    }
    if (exchange.status !== ExchangeStatus.REQUESTED) {
      return null;
    }
    const offeredBook = await db.models.Book.findById(exchange.offeredBook);
    if (!offeredBook) {
      return null;
    }
    if (offeredBook.owner.toString() !== userId.toString()) {
      return null;
    }
    if (offeredBook.status !== BookStatus.AVAILABLE) {
      return null;
    }
    offeredBook.status = BookStatus.RESERVED;
    exchangedBook.status = BookStatus.RESERVED;
    exchange.status = ExchangeStatus.APPROVED;
    exchange.exchangedBook = bookId;
    exchange.approvedAt = new Date();
    await offeredBook.save();
    await exchangedBook.save();
    await exchange.save();
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
      await archivedExchange.save();
      await createNotification(
        archivedExchange.requestedBy,
        archivedExchange.offeredBook,
        userId,
        archivedExchange._id,
        NotificationType.ARCHIVE
      );
    }
    await createNotification(
      exchange.requestedBy,
      exchange.offeredBook,
      userId,
      exchange._id,
      NotificationType.APPROVE
    );
    const userSockets = [];
    const requestedUserSocket = getSocket(exchange.requestedBy.toString());
    if (requestedUserSocket) {
      userSockets.push(requestedUserSocket);
    }
    const offeredUserSocket = getSocket(userId.toString());
    if (offeredUserSocket) {
      userSockets.push(offeredUserSocket);
    }
    for (let socket of userSockets) {
      socket.join(exchange._id.toString());
    }
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
    const exchange = await db.models.Exchange.findById(exchangeId);
    if (!exchange) {
      return null;
    }
    const offeredBook = await db.models.Book.findById(exchange.offeredBook);
    if (!offeredBook) {
      return null;
    }
    const exchangedBook = await db.models.Book.findById(exchange.exchangedBook);
    if (!exchangedBook) {
      return null;
    }
    if (exchange.status !== ExchangeStatus.APPROVED) {
      return null;
    }
    // Only the user who sent the request can complete exchange
    if (exchange.requestedBy.toString() !== userId.toString()) {
      return null;
    }
    offeredBook.status = BookStatus.EXCHANGED;
    exchangedBook.status = BookStatus.EXCHANGED;
    exchange.status = ExchangeStatus.COMPLETED;
    exchange.exchangedAt = new Date();
    await offeredBook.save();
    await exchangedBook.save();
    await exchange.save();
    await createNotification(
      offeredBook.owner,
      exchange.offeredBook,
      exchangedBook.owner,
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
