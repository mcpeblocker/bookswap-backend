import mongoose from "mongoose";
import { db } from "../core/database";
import { NotificationType } from "../enums/NotificationType.enum";
import { io } from "../core/io";

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
          bookId: "$book._id",
          cover: "$book.cover.filename",
        },
        actor: {
          nickname: "$actor.nickname",
          avatar: "$actor.avatar.filename",
        },
      },
    },
  ];
  const notifications = await db.models.Notification.aggregate(pipeline).sort({
    createdAt: -1,
  });
  // Mark notifications as seen
  await db.models.Notification.updateMany(
    { user: userId, seen: false },
    { $set: { seen: true } }
  );
  return notifications;
}

export async function createNotification(
  userId: mongoose.Types.ObjectId,
  bookId: mongoose.Types.ObjectId,
  actorId: mongoose.Types.ObjectId,
  exchangeId: mongoose.Types.ObjectId,
  type: NotificationType
) {
  const book = await db.models.Book.findById(bookId).lean();
  const actor = await db.models.User.findById(actorId).lean();
  if (!book || !actor) {
    return null;
  }
  const bookCover = await db.models.File.findById(book.cover);
  const actorAvatar = await db.models.File.findById(actor.avatar);
  let notification = new db.models.Notification({
    user: userId,
    book: bookId,
    actor: actorId,
    exchange: exchangeId,
    type,
  });
  notification = await notification.save();
  io.to(userId.toString()).emit("notification", {
    notificationId: notification._id,
    type,
    seen: notification.seen,
    createdAt: notification.createdAt,
    exchangeId: exchangeId.toString(),
    book: {
      bookId: bookId.toString(),
      cover: bookCover?.filename,
    },
    actor: {
      nickname: actor.nickname,
      avatar: actorAvatar?.filename,
    },
  });
  return notification;
}
