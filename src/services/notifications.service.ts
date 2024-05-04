import mongoose from "mongoose";
import { db } from "../core/database";
import { NotificationType } from "../enums/NotificationType.enum";

export async function getNotifications(userId: mongoose.Types.ObjectId) {
  const pipeline = [
    {
      $match: {
        user: userId,
      },
    },
    {
      $lookup: {
        from: "exchanges",
        localField: "exchange",
        foreignField: "_id",
        as: "exchange",
      },
    },
    {
      $unwind: {
        path: "$exchange",
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "book",
        foreignField: "_id",
        as: "book",
      },
    },
    {
      $unwind: {
        path: "$book",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "actor",
        foreignField: "_id",
        as: "actor",
      },
    },
    {
      $unwind: {
        path: "$actor",
      },
    },
    {
      $lookup: {
        from: "files",
        localField: "book.cover",
        foreignField: "_id",
        as: "book.cover",
      },
    },
    {
      $unwind: {
        path: "$book.cover",
      },
    },
    {
      $lookup: {
        from: "files",
        localField: "actor.avatar",
        foreignField: "_id",
        as: "actor.avatar",
      },
    },
    {
      $unwind: {
        path: "$actor.avatar",
      },
    },
    {
      $project: {
        _id: 0,
        notificationId: "$_id",
        type: 1,
        seen: 1,
        createdAt: 1,
        exchangeId: "$exchange._id",
        book: {
          cover: "$book.cover.filename",
        },
        actor: {
          nickname: "$actor.nickname",
          avatar: "$actor.avatar.filename",
        },
      },
    },
  ];
  return await db.models.Notification.aggregate(pipeline).sort({
    createdAt: -1,
  });
}

export async function createNotification(
  userId: mongoose.Types.ObjectId,
  bookId: mongoose.Types.ObjectId,
  actorId: mongoose.Types.ObjectId,
  exchangeId: mongoose.Types.ObjectId,
  type: NotificationType
) {
  const notification = new db.models.Notification({
    user: userId,
    book: bookId,
    actor: actorId,
    exchange: exchangeId,
    type,
  });
  await notification.save();
  return notification;
}
