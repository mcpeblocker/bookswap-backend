import mongoose from "mongoose";
import { db } from "../core/database";
import logger from "../utils/logger";
import { ExchangeStatus } from "../enums/ExchangeStatus.enum";

export async function getChatsByUserId(userId: mongoose.Types.ObjectId) {
  try {
    const pipeline = [
      {
        $match: {
          $or: [
            {
              status: ExchangeStatus.APPROVED,
            },
            {
              status: ExchangeStatus.COMPLETED,
            },
          ],
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
        $match: {
          $or: [
            {
              "offeredBook.owner": userId,
            },
            {
              requestedBy: userId,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "exchange",
          as: "messages",
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "exchangedBook",
          foreignField: "_id",
          as: "exchangedBook",
        },
      },
      {
        $unwind: {
          path: "$exchangedBook",
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
          from: "users",
          localField: "offeredBook.owner",
          foreignField: "_id",
          as: "offeredBook.owner",
        },
      },
      {
        $unwind: {
          path: "$offeredBook.owner",
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
        $lookup: {
          from: "files",
          localField: "exchangedBook.cover",
          foreignField: "_id",
          as: "exchangedBook.cover",
        },
      },
      {
        $unwind: {
          path: "$exchangedBook.cover",
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
        $lookup: {
          from: "files",
          localField: "offeredBook.owner.avatar",
          foreignField: "_id",
          as: "offeredBook.owner.avatar",
        },
      },
      {
        $unwind: {
          path: "$offeredBook.owner.avatar",
        },
      },
      {
        $addFields: {
          latestMessage: {
            $last: "$messages",
          },
        },
      },
      {
        $project: {
          _id: 0,
          exchangeId: "$_id",
          status: 1,
          approvedAt: 1,
          exchangedAt: 1,
          offeredBook: {
            title: "$offeredBook.title",
            cover: "$offeredBook.cover.filename",
          },
          offeredBy: {
            userId: "$offeredBook.owner._id",
            nickname: "$offeredBook.owner.nickname",
            avatar: "$offeredBook.owner.avatar.filename",
          },
          exchangedBook: {
            title: "$exchangedBook.title",
            cover: "$exchangedBook.cover.filename",
          },
          requestedBy: {
            userId: "$requestedBy._id",
            nickname: "$requestedBy.nickname",
            avatar: "$requestedBy.avatar.filename",
          },
          latestMessage: {
            sender: "$latestMessage.sender",
            text: "$latestMessage.text",
            createdAt: "$latestMessage.createdAt",
            seen: "$latestMessage.seen",
          },
        },
      },
    ];
    return await db.models.Exchange.aggregate(pipeline);
  } catch (error) {
    logger.silly("Error getting chats by user id", { error });
    return null;
  }
}

export async function getChatByExchangeId(
  exchangeId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) {
  try {
    const pipeline = [
      {
        $match: {
          $or: [
            {
              _id: exchangeId,
              status: ExchangeStatus.APPROVED,
            },
            {
              _id: exchangeId,
              status: ExchangeStatus.COMPLETED,
            },
          ],
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
        $match: {
          $or: [
            {
              "offeredBook.owner": userId,
            },
            {
              requestedBy: userId,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "exchangedBook",
          foreignField: "_id",
          as: "exchangedBook",
        },
      },
      {
        $unwind: {
          path: "$exchangedBook",
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
          from: "users",
          localField: "offeredBook.owner",
          foreignField: "_id",
          as: "offeredBook.owner",
        },
      },
      {
        $unwind: {
          path: "$offeredBook.owner",
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
        $lookup: {
          from: "files",
          localField: "exchangedBook.cover",
          foreignField: "_id",
          as: "exchangedBook.cover",
        },
      },
      {
        $unwind: {
          path: "$exchangedBook.cover",
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
        $lookup: {
          from: "files",
          localField: "offeredBook.owner.avatar",
          foreignField: "_id",
          as: "offeredBook.owner.avatar",
        },
      },
      {
        $unwind: {
          path: "$offeredBook.owner.avatar",
        },
      },
      {
        $project: {
          _id: 0,
          exchangeId: "$_id",
          status: 1,
          approvedAt: 1,
          exchangedAt: 1,
          offeredBook: {
            title: "$offeredBook.title",
            cover: "$offeredBook.cover.filename",
          },
          offeredBy: {
            userId: "$offeredBook.owner._id",
            nickname: "$offeredBook.owner.nickname",
            avatar: "$offeredBook.owner.avatar.filename",
          },
          exchangedBook: {
            title: "$exchangedBook.title",
            cover: "$exchangedBook.cover.filename",
          },
          requestedBy: {
            userId: "$requestedBy._id",
            nickname: "$requestedBy.nickname",
            avatar: "$requestedBy.avatar.filename",
          },
        },
      },
    ];
    const result = await db.models.Exchange.aggregate(pipeline);
    if (!result[0]) {
      return null;
    }
    await db.models.Message.updateMany(
      {
        exchange: exchangeId,
        sender: { $ne: userId },
        seen: false,
      },
      { $set: { seen: true } }
    );
    return result[0];
  } catch (error) {
    logger.silly("Error getting chat by exchange id", { error });
    return null;
  }
}

export async function getMessagesByExchangeId(
  exchangeId: mongoose.Types.ObjectId
) {
  try {
    return await db.models.Message.find({ exchange: exchangeId }).select({
      _id: 0,
      text: 1,
      sender: 1,
      seen: 1,
      createdAt: 1,
    });
  } catch (error) {
    logger.silly("Error getting messages by exchange id", { error });
    return null;
  }
}
